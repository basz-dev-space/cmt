import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

// ============ Types ============

// Base element type shared by all canvas objects
export interface CanvasElement {
  id: string
  type: 'text' | 'rect' | 'circle' | 'ellipse' | 'triangle' | 'line' | 'polygon'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  isLocked: boolean
  isVisible: boolean
  zIndex: number
  name: string
}

export interface TextBlock extends Omit<CanvasElement, 'type'> {
  type: 'text'
  sourceText: string
  targetText: string
  fontSize: number
  fontFamily: string
  fontWeight: string
  fontStyle: string
  textAlign: 'left' | 'center' | 'right'
  fill: string
  stroke?: string
  strokeWidth: number
  confidence: number
}

export interface ShapeElement extends CanvasElement {
  type: 'rect' | 'circle' | 'ellipse' | 'triangle' | 'line' | 'polygon'
  fill: string
  stroke?: string
  strokeWidth: number
  rx?: number // border radius for rect
  points?: { x: number; y: number }[] // for polygon/line
}

export type CanvasObject = TextBlock | ShapeElement

export interface Page {
  id: string
  originalUrl: string
  cleanedUrl?: string
  pageNumber: number
  width: number
  height: number
  elements: CanvasObject[]
  isProcessed: boolean
  isOCRed: boolean
}

export interface Chapter {
  id: string
  title: string
  index: number
  pages: Page[]
}

export interface Project {
  id: string
  name: string
  description?: string
  sourceLang: string
  targetLang: string
  coverUrl?: string
  chapters: Chapter[]
  createdAt: Date
}

export type AppPage = 
  | 'landing'
  | 'projects'
  | 'project-detail'
  | 'chapter-upload'
  | 'editor'

export type EditorTool = 'select' | 'text' | 'pan' | 'zoom' | 'rect' | 'circle' | 'triangle'

// ============ Store ============

interface AppState {
  // Navigation
  currentPage: AppPage
  previousPage: AppPage | null
  
  // Project data
  projects: Project[]
  currentProject: Project | null
  currentChapter: Chapter | null
  currentPageData: Page | null
  
  // Editor state
  selectedElementId: string | null
  zoom: number
  panOffset: { x: number; y: number }
  activeTool: EditorTool
  showOriginalLayer: boolean
  isPanMode: boolean
  
  // UI state
  isLoading: boolean
  isProcessing: boolean
  processingMessage: string
  activeSidebarTab: 'pages' | 'tools' | 'layers'
  
  // Panel sizes
  leftPanelWidth: number
  bottomPanelHeight: number
  
  // Actions - Navigation
  navigateTo: (page: AppPage) => void
  goBack: () => void
  
  // Actions - Projects
  createProject: (project: Omit<Project, 'id' | 'chapters' | 'createdAt'>) => string
  updateProject: (projectId: string, updates: Partial<Project>) => void
  deleteProject: (projectId: string) => void
  setCurrentProject: (project: Project | null) => void
  
  // Actions - Chapters
  createChapter: (projectId: string, title: string) => string
  updateChapter: (chapterId: string, updates: Partial<Chapter>) => void
  deleteChapter: (chapterId: string) => void
  setCurrentChapter: (chapter: Chapter | null) => void
  
  // Actions - Pages
  addPage: (chapterId: string, page: Omit<Page, 'id'>) => string
  updatePage: (pageId: string, updates: Partial<Page>) => void
  deletePage: (pageId: string) => void
  setCurrentPageData: (page: Page | null) => void
  movePage: (fromIndex: number, toIndex: number) => void
  
  // Actions - Canvas Elements
  selectElement: (elementId: string | null) => void
  updateElement: (elementId: string, updates: Partial<CanvasObject>) => void
  addElement: (element: Omit<CanvasObject, 'id' | 'zIndex'>) => string
  deleteElement: (elementId: string) => void
  reorderElement: (elementId: string, newZIndex: number) => void
  bringToFront: (elementId: string) => void
  sendToBack: (elementId: string) => void
  moveElementUp: (elementId: string) => void
  moveElementDown: (elementId: string) => void
  
  // Actions - Editor
  setZoom: (zoom: number) => void
  setPanOffset: (offset: { x: number; y: number }) => void
  setActiveTool: (tool: EditorTool) => void
  toggleOriginalLayer: () => void
  togglePanMode: () => void
  fitToView: (containerWidth: number, containerHeight: number, imageWidth: number, imageHeight: number) => void
  
  // Actions - UI
  setLoading: (loading: boolean) => void
  setProcessing: (processing: boolean, message?: string) => void
  setActiveSidebarTab: (tab: 'pages' | 'tools' | 'layers') => void
  clearSelection: () => void
  setLeftPanelWidth: (width: number) => void
  setBottomPanelHeight: (height: number) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentPage: 'landing',
  previousPage: null,
  projects: [],
  currentProject: null,
  currentChapter: null,
  currentPageData: null,
  selectedElementId: null,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  activeTool: 'select',
  showOriginalLayer: true,
  isPanMode: false,
  isLoading: false,
  isProcessing: false,
  processingMessage: '',
  activeSidebarTab: 'pages',
  leftPanelWidth: 256,
  bottomPanelHeight: 200,
  
  // Navigation actions
  navigateTo: (page) => set(state => ({ 
    currentPage: page, 
    previousPage: state.currentPage 
  })),
  
  goBack: () => {
    const { previousPage } = get()
    if (previousPage) {
      set({ currentPage: previousPage, previousPage: null })
    }
  },
  
  // Project actions
  createProject: (projectData) => {
    const id = uuidv4()
    const project: Project = {
      ...projectData,
      id,
      chapters: [],
      createdAt: new Date()
    }
    set(state => ({ projects: [...state.projects, project] }))
    return id
  },
  
  updateProject: (projectId, updates) => {
    set(state => ({
      projects: state.projects.map(p => 
        p.id === projectId ? { ...p, ...updates } : p
      ),
      currentProject: state.currentProject?.id === projectId 
        ? { ...state.currentProject, ...updates }
        : state.currentProject
    }))
  },
  
  deleteProject: (projectId) => {
    set(state => ({
      projects: state.projects.filter(p => p.id !== projectId),
      currentProject: state.currentProject?.id === projectId 
        ? null 
        : state.currentProject
    }))
  },
  
  setCurrentProject: (project) => set({ currentProject: project }),
  
  // Chapter actions
  createChapter: (projectId, title) => {
    const id = uuidv4()
    const chapter: Chapter = {
      id,
      title,
      index: get().currentProject?.chapters.length ?? 0,
      pages: []
    }
    
    set(state => ({
      projects: state.projects.map(p => 
        p.id === projectId 
          ? { ...p, chapters: [...p.chapters, chapter] }
          : p
      ),
      currentProject: state.currentProject?.id === projectId
        ? { ...state.currentProject, chapters: [...state.currentProject.chapters, chapter] }
        : state.currentProject
    }))
    
    return id
  },
  
  updateChapter: (chapterId, updates) => {
    set(state => {
      const updateChapters = (chapters: Chapter[]) => 
        chapters.map(c => c.id === chapterId ? { ...c, ...updates } : c)
      
      return {
        projects: state.projects.map(p => ({
          ...p,
          chapters: updateChapters(p.chapters)
        })),
        currentProject: state.currentProject ? {
          ...state.currentProject,
          chapters: updateChapters(state.currentProject.chapters)
        } : null,
        currentChapter: state.currentChapter?.id === chapterId
          ? { ...state.currentChapter, ...updates }
          : state.currentChapter
      }
    })
  },
  
  deleteChapter: (chapterId) => {
    set(state => {
      const filterChapters = (chapters: Chapter[]) => 
        chapters.filter(c => c.id !== chapterId)
      
      return {
        projects: state.projects.map(p => ({
          ...p,
          chapters: filterChapters(p.chapters)
        })),
        currentProject: state.currentProject ? {
          ...state.currentProject,
          chapters: filterChapters(state.currentProject.chapters)
        } : null,
        currentChapter: state.currentChapter?.id === chapterId
          ? null
          : state.currentChapter
      }
    })
  },
  
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
  
  // Page actions
  addPage: (chapterId, pageData) => {
    const id = uuidv4()
    const page: Page = { ...pageData, id }
    
    set(state => {
      const updatePages = (chapters: Chapter[]) => 
        chapters.map(c => 
          c.id === chapterId 
            ? { ...c, pages: [...c.pages, page] }
            : c
        )
      
      return {
        projects: state.projects.map(p => ({
          ...p,
          chapters: updatePages(p.chapters)
        })),
        currentProject: state.currentProject ? {
          ...state.currentProject,
          chapters: updatePages(state.currentProject.chapters)
        } : null,
        currentChapter: state.currentChapter?.id === chapterId
          ? { ...state.currentChapter, pages: [...state.currentChapter.pages, page] }
          : state.currentChapter
      }
    })
    
    return id
  },
  
  updatePage: (pageId, updates) => {
    set(state => {
      const updatePages = (pages: Page[]) =>
        pages.map(p => p.id === pageId ? { ...p, ...updates } : p)
      
      const updateChapters = (chapters: Chapter[]) =>
        chapters.map(c => ({ ...c, pages: updatePages(c.pages) }))
      
      return {
        projects: state.projects.map(p => ({
          ...p,
          chapters: updateChapters(p.chapters)
        })),
        currentProject: state.currentProject ? {
          ...state.currentProject,
          chapters: updateChapters(state.currentProject.chapters)
        } : null,
        currentChapter: state.currentChapter ? {
          ...state.currentChapter,
          pages: updatePages(state.currentChapter.pages)
        } : null,
        currentPageData: state.currentPageData?.id === pageId
          ? { ...state.currentPageData, ...updates }
          : state.currentPageData
      }
    })
  },
  
  deletePage: (pageId) => {
    set(state => {
      const filterPages = (pages: Page[]) => pages.filter(p => p.id !== pageId)
      
      const updateChapters = (chapters: Chapter[]) =>
        chapters.map(c => ({ ...c, pages: filterPages(c.pages) }))
      
      return {
        projects: state.projects.map(p => ({
          ...p,
          chapters: updateChapters(p.chapters)
        })),
        currentProject: state.currentProject ? {
          ...state.currentProject,
          chapters: updateChapters(state.currentProject.chapters)
        } : null,
        currentChapter: state.currentChapter ? {
          ...state.currentChapter,
          pages: filterPages(state.currentChapter.pages)
        } : null,
        currentPageData: state.currentPageData?.id === pageId
          ? null
          : state.currentPageData
      }
    })
  },
  
  setCurrentPageData: (page) => set({ currentPageData: page, selectedElementId: null }),
  
  // Move page within chapter
  movePage: (fromIndex, toIndex) => {
    set(state => {
      if (!state.currentChapter) return state
      
      const pages = [...state.currentChapter.pages]
      if (fromIndex < 0 || fromIndex >= pages.length || toIndex < 0 || toIndex >= pages.length) {
        return state
      }
      
      const [movedPage] = pages.splice(fromIndex, 1)
      pages.splice(toIndex, 0, movedPage)
      
      // Update page numbers
      const updatedPages = pages.map((p, i) => ({ ...p, pageNumber: i + 1 }))
      
      const updateChapters = (chapters: Chapter[]) =>
        chapters.map(c => 
          c.id === state.currentChapter!.id 
            ? { ...c, pages: updatedPages }
            : c
        )
      
      return {
        currentChapter: { ...state.currentChapter, pages: updatedPages },
        currentProject: state.currentProject 
          ? { ...state.currentProject, chapters: updateChapters(state.currentProject.chapters) }
          : null,
        projects: state.projects.map(p => ({
          ...p,
          chapters: updateChapters(p.chapters)
        })),
        currentPageData: state.currentPageData 
          ? updatedPages.find(p => p.id === state.currentPageData!.id) || state.currentPageData
          : null
      }
    })
  },
  
  // Canvas element actions
  selectElement: (elementId) => set({ selectedElementId: elementId }),
  
  updateElement: (elementId, updates) => {
    set(state => {
      if (!state.currentPageData) return state
      
      const elements = state.currentPageData.elements || []
      const updatedElements = elements.map(el =>
        el.id === elementId ? { ...el, ...updates } as CanvasObject : el
      )
      
      const updatedPage = { ...state.currentPageData, elements: updatedElements }
      
      const updatePages = (pages: Page[]) =>
        pages.map(p => p.id === state.currentPageData!.id ? updatedPage : p)
      
      const updateChapters = (chapters: Chapter[]) =>
        chapters.map(c => ({ ...c, pages: updatePages(c.pages) }))
      
      return {
        currentPageData: updatedPage,
        currentChapter: state.currentChapter ? {
          ...state.currentChapter,
          pages: updatePages(state.currentChapter.pages)
        } : null,
        projects: state.projects.map(p => ({
          ...p,
          chapters: updateChapters(p.chapters)
        }))
      }
    })
  },
  
  addElement: (element) => {
    const { currentPageData } = get()
    if (!currentPageData) return ''
    
    const elements = currentPageData.elements || []
    const maxZIndex = Math.max(0, ...elements.map(e => e.zIndex))
    const newElement: CanvasObject = { 
      ...element, 
      id: uuidv4(),
      zIndex: maxZIndex + 1
    } as CanvasObject
    
    set(state => {
      if (!state.currentPageData) return state
      
      const currentElements = state.currentPageData.elements || []
      const updatedPage = {
        ...state.currentPageData,
        elements: [...currentElements, newElement]
      }
      
      const updatePages = (pages: Page[]) =>
        pages.map(p => p.id === state.currentPageData!.id ? updatedPage : p)
      
      const updateChapters = (chapters: Chapter[]) =>
        chapters.map(c => ({ ...c, pages: updatePages(c.pages) }))
      
      return { 
        currentPageData: updatedPage,
        currentChapter: state.currentChapter ? {
          ...state.currentChapter,
          pages: updatePages(state.currentChapter.pages)
        } : null,
        projects: state.projects.map(p => ({
          ...p,
          chapters: updateChapters(p.chapters)
        }))
      }
    })
    
    return newElement.id
  },
  
  deleteElement: (elementId) => {
    set(state => {
      if (!state.currentPageData) return state
      
      const elements = state.currentPageData.elements || []
      const updatedPage = {
        ...state.currentPageData,
        elements: elements.filter(e => e.id !== elementId)
      }
      
      const updatePages = (pages: Page[]) =>
        pages.map(p => p.id === state.currentPageData!.id ? updatedPage : p)
      
      const updateChapters = (chapters: Chapter[]) =>
        chapters.map(c => ({ ...c, pages: updatePages(c.pages) }))
      
      return { 
        currentPageData: updatedPage,
        currentChapter: state.currentChapter ? {
          ...state.currentChapter,
          pages: updatePages(state.currentChapter.pages)
        } : null,
        projects: state.projects.map(p => ({
          ...p,
          chapters: updateChapters(p.chapters)
        })),
        selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId
      }
    })
  },
  
  reorderElement: (elementId, newZIndex) => {
    set(state => {
      if (!state.currentPageData) return state
      
      const elements = [...(state.currentPageData.elements || [])]
      const element = elements.find(e => e.id === elementId)
      if (!element) return state
      
      element.zIndex = newZIndex
      
      // Re-sort elements by zIndex
      const sortedElements = elements.sort((a, b) => a.zIndex - b.zIndex)
      
      // Re-assign zIndex to be sequential
      sortedElements.forEach((el, i) => el.zIndex = i)
      
      return {
        currentPageData: { ...state.currentPageData, elements: sortedElements }
      }
    })
  },
  
  bringToFront: (elementId) => {
    set(state => {
      if (!state.currentPageData) return state
      
      const elements = [...(state.currentPageData.elements || [])]
      const maxZIndex = elements.length > 0 ? Math.max(...elements.map(e => e.zIndex)) : 0
      
      const updatedElements = elements.map(e => 
        e.id === elementId ? { ...e, zIndex: maxZIndex + 1 } : e
      )
      
      return {
        currentPageData: { ...state.currentPageData, elements: updatedElements }
      }
    })
  },
  
  sendToBack: (elementId) => {
    set(state => {
      if (!state.currentPageData) return state
      
      const elements = [...(state.currentPageData.elements || [])]
      const minZIndex = elements.length > 0 ? Math.min(...elements.map(e => e.zIndex)) : 0
      
      const updatedElements = elements.map(e => 
        e.id === elementId ? { ...e, zIndex: minZIndex - 1 } : e
      )
      
      return {
        currentPageData: { ...state.currentPageData, elements: updatedElements }
      }
    })
  },
  
  moveElementUp: (elementId) => {
    set(state => {
      if (!state.currentPageData) return state
      
      const elements = [...(state.currentPageData.elements || [])]
      const idx = elements.findIndex(e => e.id === elementId)
      if (idx <= 0 || idx >= elements.length) return state
      
      // Swap with element above
      const temp = elements[idx].zIndex
      elements[idx].zIndex = elements[idx - 1].zIndex
      elements[idx - 1].zIndex = temp
      
      return {
        currentPageData: { ...state.currentPageData, elements: [...elements].sort((a, b) => b.zIndex - a.zIndex) }
      }
    })
  },
  
  moveElementDown: (elementId) => {
    set(state => {
      if (!state.currentPageData) return state
      
      const elements = [...(state.currentPageData.elements || [])]
      const idx = elements.findIndex(e => e.id === elementId)
      if (idx < 0 || idx >= elements.length - 1) return state
      
      // Swap with element below
      const temp = elements[idx].zIndex
      elements[idx].zIndex = elements[idx + 1].zIndex
      elements[idx + 1].zIndex = temp
      
      return {
        currentPageData: { ...state.currentPageData, elements: [...elements].sort((a, b) => b.zIndex - a.zIndex) }
      }
    })
  },
  
  // Editor actions
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  toggleOriginalLayer: () => set(state => ({ showOriginalLayer: !state.showOriginalLayer })),
  togglePanMode: () => set(state => ({ isPanMode: !state.isPanMode })),
  fitToView: (containerWidth, containerHeight, imageWidth, imageHeight) => {
    // Calculate zoom to fit image in container with padding
    const padding = 10
    const availableWidth = containerWidth - padding * 2
    const availableHeight = containerHeight - padding * 2
    
    const scaleX = availableWidth / imageWidth
    const scaleY = availableHeight / imageHeight
    // Allow zoom to scale down if image is larger than container
    const fitZoom = Math.min(scaleX, scaleY)
    
    // Center the scaled image in the container
    const scaledWidth = imageWidth * fitZoom
    const scaledHeight = imageHeight * fitZoom
    const panX = (containerWidth - scaledWidth) / 2
    const panY = (containerHeight - scaledHeight) / 2
    
    set({ 
      zoom: fitZoom,
      panOffset: { x: panX, y: panY }
    })
  },
  
  // UI actions
  setLoading: (loading) => set({ isLoading: loading }),
  setProcessing: (processing, message = '') => set({ isProcessing: processing, processingMessage: message }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  clearSelection: () => set({ selectedElementId: null }),
  setLeftPanelWidth: (width) => set({ leftPanelWidth: Math.max(200, Math.min(400, width)) }),
  setBottomPanelHeight: (height) => set({ bottomPanelHeight: Math.max(100, Math.min(400, height)) })
}))

// Selector hooks
export const useSelectedElement = () => {
  const currentPageData = useAppStore(state => state.currentPageData)
  const selectedElementId = useAppStore(state => state.selectedElementId)
  
  if (!currentPageData || !selectedElementId) return null
  return (currentPageData.elements || []).find(el => el.id === selectedElementId) ?? null
}

export const useCanvasElements = () => {
  const currentPageData = useAppStore(state => state.currentPageData)
  return currentPageData?.elements ?? []
}

// Backward compatibility aliases
export const useSelectedBlock = useSelectedElement
export const useTextBlocks = useCanvasElements
export type { TextBlock }
