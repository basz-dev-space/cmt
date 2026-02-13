import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

interface InpaintRequest {
  imageUrl: string
  maskAreas?: Array<{
    x: number
    y: number
    width: number
    height: number
  }>
  prompt?: string
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, maskAreas, prompt }: InpaintRequest = await request.json()
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }
    
    // Initialize ZAI SDK
    const zai = await ZAI.create()
    
    // Build the inpainting prompt
    const inpaintPrompt = prompt || 
      'Remove all text from this comic page while preserving the artwork, line art, screentones, and background. Fill in the text areas naturally to match the surrounding artwork style. Maintain the original artistic style and quality.'
    
    // Use the image edit API for inpainting
    const response = await zai.images.generations.edit({
      prompt: inpaintPrompt,
      images: [{ url: imageUrl }],
      size: '1024x1024' // Default size, can be adjusted
    })
    
    const imageBase64 = response.data[0]?.base64
    
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Failed to generate inpainted image' },
        { status: 500 }
      )
    }
    
    // Save the inpainted image
    const outputDir = path.join(process.cwd(), 'public', 'processed')
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true })
    }
    
    const filename = `inpaint_${Date.now()}.png`
    const outputPath = path.join(outputDir, filename)
    
    const buffer = Buffer.from(imageBase64, 'base64')
    await writeFile(outputPath, buffer)
    
    // Return the URL to the processed image
    const processedUrl = `/processed/${filename}`
    
    return NextResponse.json({
      success: true,
      processedUrl,
      originalUrl: imageUrl,
      size: buffer.length
    })
    
  } catch (error) {
    console.error('Inpainting error:', error)
    return NextResponse.json(
      { error: 'Failed to process image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Clean specific regions (with mask)
export async function PUT(request: NextRequest) {
  try {
    const { 
      imageUrl, 
      maskAreas,
      style = 'manga'
    }: InpaintRequest & { style?: 'manga' | 'comic' | 'manhwa' } = await request.json()
    
    if (!imageUrl || !maskAreas || maskAreas.length === 0) {
      return NextResponse.json(
        { error: 'Image URL and mask areas are required' },
        { status: 400 }
      )
    }
    
    const zai = await ZAI.create()
    
    // Style-specific prompts
    const stylePrompts = {
      manga: 'Clean this manga page by removing text while preserving Japanese manga art style: black and white line art, screentones, and characteristic drawing style. Fill text areas seamlessly.',
      comic: 'Clean this Western comic page by removing text while preserving the comic art style: bold lines, coloring style, and characteristic Western comic aesthetics.',
      manhwa: 'Clean this manhwa/webtoon page by removing text while preserving Korean manhwa art style: clean lines, coloring, and vertical scroll-optimized layouts.'
    }
    
    const prompt = stylePrompts[style] || stylePrompts.manga
    
    // For specific mask areas, we create a more targeted prompt
    const areaDescriptions = maskAreas.map((area, i) => 
      `Region ${i + 1}: at position (${area.x.toFixed(1)}%, ${area.y.toFixed(1)}%) with size ${area.width.toFixed(1)}% x ${area.height.toFixed(1)}%`
    ).join('; ')
    
    const targetedPrompt = `${prompt} Focus on these text regions: ${areaDescriptions}. Preserve all other artwork completely.`
    
    const response = await zai.images.generations.edit({
      prompt: targetedPrompt,
      images: [{ url: imageUrl }],
      size: '1024x1024'
    })
    
    const imageBase64 = response.data[0]?.base64
    
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Failed to generate cleaned image' },
        { status: 500 }
      )
    }
    
    // Save the cleaned image
    const outputDir = path.join(process.cwd(), 'public', 'processed')
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true })
    }
    
    const filename = `cleaned_${Date.now()}.png`
    const outputPath = path.join(outputDir, filename)
    
    const buffer = Buffer.from(imageBase64, 'base64')
    await writeFile(outputPath, buffer)
    
    const cleanedUrl = `/processed/${filename}`
    
    return NextResponse.json({
      success: true,
      cleanedUrl,
      originalUrl: imageUrl,
      regionsProcessed: maskAreas.length,
      style
    })
    
  } catch (error) {
    console.error('Targeted inpainting error:', error)
    return NextResponse.json(
      { error: 'Failed to clean image regions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
