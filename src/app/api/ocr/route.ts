import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface TextDetection {
  text: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  confidence: number
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }
    
    // Initialize ZAI SDK
    const zai = await ZAI.create()
    
    // Use VLM to detect and extract text from comic page
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this comic/manga page and extract all text elements. For each text element, provide:
1. The text content (in original language)
2. Bounding box coordinates as percentages of image dimensions (x, y as top-left corner, width, height - all values from 0 to 100)
3. Approximate rotation angle in degrees
4. Confidence score (0-1)

Return the result as a JSON array with this format:
[{
  "text": "extracted text",
  "x": 10.5,
  "y": 20.3,
  "width": 15.2,
  "height": 8.4,
  "rotation": 0,
  "confidence": 0.95
}]

Important:
- x and y are the top-left corner position as percentage (0-100)
- width and height are the size as percentage (0-100)
- rotation is clockwise angle in degrees
- Include ALL text: speech bubbles, narration boxes, sound effects (SFX)
- For vertical text, note the rotation angle
- Be precise with bounding boxes

Return ONLY the JSON array, no other text.`
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl }
            }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    })
    
    const content = response.choices[0]?.message?.content || '[]'
    
    // Parse the JSON response
    let detections: TextDetection[] = []
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        detections = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.error('Failed to parse OCR response:', e)
      detections = []
    }
    
    // Validate and clean detections
    const validDetections = detections.filter(d => 
      d.text && 
      typeof d.x === 'number' && 
      typeof d.y === 'number' &&
      typeof d.width === 'number' &&
      typeof d.height === 'number'
    )
    
    return NextResponse.json({
      success: true,
      detections: validDetections,
      rawResponse: content
    })
    
  } catch (error) {
    console.error('OCR error:', error)
    return NextResponse.json(
      { error: 'Failed to process image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
