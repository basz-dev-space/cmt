import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import JSZip from 'jszip'

interface ExportRequest {
  pages: Array<{
    id: string
    originalUrl: string
    cleanedUrl?: string
    width?: number
    height?: number
    blocks: Array<{
      id: string
      targetText: string
      sourceText: string
      x: number
      y: number
      width: number
      height: number
      rotation: number
      fontSize: number
      fontFamily: string
      fontWeight: string
      fontStyle: string
      textAlign: string
      fill: string
      stroke?: string
      strokeWidth: number
    }>
  }>
  format: 'png' | 'pdf' | 'zip'
  quality: 'standard' | 'high' | 'print'
  projectName?: string
  chapterTitle?: string
}

// Quality settings
const QUALITY_SETTINGS = {
  standard: { scale: 1, jpegQuality: 0.85 },
  high: { scale: 1.5, jpegQuality: 0.92 },
  print: { scale: 2, jpegQuality: 0.95 }
}

export async function POST(request: NextRequest) {
  try {
    const { pages, format, quality, projectName, chapterTitle }: ExportRequest = await request.json()
    
    if (!pages || pages.length === 0) {
      return NextResponse.json(
        { error: 'Pages are required' },
        { status: 400 }
      )
    }
    
    // Create output directory
    const outputDir = path.join(process.cwd(), 'public', 'exports')
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true })
    }
    
    const timestamp = Date.now()
    const safeProjectName = (projectName || 'export').replace(/[^a-zA-Z0-9_-]/g, '_')
    const safeChapterName = (chapterTitle || 'chapter').replace(/[^a-zA-Z0-9_-]/g, '_')
    
    const settings = QUALITY_SETTINGS[quality] || QUALITY_SETTINGS.standard
    
    // For ZIP format, create a zip with all rendered pages
    if (format === 'zip' || format === 'png') {
      const zip = new JSZip()
      const imgFolder = zip.folder(safeChapterName)
      
      // For each page, we'll return the image data for client-side processing
      // since we can't render canvas server-side without heavy dependencies
      const pageDataUrls: Array<{ pageNumber: number; imageUrl: string; blocks: any[] }> = []
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        const imageUrl = page.cleanedUrl || page.originalUrl
        
        pageDataUrls.push({
          pageNumber: i + 1,
          imageUrl,
          blocks: page.blocks.map(b => ({
            text: b.targetText || b.sourceText,
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height,
            rotation: b.rotation,
            fontSize: b.fontSize,
            fontFamily: b.fontFamily,
            fontWeight: b.fontWeight,
            fontStyle: b.fontStyle,
            textAlign: b.textAlign,
            fill: b.fill,
            stroke: b.stroke,
            strokeWidth: b.strokeWidth
          }))
        })
      }
      
      // Return data for client-side rendering
      return NextResponse.json({
        success: true,
        format: 'client-render',
        pages: pageDataUrls,
        settings: {
          ...settings,
          totalPages: pages.length
        },
        projectName: safeProjectName,
        chapterTitle: safeChapterName,
        message: 'Use client-side canvas to render and download pages'
      })
    }
    
    // For PDF, we'll return a similar structure but note that PDF generation
    // would typically require a library like pdfkit or jsPDF
    if (format === 'pdf') {
      const pageDataUrls: Array<{ pageNumber: number; imageUrl: string; blocks: any[] }> = []
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        const imageUrl = page.cleanedUrl || page.originalUrl
        
        pageDataUrls.push({
          pageNumber: i + 1,
          imageUrl,
          blocks: page.blocks.map(b => ({
            text: b.targetText || b.sourceText,
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height,
            rotation: b.rotation,
            fontSize: b.fontSize,
            fontFamily: b.fontFamily,
            fontWeight: b.fontWeight,
            fontStyle: b.fontStyle,
            textAlign: b.textAlign,
            fill: b.fill,
            stroke: b.stroke,
            strokeWidth: b.strokeWidth
          }))
        })
      }
      
      return NextResponse.json({
        success: true,
        format: 'pdf-client-render',
        pages: pageDataUrls,
        settings: {
          ...settings,
          totalPages: pages.length
        },
        projectName: safeProjectName,
        chapterTitle: safeChapterName,
        message: 'PDF will be generated client-side using rendered images'
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid format specified'
    }, { status: 400 })
    
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Get export status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const exportId = searchParams.get('exportId')
  
  if (!exportId) {
    return NextResponse.json(
      { error: 'exportId is required' },
      { status: 400 }
    )
  }
  
  // In production, check the status of an async export job
  return NextResponse.json({
    exportId,
    status: 'completed',
    progress: 100,
    downloadUrl: `/exports/${exportId}.zip`
  })
}
