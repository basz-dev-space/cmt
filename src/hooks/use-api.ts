import { useState, useCallback } from 'react'
import { useCanvasStore, TextBlock } from '@/stores/canvas-store'

interface OCRDetection {
  text: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  confidence: number
}

export function useOCR() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const detectText = useCallback(async (imageUrl: string): Promise<OCRDetection[]> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      })
      
      if (!response.ok) {
        throw new Error('OCR request failed')
      }
      
      const data = await response.json()
      return data.detections || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  return { detectText, isLoading, error }
}

export function useTranslation() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const translate = useCallback(async (
    texts: Array<{ id: string; text: string }>,
    sourceLang: string,
    targetLang: string,
    imageUrl?: string
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/translate', {
        method: imageUrl ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          texts, 
          sourceLang, 
          targetLang,
          imageUrl
        })
      })
      
      if (!response.ok) {
        throw new Error('Translation request failed')
      }
      
      const data = await response.json()
      return data.translations || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  return { translate, isLoading, error }
}

export function useInpaint() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const cleanPage = useCallback(async (
    imageUrl: string,
    maskAreas?: Array<{ x: number; y: number; width: number; height: number }>
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/inpaint', {
        method: maskAreas ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageUrl,
          maskAreas
        })
      })
      
      if (!response.ok) {
        throw new Error('Inpainting request failed')
      }
      
      const data = await response.json()
      return data.processedUrl || data.cleanedUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  return { cleanPage, isLoading, error }
}

export function useExport() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const exportPages = useCallback(async (
    pages: any[],
    format: 'png' | 'pdf',
    quality: 'standard' | 'high' | 'print'
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages, format, quality })
      })
      
      if (!response.ok) {
        throw new Error('Export request failed')
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  return { exportPages, isLoading, error }
}

export function useProject() {
  const { setCurrentProject, setCurrentChapter, setCurrentPage } = useCanvasStore()
  const [isLoading, setIsLoading] = useState(false)
  
  const loadProject = useCallback(async (projectId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects?id=${projectId}`)
      const data = await response.json()
      if (data.project) {
        setCurrentProject(data.project)
      }
      return data.project
    } catch (err) {
      console.error('Failed to load project:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [setCurrentProject])
  
  const createProject = useCallback(async (projectData: {
    name: string
    description?: string
    sourceLang?: string
    targetLang?: string
    ownerId: string
  }) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })
      const data = await response.json()
      if (data.project) {
        setCurrentProject(data.project)
      }
      return data.project
    } catch (err) {
      console.error('Failed to create project:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [setCurrentProject])
  
  const loadPage = useCallback(async (pageId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/pages?pageId=${pageId}`)
      const data = await response.json()
      if (data.page) {
        setCurrentPage({
          ...data.page,
          blocks: data.page.blocks.map((b: any) => ({
            ...b,
            textAlign: b.textAlign as 'left' | 'center' | 'right'
          }))
        })
      }
      return data.page
    } catch (err) {
      console.error('Failed to load page:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [setCurrentPage])
  
  const savePage = useCallback(async (pageId: string, updates: any, blocks?: TextBlock[]) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, pageUpdates: updates, blocks })
      })
      const data = await response.json()
      return data.page
    } catch (err) {
      console.error('Failed to save page:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  return { 
    loadProject, 
    createProject, 
    loadPage, 
    savePage,
    isLoading 
  }
}
