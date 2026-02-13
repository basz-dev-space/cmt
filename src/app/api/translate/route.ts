import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface TranslateRequest {
  texts: Array<{
    id: string
    text: string
    context?: string
  }>
  sourceLang: string
  targetLang: string
  pageContext?: string // Additional context about the page/scene
}

export async function POST(request: NextRequest) {
  try {
    const { texts, sourceLang, targetLang, pageContext }: TranslateRequest = await request.json()
    
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: 'Texts array is required' },
        { status: 400 }
      )
    }
    
    // Initialize ZAI SDK
    const zai = await ZAI.create()
    
    const languageNames: Record<string, string> = {
      'ja': 'Japanese',
      'en': 'English',
      'ko': 'Korean',
      'zh': 'Chinese',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ar': 'Arabic',
      'th': 'Thai',
      'vi': 'Vietnamese',
      'id': 'Indonesian',
    }
    
    const sourceLanguage = languageNames[sourceLang] || sourceLang
    const targetLanguage = languageNames[targetLang] || targetLang
    
    // Build translation prompt with context
    const systemPrompt = `You are a professional comic/manga translator specializing in ${sourceLanguage} to ${targetLanguage} translation.

Key translation principles:
1. Maintain the character's voice and personality
2. Keep dialogue natural and conversational
3. Preserve honorifics when culturally appropriate
4. Handle onomatopoeia/SFX creatively (adapt to target language conventions)
5. Consider speech bubble space constraints (keep translations concise)
6. Maintain emotional tone and impact

${pageContext ? `Page context: ${pageContext}` : ''}

Return translations as a JSON array:
[{"id": "original_id", "translation": "translated text"}]

Return ONLY the JSON array, no other text.`

    const textList = texts.map(t => `ID: ${t.id}\nText: "${t.text}"${t.context ? `\nContext: ${t.context}` : ''}`).join('\n\n')
    
    const userPrompt = `Translate these ${sourceLanguage} comic texts to ${targetLanguage}:

${textList}`

    const response = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      thinking: { type: 'disabled' }
    })
    
    const content = response.choices[0]?.message?.content || '[]'
    
    // Parse the JSON response
    let translations: Array<{ id: string; translation: string }> = []
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        translations = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.error('Failed to parse translation response:', e)
    }
    
    // Create a map for quick lookup
    const translationMap = new Map(
      translations.map(t => [t.id, t.translation])
    )
    
    // Return translations in the same order as input
    const results = texts.map(t => ({
      id: t.id,
      originalText: t.text,
      translation: translationMap.get(t.id) || ''
    }))
    
    return NextResponse.json({
      success: true,
      translations: results,
      sourceLang,
      targetLang,
      rawResponse: content
    })
    
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Failed to translate text', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Batch translation for entire page with context
export async function PUT(request: NextRequest) {
  try {
    const { 
      texts, 
      sourceLang, 
      targetLang, 
      imageUrl 
    }: TranslateRequest & { imageUrl?: string } = await request.json()
    
    const zai = await ZAI.create()
    
    // If we have an image URL, use VLM for context-aware translation
    if (imageUrl) {
      const systemPrompt = `You are a professional comic/manga translator. Translate the following texts from ${sourceLang} to ${targetLang}, considering the visual context from the image.

Consider:
- Character expressions and emotions
- Scene atmosphere
- Panel layout and flow
- Character relationships (if discernible)

Return translations as JSON array: [{"id": "id", "translation": "translated text"}]`

      const textList = texts.map(t => `ID: ${t.id}\nText: "${t.text}"`).join('\n')
      
      const response = await zai.chat.completions.createVision({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              { type: 'text', text: `Translate these texts:\n\n${textList}` },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        thinking: { type: 'disabled' }
      })
      
      const content = response.choices[0]?.message?.content || '[]'
      
      let translations: Array<{ id: string; translation: string }> = []
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          translations = JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.error('Failed to parse VLM translation response:', e)
      }
      
      const translationMap = new Map(translations.map(t => [t.id, t.translation]))
      
      return NextResponse.json({
        success: true,
        translations: texts.map(t => ({
          id: t.id,
          originalText: t.text,
          translation: translationMap.get(t.id) || ''
        })),
        contextAware: true
      })
    }
    
    // Fall back to regular translation
    return POST(request)
    
  } catch (error) {
    console.error('Context-aware translation error:', error)
    return NextResponse.json(
      { error: 'Failed to translate with context', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
