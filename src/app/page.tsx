'use client'

// ============ Landing Page ============

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore, Project, Chapter, Page, TextBlock, ShapeElement, CanvasObject, useSelectedElement, useCanvasElements } from '@/stores/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import * as fabric from 'fabric'
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  Sparkles, 
  Plus, 
  FolderOpen, 
  Upload, 
  Link, 
  FileImage, 
  FileArchive,
  Trash2,
  ArrowLeft,
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Wand2,
  Type,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Languages,
  PanelLeft,
  PanelLeftClose,
  PanelBottom,
  PanelBottomClose,
  Layers,
  MousePointer,
  Move,
  ZoomIn as ZoomInIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  GripVertical,
  Hand,
  Square,
  Circle,
  Triangle,
  Minus,
  Copy,
  BringToFront,
  SendToBack,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ============ Google Fonts ============
const GOOGLE_FONTS = [
  { value: 'Noto Sans JP', label: 'Noto Sans JP' },
  { value: 'Noto Sans SC', label: 'Noto Sans SC' },
  { value: 'Noto Sans KR', label: 'Noto Sans KR' },
  { value: 'M PLUS Rounded 1c', label: 'M PLUS Rounded 1c' },
  { value: 'Kosugi Maru', label: 'Kosugi Maru' },
  { value: 'Sawarabi Gothic', label: 'Sawarabi Gothic' },
  { value: 'Noto Serif JP', label: 'Noto Serif JP' },
  { value: 'Zen Maru Gothic', label: 'Zen Maru Gothic' },
  { value: 'BIZ UDGothic', label: 'BIZ UDGothic' },
  { value: 'BIZ UDPGothic', label: 'BIZ UDPGothic' },
  { value: 'M PLUS 1p', label: 'M PLUS 1p' },
  { value: 'Klee One', label: 'Klee One' },
]

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72, 96]

// Image file extensions
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp']

// ============ Language Options ============
const LANGUAGES = [
  { value: 'ja', label: 'Japanese' },
  { value: 'en', label: 'English' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh-CN', label: 'Chinese (Simplified)' },
  { value: 'zh-TW', label: 'Chinese (Traditional)' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ar', label: 'Arabic' },
  { value: 'th', label: 'Thai' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'id', label: 'Indonesian' },
]

// ============ Main App Component ============
export default function ComicTransStudio() {
  const { currentPage, navigateTo, currentProject, setCurrentProject } = useAppStore()
  
  // Render appropriate page based on state
  switch (currentPage) {
    case 'landing':
      return <LandingPage />
    case 'projects':
      return <ProjectsPage />
    case 'project-detail':
      return <ProjectDetailPage />
    case 'chapter-upload':
      return <ChapterUploadPage />
    case 'editor':
      return <CanvasEditorPage />
    default:
      return <LandingPage />
  }
}

// ============ Landing Page ============
function LandingPage() {
  const { navigateTo, projects } = useAppStore()
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl">ComicTrans Studio</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Comic Localization</p>
            </div>
          </div>
          <Button onClick={() => navigateTo('projects')} className="gap-2">
            <FolderOpen className="w-4 h-4" />
            My Projects
            {projects.length > 0 && (
              <Badge variant="secondary" className="ml-1">{projects.length}</Badge>
            )}
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              AI-Augmented Translation
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Professional Comic Translation
              <span className="text-primary block mt-2">Made Simple</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combine visual canvas editing with AI-powered OCR, translation, and inpainting. 
              Localize your manga, manhwa, and comics in one unified workspace.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Wand2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">AI OCR & Translation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatic text detection and translation with context-aware AI models
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Visual Canvas Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Drag, resize, rotate text boxes with real-time preview and editing
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Smart Inpainting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI-powered background restoration removes original text cleanly
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button 
              size="lg" 
              className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
              onClick={() => navigateTo('projects')}
            >
              <Plus className="w-5 h-5" />
              Create New Project
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2"
              onClick={() => navigateTo('projects')}
            >
              <FolderOpen className="w-5 h-5" />
              Open Existing
            </Button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          ComicTrans Studio — Open Source Comic Translation Platform
        </div>
      </footer>
    </div>
  )
}

// ============ Projects Page ============
function ProjectsPage() {
  const { navigateTo, projects, createProject, setCurrentProject, deleteProject } = useAppStore()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')
  const [sourceLang, setSourceLang] = useState('ja')
  const [targetLang, setTargetLang] = useState('en')
  
  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error('Please enter a project name')
      return
    }
    
    const projectId = createProject({
      name: newProjectName,
      description: newProjectDesc,
      sourceLang,
      targetLang,
    })
    
    toast.success('Project created successfully!')
    setShowCreateDialog(false)
    setNewProjectName('')
    setNewProjectDesc('')
    
    // Navigate to project detail
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setCurrentProject(project)
      navigateTo('project-detail')
    }
  }
  
  const handleOpenProject = (project: Project) => {
    setCurrentProject(project)
    navigateTo('project-detail')
  }
  
  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId)
    toast.success('Project deleted')
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => navigateTo('landing')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">ComicTrans Studio</span>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Projects</h1>
            <p className="text-muted-foreground">Manage your comic translation projects</p>
          </div>
        </div>
        
        {projects.length === 0 ? (
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">No Projects Yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first project to start translating comics
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:border-primary/50 transition-colors group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div 
                      className="flex-1"
                      onClick={() => handleOpenProject(project)}
                    >
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {project.description || 'No description'}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProject(project.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent onClick={() => handleOpenProject(project)}>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Languages className="w-4 h-4" />
                      <span>{LANGUAGES.find(l => l.value === project.sourceLang)?.label || project.sourceLang}</span>
                      <ChevronRight className="w-3 h-3" />
                      <span>{LANGUAGES.find(l => l.value === project.targetLang)?.label || project.targetLang}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline">
                      {project.chapters.length} chapters
                    </Badge>
                    <Badge variant="secondary">
                      {project.chapters.reduce((acc, c) => acc + c.pages.length, 0)} pages
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      {/* Create Project Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Set up your comic translation project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="My Manga Translation"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description (optional)</Label>
              <Input
                id="desc"
                placeholder="Project description..."
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source Language</Label>
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Language</Label>
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} className="bg-primary">
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============ Project Detail Page ============
function ProjectDetailPage() {
  const { 
    navigateTo, 
    currentProject, 
    createChapter, 
    deleteChapter,
    setCurrentChapter,
    currentChapter
  } = useAppStore()
  
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState('')
  
  if (!currentProject) {
    navigateTo('projects')
    return null
  }
  
  const handleCreateChapter = () => {
    if (!newChapterTitle.trim()) {
      toast.error('Please enter a chapter title')
      return
    }
    
    createChapter(currentProject.id, newChapterTitle)
    toast.success('Chapter created!')
    setNewChapterTitle('')
    setShowUploadDialog(false)
  }
  
  const handleOpenChapter = (chapter: Chapter) => {
    setCurrentChapter(chapter)
    navigateTo('chapter-upload')
  }
  
  const handleDeleteChapter = (chapterId: string) => {
    deleteChapter(chapterId)
    toast.success('Chapter deleted')
  }
  
  const handleStartEditing = (chapter: Chapter) => {
    setCurrentChapter(chapter)
    if (chapter.pages.length > 0) {
      navigateTo('editor')
    } else {
      navigateTo('chapter-upload')
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={() => navigateTo('projects')}
            >
              <ArrowLeft className="w-4 h-4" />
              Projects
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-semibold">{currentProject.name}</h1>
              <p className="text-xs text-muted-foreground">
                {LANGUAGES.find(l => l.value === currentProject.sourceLang)?.label} → {LANGUAGES.find(l => l.value === currentProject.targetLang)?.label}
              </p>
            </div>
          </div>
          <Button onClick={() => setShowUploadDialog(true)} className="gap-2 bg-primary">
            <Plus className="w-4 h-4" />
            Add Chapter
          </Button>
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {currentProject.chapters.length === 0 ? (
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileArchive className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">No Chapters Yet</h3>
              <p className="text-sm text-muted-foreground">
                Add chapters to start uploading pages
              </p>
              <Button onClick={() => setShowUploadDialog(true)} className="gap-2 bg-primary">
                <Plus className="w-4 h-4" />
                Add Chapter
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {currentProject.chapters.map((chapter, index) => (
              <Card key={chapter.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{chapter.title || `Chapter ${index + 1}`}</h3>
                        <p className="text-sm text-muted-foreground">
                          {chapter.pages.length} pages • {
                            chapter.pages.filter(p => p.isProcessed).length
                          } processed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenChapter(chapter)}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Manage
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleStartEditing(chapter)}
                        className="gap-2 bg-primary"
                        disabled={chapter.pages.length === 0}
                      >
                        <FileImage className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteChapter(chapter.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Page thumbnails */}
                  {chapter.pages.length > 0 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                      {chapter.pages.slice(0, 6).map((page, i) => (
                        <div
                          key={page.id}
                          className="flex-shrink-0 w-16 h-24 bg-muted rounded border border-border flex items-center justify-center relative"
                        >
                          {page.originalUrl ? (
                            <img
                              src={page.originalUrl}
                              alt={`Page ${i + 1}`}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          )}
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                            {i + 1}
                          </span>
                        </div>
                      ))}
                      {chapter.pages.length > 6 && (
                        <div className="flex-shrink-0 w-16 h-24 bg-muted rounded border border-border flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">
                            +{chapter.pages.length - 6}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      {/* Add Chapter Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Chapter</DialogTitle>
            <DialogDescription>
              Create a chapter to organize your pages
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chapter-title">Chapter Title</Label>
              <Input
                id="chapter-title"
                placeholder="Chapter 1: The Beginning"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateChapter} className="bg-primary">
              Create Chapter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============ Chapter Upload Page ============
function ChapterUploadPage() {
  const { 
    navigateTo, 
    currentProject, 
    currentChapter,
    addPage,
    setCurrentPageData,
    currentPageData,
    setCurrentChapter,
  } = useAppStore()
  
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  if (!currentProject || !currentChapter) {
    navigateTo('projects')
    return <div className="h-screen flex items-center justify-center">Redirecting...</div>
  }
  
  // Extract images from a ZIP file
  const extractImagesFromZip = async (file: File): Promise<Array<{ name: string; dataUrl: string }>> => {
    const JSZip = (await import('jszip')).default
    const zip = await JSZip.loadAsync(file)
    const images: Array<{ name: string; dataUrl: string }> = []
    
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp']
    const imageFiles = Object.keys(zip.files).filter(filename => {
      const ext = filename.toLowerCase()
      return imageExtensions.some(imgExt => ext.endsWith(imgExt)) && !filename.startsWith('__MACOSX')
    })
    
    // Sort by filename (natural sort for proper page order)
    imageFiles.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0')
      const numB = parseInt(b.match(/\d+/)?.[0] || '0')
      return numA - numB
    })
    
    for (const filename of imageFiles) {
      const blob = await zip.files[filename].async('blob')
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
      images.push({ name: filename, dataUrl })
    }
    
    return images
  }
  
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus('Processing files...')
    
    const addedPageIds: string[] = []
    let totalImages = 0
    let processedImages = 0
    
    // First, count total images (for ZIP files, we need to extract them)
    const allImages: Array<{ dataUrl: string; name: string }> = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = file.name.toLowerCase()
      
      try {
        if (ext.endsWith('.zip') || ext.endsWith('.cbz')) {
          setUploadStatus(`Extracting ${file.name}...`)
          const extractedImages = await extractImagesFromZip(file)
          allImages.push(...extractedImages)
        } else if (imageExtensions.some(imgExt => ext.endsWith(imgExt))) {
          // Regular image file
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
          allImages.push({ dataUrl, name: file.name })
        } else {
          toast.warning(`Skipping unsupported file: ${file.name}`)
        }
      } catch (error) {
        console.error('Failed to process file:', file.name, error)
        toast.error(`Failed to process ${file.name}`)
      }
    }
    
    totalImages = allImages.length
    
    if (totalImages === 0) {
      toast.error('No valid images found in the uploaded files')
      setIsUploading(false)
      return
    }
    
    // Now add all images as pages
    for (let i = 0; i < allImages.length; i++) {
      const { dataUrl, name } = allImages[i]
      setUploadStatus(`Processing image ${i + 1}/${totalImages}: ${name}`)
      
      try {
        // Get image dimensions - use naturalWidth/naturalHeight for actual image size
        const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
          const img = new window.Image()
          img.onload = () => {
            // Use naturalWidth/naturalHeight for the actual image dimensions
            const w = img.naturalWidth || img.width || 800
            const h = img.naturalHeight || img.height || 1200
            console.log('Upload - Image dimensions:', w, 'x', h)
            resolve({ width: w, height: h })
          }
          img.onerror = () => {
            console.error('Failed to load image for dimension check')
            resolve({ width: 800, height: 1200 })
          }
          img.src = dataUrl
        })
        
        // Add page
        const pageId = addPage(currentChapter.id, {
          originalUrl: dataUrl,
          pageNumber: currentChapter.pages.length + i + 1,
          width: dimensions.width,
          height: dimensions.height,
          elements: [],
          isProcessed: false,
          isOCRed: false,
        })
        
        addedPageIds.push(pageId)
        processedImages++
        setUploadProgress(Math.round((processedImages / totalImages) * 100))
      } catch (error) {
        console.error('Failed to add page:', name, error)
        toast.error(`Failed to add ${name}`)
      }
    }
    
    setIsUploading(false)
    setUploadStatus('')
    
    if (addedPageIds.length > 0) {
      toast.success(`Uploaded ${addedPageIds.length} pages - opening editor...`)
      // Get fresh state and navigate
      setTimeout(() => {
        const state = useAppStore.getState()
        const chapter = state.currentChapter
        if (chapter && chapter.pages.length > 0) {
          const page = chapter.pages.find(p => p.id === addedPageIds[0]) || chapter.pages[0]
          state.setCurrentPageData(page)
          state.navigateTo('editor')
        }
      }, 150)
    }
  }
  
  const handleUrlImport = async () => {
    if (!urlInput.trim()) return
    
    setIsUploading(true)
    setUploadStatus('Importing from URL...')
    toast.info('Importing from URL...')
    
    try {
      // Fetch the image
      const response = await fetch(urlInput)
      const blob = await response.blob()
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
      
      // Get actual image dimensions
      const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new window.Image()
        img.onload = () => {
          const w = img.naturalWidth || img.width || 800
          const h = img.naturalHeight || img.height || 1200
          console.log('URL Import - Image dimensions:', w, 'x', h)
          resolve({ width: w, height: h })
        }
        img.onerror = () => resolve({ width: 800, height: 1200 })
        img.src = dataUrl
      })
      
      const pageId = addPage(currentChapter.id, {
        originalUrl: dataUrl,
        pageNumber: currentChapter.pages.length + 1,
        width: dimensions.width,
        height: dimensions.height,
        elements: [],
        isProcessed: false,
        isOCRed: false,
      })
      
      toast.success('Page imported - opening editor...')
      setUrlInput('')
      setIsUploading(false)
      
      // Get fresh state and navigate
      setTimeout(() => {
        const state = useAppStore.getState()
        const chapter = state.currentChapter
        if (chapter && chapter.pages.length > 0) {
          const page = chapter.pages.find(p => p.id === pageId) || chapter.pages[0]
          state.setCurrentPageData(page)
          state.navigateTo('editor')
        }
      }, 150)
    } catch (error) {
      toast.error('Failed to import from URL')
      setIsUploading(false)
    }
  }
  
  const handleStartEditor = () => {
    if (currentChapter.pages.length === 0) {
      toast.error('Please upload at least one page')
      return
    }
    
    // Set first page as current
    const firstPage = currentChapter.pages[0]
    setCurrentPageData(firstPage)
    navigateTo('editor')
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={() => navigateTo('project-detail')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-semibold">{currentChapter.title || 'Chapter'}</h1>
              <p className="text-xs text-muted-foreground">
                {currentProject.name}
              </p>
            </div>
          </div>
          <Button 
            onClick={handleStartEditor}
            className="gap-2 bg-primary"
            disabled={currentChapter.pages.length === 0}
          >
            Start Editing
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Upload Options */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Image Upload */}
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
            <CardContent className="py-8 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileImage className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium">Upload Images</h3>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG, WebP files
              </p>
            </CardContent>
          </Card>
          
          {/* ZIP/CBZ Upload */}
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
            <CardContent className="py-8 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileArchive className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium">Upload Archive</h3>
              <p className="text-sm text-muted-foreground mt-1">
                ZIP, CBZ, CBR files
              </p>
            </CardContent>
          </Card>
          
          {/* URL Import */}
          <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="py-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Link className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Import from URL</h3>
                  <p className="text-xs text-muted-foreground">
                    Direct image link
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="h-8"
                />
                <Button 
                  size="sm" 
                  onClick={handleUrlImport}
                  disabled={isUploading || !urlInput.trim()}
                  className="bg-primary"
                >
                  Import
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.zip,.cbz,.cbr,.pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        
        {/* Upload Progress */}
        {isUploading && (
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{uploadStatus || 'Uploading...'}</p>
                  <Progress value={uploadProgress} className="mt-2" />
                </div>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Pages List */}
        <div className="space-y-4">
          <h2 className="font-semibold">Uploaded Pages ({currentChapter.pages.length})</h2>
          
          {currentChapter.pages.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  No pages uploaded yet. Click above to upload.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentChapter.pages.map((page, index) => (
                <Card key={page.id} className="overflow-hidden group">
                  <div className="aspect-[3/4] bg-muted relative">
                    {page.originalUrl ? (
                      <img
                        src={page.originalUrl}
                        alt={`Page ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => {
                          setCurrentPageData(page)
                          navigateTo('editor')
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs font-medium">Page {index + 1}</p>
                      <div className="flex gap-1 mt-1">
                        {page.isOCRed && (
                          <Badge variant="outline" className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30">
                            OCR
                          </Badge>
                        )}
                        {page.isProcessed && (
                          <Badge variant="outline" className="text-[10px] bg-primary/20 text-primary border-primary/30">
                            Cleaned
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// ============ Canvas Editor Page (continued in next part) ============
function CanvasEditorPage() {
  return <CanvasEditorContent />
}

// ============ Sortable Page Item Component ============
interface SortablePageItemProps {
  page: Page
  index: number
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

function SortablePageItem({ page, index, isSelected, onSelect, onDelete }: SortablePageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      {/* Drag Handle */}
      <button
        className="absolute top-1 left-1 z-10 w-6 h-6 bg-black/50 text-white hover:bg-primary flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-3 h-3" />
      </button>
      
      <button
        onClick={onSelect}
        className={cn(
          "w-full aspect-[3/4] bg-muted rounded-lg border-2 transition-all overflow-hidden relative",
          isSelected
            ? "border-primary"
            : "border-transparent hover:border-muted-foreground/30"
        )}
      >
        {page.originalUrl ? (
          <img
            src={page.originalUrl}
            alt={`Page ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <span className="text-white text-xs font-medium">
            Page {index + 1}
          </span>
        </div>
        {/* Status indicators */}
        <div className="absolute top-1 right-1 flex gap-1">
          {page.isOCRed && (
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          )}
          {page.isProcessed && (
            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </button>
      
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-8 left-1 w-6 h-6 bg-black/50 text-white hover:bg-destructive hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  )
}

// ============ Page List with Drag and Drop ============
interface PageListDnDProps {
  pages: Page[]
  currentPageId?: string
  onSelectPage: (page: Page) => void
  onDeletePage: (pageId: string) => void
  onMovePage: (fromIndex: number, toIndex: number) => void
}

function PageListDnD({ pages, currentPageId, onSelectPage, onDeletePage, onMovePage }: PageListDnDProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex(p => p.id === active.id)
      const newIndex = pages.findIndex(p => p.id === over.id)
      onMovePage(oldIndex, newIndex)
    }
  }

  if (pages.length === 0) return null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={pages.map(p => p.id)}
        strategy={verticalListSortingStrategy}
      >
        {pages.map((page, index) => (
          <SortablePageItem
            key={page.id}
            page={page}
            index={index}
            isSelected={page.id === currentPageId}
            onSelect={() => onSelectPage(page)}
            onDelete={() => onDeletePage(page.id)}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}

// ============ Canvas Editor Content ============
function CanvasEditorContent() {
  const { 
    navigateTo,
    currentProject,
    currentChapter,
    currentPageData,
    setCurrentPageData,
    selectedElementId,
    selectElement,
    updateElement,
    addElement,
    deleteElement,
    addPage,
    deletePage,
    movePage,
    moveElementUp,
    moveElementDown,
    bringToFront,
    sendToBack,
    zoom,
    setZoom,
    panOffset,
    setPanOffset,
    showOriginalLayer,
    toggleOriginalLayer,
    isProcessing,
    setProcessing,
    activeSidebarTab,
    setActiveSidebarTab,
    isPanMode,
    togglePanMode,
    fitToView,
    activeTool,
    setActiveTool,
    leftPanelWidth,
    bottomPanelHeight,
    setLeftPanelWidth,
    setBottomPanelHeight,
  } = useAppStore()
  
  const selectedElement = useSelectedElement()
  const canvasElements = useCanvasElements()
  
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const elementObjectsRef = useRef<Map<string, fabric.Object>>(new Map())
  const bgImageRef = useRef<fabric.FabricImage | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  
  // Track actual loaded image dimensions (may differ from page metadata)
  const [actualImageSize, setActualImageSize] = useState<{ width: number; height: number } | null>(null)
  
  // Track which element is currently being edited (to prevent updates/jumps)
  const editingElementIdRef = useRef<string | null>(null)
  
  // Track if selection change came from canvas (to prevent feedback loop)
  const isCanvasSelectionRef = useRef(false)
  
  // Track if there's an active selection on canvas (to prevent sync jumps)
  const hasActiveSelectionRef = useRef(false)
  
  // Touch gesture state
  const lastTouchDistanceRef = useRef<number | null>(null)
  const lastTouchCenterRef = useRef<{ x: number; y: number } | null>(null)
  const isPanningRef = useRef(false)
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  
  // Resizable panel state
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingBottom, setIsResizingBottom] = useState(false)
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !currentPageData) return
    
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: currentPageData.width || 800,
      height: currentPageData.height || 1200,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true,
    })
    
    fabricRef.current = canvas
    elementObjectsRef.current.clear()
    
    // MutationObserver to catch Fabric.js hidden textarea and fix its position
    // This prevents the scroll-to-bottom-right issue when editing text
    const textareaObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLTextAreaElement) {
            // Immediately fix the textarea position to prevent scroll
            node.style.cssText = `
              position: fixed !important;
              top: -9999px !important;
              left: -9999px !important;
              width: 1px !important;
              height: 1px !important;
              opacity: 0 !important;
              pointer-events: none !important;
              z-index: -9999 !important;
            `
          }
        })
      })
    })
    textareaObserver.observe(document.body, { childList: true, subtree: true })
    
    // Selection events
    canvas.on('selection:created', (e) => {
      hasActiveSelectionRef.current = true
      isCanvasSelectionRef.current = true // Mark as canvas-triggered
      const selected = e.selected?.[0]
      if (selected && (selected as any).elementId) {
        selectElement((selected as any).elementId)
      }
      setTimeout(() => { isCanvasSelectionRef.current = false }, 0)
    })
    
    canvas.on('selection:updated', (e) => {
      hasActiveSelectionRef.current = true
      isCanvasSelectionRef.current = true // Mark as canvas-triggered
      const selected = e.selected?.[0]
      if (selected && (selected as any).elementId) {
        selectElement((selected as any).elementId)
      }
      setTimeout(() => { isCanvasSelectionRef.current = false }, 0)
    })
    
    canvas.on('selection:cleared', () => {
      hasActiveSelectionRef.current = false
      isCanvasSelectionRef.current = true // Mark as canvas-triggered
      selectElement(null)
      setTimeout(() => { isCanvasSelectionRef.current = false }, 0)
    })
    
    // Object modifications
    canvas.on('object:modified', (e) => {
      const obj = e.target
      if (obj && (obj as any).elementId) {
        const newWidth = (obj.width ?? 100) * (obj.scaleX ?? 1)
        const newHeight = (obj.height ?? 50) * (obj.scaleY ?? 1)
        updateElement((obj as any).elementId, {
          x: obj.left ?? 0,
          y: obj.top ?? 0,
          width: newWidth,
          height: newHeight,
          rotation: obj.angle ?? 0,
          opacity: obj.opacity ?? 1,
        })
        // Reset scale after applying
        obj.set({ scaleX: 1, scaleY: 1, width: newWidth, height: newHeight })
      }
    })
    
    // Text changes - update store as user types
    canvas.on('text:changed', (e) => {
      const obj = e.target as fabric.Textbox
      if (obj && (obj as any).elementId) {
        // Update store with current text
        updateElement((obj as any).elementId, { targetText: obj.text || '' } as Partial<TextBlock>)
      }
    })
    
    // Track when text editing starts (to prevent updates/jumps)
    canvas.on('text:editing:entered', (e) => {
      const obj = e.target as fabric.Textbox
      if (obj && (obj as any).elementId) {
        editingElementIdRef.current = (obj as any).elementId
        console.log('Text editing started:', editingElementIdRef.current)
      }
    })
    
    // Track when text editing ends - keep ref set briefly to prevent overwrites
    canvas.on('text:editing:exited', (e) => {
      const obj = e.target as fabric.Textbox
      console.log('Text editing ended:', editingElementIdRef.current)
      
      // Final sync to store when editing ends
      if (obj && (obj as any).elementId) {
        updateElement((obj as any).elementId, { targetText: obj.text || '' } as Partial<TextBlock>)
      }
      
      // Delay clearing the ref to allow store to update and sync effect to complete
      setTimeout(() => {
        editingElementIdRef.current = null
        console.log('Editing ref cleared')
      }, 300) // Increased delay for safety
    })
    
    return () => {
      textareaObserver.disconnect()
      canvas.dispose()
      fabricRef.current = null
      elementObjectsRef.current.clear()
    }
  }, [currentPageData?.id, selectElement, updateElement])
  
  // Load background image and CENTER IT PROPERLY
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas || !currentPageData) return
    
    // Reset actualImageSize when page changes
    setActualImageSize(null)
    
    const imageUrl = showOriginalLayer 
      ? currentPageData.originalUrl 
      : currentPageData.cleanedUrl || currentPageData.originalUrl
    
    if (!imageUrl) return
    
    fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
      if (!fabricRef.current) return
      
      const canvas = fabricRef.current
      
      // Get image dimensions
      const imgWidth = img.width || 800
      const imgHeight = img.height || 1200
      
      console.log('Loaded image dimensions:', imgWidth, 'x', imgHeight)
      
      // Store the actual image dimensions for the wrapper
      setActualImageSize({ width: imgWidth, height: imgHeight })
      
      // Set canvas to exact image dimensions
      canvas.setDimensions({ width: imgWidth, height: imgHeight })
      
      // Position image - center the image (left = half width, top = half height)
      img.set({
        left: imgWidth / 2,
        top: imgHeight / 2,
        scaleX: 1,
        scaleY: 1,
        selectable: false,
        evented: false,
      })
      
      console.log('Image position set to:', { left: imgWidth / 2, top: imgHeight / 2 })
      
      // Set as background image
      canvas.backgroundImage = img
      canvas.renderAll()
      
      bgImageRef.current = img
      
      // Fit and center the image using requestAnimationFrame for proper timing
      const fitAndCenter = () => {
        if (!canvasContainerRef.current) {
          requestAnimationFrame(fitAndCenter)
          return
        }
        
        const container = canvasContainerRef.current
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        
        // Wait for valid dimensions
        if (containerWidth === 0 || containerHeight === 0) {
          requestAnimationFrame(fitAndCenter)
          return
        }
        
        // Calculate zoom to fit entire image in container with small padding
        const padding = 10
        const availableWidth = containerWidth - padding * 2
        const availableHeight = containerHeight - padding * 2
        
        const scaleX = availableWidth / imgWidth
        const scaleY = availableHeight / imgHeight
        const fitZoom = Math.min(scaleX, scaleY)
        
        // Calculate center position
        // The canvas wrapper has transform-origin: 0 0 (top-left)
        // So we need to position it so the scaled image is centered
        const scaledWidth = imgWidth * fitZoom
        const scaledHeight = imgHeight * fitZoom
        
        // Center the image: (containerSize - scaledSize) / 2
        const panX = (containerWidth - scaledWidth) / 2
        const panY = (containerHeight - scaledHeight) / 2
        
        console.log('Canvas fit:', { containerWidth, containerHeight, imgWidth, imgHeight, fitZoom, panX, panY })
        
        setZoom(fitZoom)
        setPanOffset({ x: panX, y: panY })
      }
      
      // Start fitting after a frame to ensure layout
      requestAnimationFrame(fitAndCenter)
    }).catch((err) => {
      console.error('Failed to load image:', err)
    })
  }, [currentPageData?.originalUrl, currentPageData?.cleanedUrl, showOriginalLayer, setZoom, setPanOffset])
  
  // Sync canvas elements (text, shapes, etc.)
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas || !currentPageData) return
    
    // Skip sync entirely if any element is being edited
    if (editingElementIdRef.current) {
      console.log('Skipping sync - element is being edited:', editingElementIdRef.current)
      return
    }
    
    // Safety check for elements array
    const elements = currentPageData.elements || []
    
    const existingIds = new Set(elementObjectsRef.current.keys())
    const currentIds = new Set(elements.map(e => e.id))
    
    // Get currently selected element ID (if any)
    const selectedObj = canvas.getActiveObject()
    const selectedId = selectedObj && (selectedObj as any).elementId
    
    // Remove deleted elements
    existingIds.forEach(id => {
      if (!currentIds.has(id)) {
        const obj = elementObjectsRef.current.get(id)
        if (obj) {
          canvas.remove(obj)
          elementObjectsRef.current.delete(id)
        }
      }
    })
    
    // Sort elements by zIndex for proper rendering order
    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex)
    
    // Add or update elements
    sortedElements.forEach(element => {
      let fabricObj = elementObjectsRef.current.get(element.id)
      
      // Check if this object is currently being edited (don't interrupt text editing)
      // Use both the ref and fabric's isEditing for double-check
      const isEditing = editingElementIdRef.current === element.id || (fabricObj && (fabricObj as any).isEditing)
      
      // Check if this object is currently selected (skip position updates to prevent jumps)
      const isSelected = element.id === selectedId
      
      if (element.type === 'text') {
        const textEl = element as TextBlock
        if (!fabricObj) {
          // Create new textbox
          fabricObj = new fabric.Textbox(textEl.targetText || textEl.sourceText, {
            left: textEl.x,
            top: textEl.y,
            width: textEl.width,
            angle: textEl.rotation,
            fontSize: textEl.fontSize,
            fontFamily: textEl.fontFamily,
            fontWeight: textEl.fontWeight as any,
            fontStyle: textEl.fontStyle as any,
            textAlign: textEl.textAlign,
            fill: textEl.fill,
            stroke: textEl.stroke || '',
            strokeWidth: textEl.strokeWidth,
            visible: textEl.isVisible,
            opacity: textEl.opacity,
            lockMovementX: textEl.isLocked,
            lockMovementY: textEl.isLocked,
            lockRotation: textEl.isLocked,
            lockScalingX: textEl.isLocked,
            lockScalingY: textEl.isLocked,
            editable: true,
          })
          ;(fabricObj as any).elementId = textEl.id
          canvas.add(fabricObj)
          elementObjectsRef.current.set(textEl.id, fabricObj)
        } else {
          // Skip ALL updates if user is currently editing (don't interrupt or cause jumps)
          if (isEditing) {
            return // Skip this element entirely while editing
          }
          
          // Skip ALL updates if this element is selected (prevents ANY jump on click/selection)
          if (isSelected) {
            return // Don't touch selected elements at all
          }
          
          // Update all properties only when NOT selected and NOT editing
          const updates: any = {
            left: textEl.x,
            top: textEl.y,
            width: textEl.width,
            angle: textEl.rotation,
            fontSize: textEl.fontSize,
            fontFamily: textEl.fontFamily,
            fontWeight: textEl.fontWeight as any,
            fontStyle: textEl.fontStyle as any,
            textAlign: textEl.textAlign,
            fill: textEl.fill,
            stroke: textEl.stroke || '',
            strokeWidth: textEl.strokeWidth,
            visible: textEl.isVisible,
            opacity: textEl.opacity,
            lockMovementX: textEl.isLocked,
            lockMovementY: textEl.isLocked,
            lockRotation: textEl.isLocked,
            lockScalingX: textEl.isLocked,
            lockScalingY: textEl.isLocked,
            text: textEl.targetText || textEl.sourceText,
          }
          
          fabricObj.set(updates)
          canvas.renderAll()
        }
      } else {
        // Handle shapes
        const shapeEl = element as ShapeElement
        if (!fabricObj) {
          let shape: fabric.Object
          switch (shapeEl.type) {
            case 'rect':
              shape = new fabric.Rect({
                left: shapeEl.x,
                top: shapeEl.y,
                width: shapeEl.width,
                height: shapeEl.height,
                rx: shapeEl.rx || 0,
                fill: shapeEl.fill,
                stroke: shapeEl.stroke,
                strokeWidth: shapeEl.strokeWidth,
                angle: shapeEl.rotation,
                opacity: shapeEl.opacity,
                visible: shapeEl.isVisible,
                lockMovementX: shapeEl.isLocked,
                lockMovementY: shapeEl.isLocked,
                lockRotation: shapeEl.isLocked,
                lockScalingX: shapeEl.isLocked,
                lockScalingY: shapeEl.isLocked,
              })
              break
            case 'circle':
              shape = new fabric.Circle({
                left: shapeEl.x,
                top: shapeEl.y,
                radius: Math.min(shapeEl.width, shapeEl.height) / 2,
                fill: shapeEl.fill,
                stroke: shapeEl.stroke,
                strokeWidth: shapeEl.strokeWidth,
                angle: shapeEl.rotation,
                opacity: shapeEl.opacity,
                visible: shapeEl.isVisible,
                lockMovementX: shapeEl.isLocked,
                lockMovementY: shapeEl.isLocked,
                lockRotation: shapeEl.isLocked,
                lockScalingX: shapeEl.isLocked,
                lockScalingY: shapeEl.isLocked,
              })
              break
            case 'ellipse':
              shape = new fabric.Ellipse({
                left: shapeEl.x,
                top: shapeEl.y,
                rx: shapeEl.width / 2,
                ry: shapeEl.height / 2,
                fill: shapeEl.fill,
                stroke: shapeEl.stroke,
                strokeWidth: shapeEl.strokeWidth,
                angle: shapeEl.rotation,
                opacity: shapeEl.opacity,
                visible: shapeEl.isVisible,
                lockMovementX: shapeEl.isLocked,
                lockMovementY: shapeEl.isLocked,
                lockRotation: shapeEl.isLocked,
                lockScalingX: shapeEl.isLocked,
                lockScalingY: shapeEl.isLocked,
              })
              break
            case 'triangle':
              shape = new fabric.Triangle({
                left: shapeEl.x,
                top: shapeEl.y,
                width: shapeEl.width,
                height: shapeEl.height,
                fill: shapeEl.fill,
                stroke: shapeEl.stroke,
                strokeWidth: shapeEl.strokeWidth,
                angle: shapeEl.rotation,
                opacity: shapeEl.opacity,
                visible: shapeEl.isVisible,
                lockMovementX: shapeEl.isLocked,
                lockMovementY: shapeEl.isLocked,
                lockRotation: shapeEl.isLocked,
                lockScalingX: shapeEl.isLocked,
                lockScalingY: shapeEl.isLocked,
              })
              break
            default:
              shape = new fabric.Rect({
                left: shapeEl.x,
                top: shapeEl.y,
                width: shapeEl.width,
                height: shapeEl.height,
                fill: shapeEl.fill,
                stroke: shapeEl.stroke,
                strokeWidth: shapeEl.strokeWidth,
                angle: shapeEl.rotation,
                opacity: shapeEl.opacity,
                visible: shapeEl.isVisible,
              })
          }
          ;(shape as any).elementId = shapeEl.id
          canvas.add(shape)
          elementObjectsRef.current.set(shapeEl.id, shape)
        } else {
          fabricObj.set({
            left: shapeEl.x,
            top: shapeEl.y,
            angle: shapeEl.rotation,
            opacity: shapeEl.opacity,
            visible: shapeEl.isVisible,
            lockMovementX: shapeEl.isLocked,
            lockMovementY: shapeEl.isLocked,
            lockRotation: shapeEl.isLocked,
            lockScalingX: shapeEl.isLocked,
            lockScalingY: shapeEl.isLocked,
          } as any)
          // Update fill and stroke
          fabricObj.set('fill', shapeEl.fill)
          if (shapeEl.stroke) fabricObj.set('stroke', shapeEl.stroke)
          fabricObj.set('strokeWidth', shapeEl.strokeWidth)
        }
      }
    })
    
    canvas.renderAll()
  }, [currentPageData?.elements, currentPageData])
  
  // Handle selection sync
  // Sync selection from store to canvas (only when not triggered by canvas itself)
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    
    // Skip if this selection change came from canvas (prevent feedback loop)
    if (isCanvasSelectionRef.current) return
    
    // Skip if we're editing to prevent jumps
    if (editingElementIdRef.current) return
    
    if (selectedElementId) {
      const obj = elementObjectsRef.current.get(selectedElementId)
      const activeObj = canvas.getActiveObject()
      // Only update if the selection is different (prevent double-selection)
      if (obj && (activeObj as any)?.elementId !== selectedElementId) {
        canvas.setActiveObject(obj)
        canvas.renderAll()
      }
    } else {
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }, [selectedElementId])
  
  // Handle zoom - CSS transform handles scaling, no need for fabric zoom
  // useEffect(() => {
  //   const canvas = fabricRef.current
  //   if (!canvas) return
  //   canvas.setZoom(zoom)
  //   canvas.renderAll()
  // }, [zoom])
  
  // Add new text element - size relative to canvas
  const handleAddText = useCallback(() => {
    if (!currentPageData || !fabricRef.current) return
    
    const canvas = fabricRef.current
    const canvasWidth = currentPageData.width || 800
    const canvasHeight = currentPageData.height || 1200
    
    // Size text relative to canvas (about 10% of canvas width)
    const textWidth = Math.max(100, canvasWidth * 0.15)
    const textHeight = Math.max(30, canvasHeight * 0.05)
    const fontSize = Math.max(16, Math.min(48, canvasWidth * 0.03))
    
    addElement({
      type: 'text',
      sourceText: '',
      targetText: 'Double-click to edit',
      name: 'Text',
      x: (canvasWidth - textWidth) / 2,
      y: (canvasHeight - textHeight) / 2,
      width: textWidth,
      height: textHeight,
      rotation: 0,
      fontSize: fontSize,
      fontFamily: 'Noto Sans JP',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      fill: '#000000',
      strokeWidth: 0,
      confidence: 1,
      isLocked: false,
      isVisible: true,
      opacity: 1,
    } as Omit<TextBlock, 'id' | 'zIndex'>)
  }, [currentPageData, addElement])
  
  // Add shape element - size relative to canvas
  const handleAddShape = useCallback((shapeType: 'rect' | 'circle' | 'triangle') => {
    if (!currentPageData || !fabricRef.current) return
    
    const canvasWidth = currentPageData.width || 800
    const canvasHeight = currentPageData.height || 1200
    
    // Size shape relative to canvas (about 8% of canvas size)
    const shapeSize = Math.max(60, Math.min(canvasWidth, canvasHeight) * 0.08)
    
    const baseShape = {
      name: shapeType.charAt(0).toUpperCase() + shapeType.slice(1),
      x: (canvasWidth - shapeSize) / 2,
      y: (canvasHeight - shapeSize) / 2,
      width: shapeSize,
      height: shapeSize,
      rotation: 0,
      fill: '#fbbf24',
      stroke: '#000000',
      strokeWidth: 2,
      isLocked: false,
      isVisible: true,
      opacity: 1,
    }
    
    addElement({
      type: shapeType,
      ...baseShape,
    } as Omit<ShapeElement, 'id' | 'zIndex'>)
  }, [currentPageData, addElement])
  
  // Check if we have required data (after all hooks)
  if (!currentProject || !currentChapter) {
    navigateTo('projects')
    return <div className="h-screen flex items-center justify-center">Redirecting...</div>
  }
  
  // Handle OCR
  const handleOCR = async () => {
    if (!currentPageData?.originalUrl) return
    
    setProcessing(true, 'Running OCR...')
    
    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: currentPageData.originalUrl })
      })
      
      const data = await response.json()
      
      if (data.success && data.detections) {
        // Add detected text elements
        data.detections.forEach((detection: any) => {
          const x = (detection.x / 100) * (currentPageData.width || 800)
          const y = (detection.y / 100) * (currentPageData.height || 1200)
          const width = (detection.width / 100) * (currentPageData.width || 800)
          const height = (detection.height / 100) * (currentPageData.height || 1200)
          
          addElement({
            type: 'text',
            sourceText: detection.text,
            targetText: '',
            name: `Text ${detection.text.substring(0, 10)}...`,
            x, y, width, height,
            rotation: detection.rotation || 0,
            fontSize: 16,
            fontFamily: 'Noto Sans JP',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'center',
            fill: '#000000',
            strokeWidth: 0,
            confidence: detection.confidence || 0.9,
            isLocked: false,
            isVisible: true,
            opacity: 1,
          } as Omit<TextBlock, 'id' | 'zIndex'>)
        })
        
        toast.success(`Detected ${data.detections.length} text blocks`)
      }
    } catch (error) {
      toast.error('OCR failed')
    }
    
    setProcessing(false)
  }
  
  // Handle Translation
  const handleTranslate = async () => {
    if (!currentPageData || !currentProject) return
    
    const elements = currentPageData.elements || []
    const untranslatedBlocks = elements.filter((b): b is TextBlock => b.type === 'text' && !b.targetText)
    if (untranslatedBlocks.length === 0) {
      toast.success('All blocks already translated')
      return
    }
    
    setProcessing(true, 'Translating...')
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: untranslatedBlocks.map(b => ({ id: b.id, text: b.sourceText })),
          sourceLang: currentProject.sourceLang,
          targetLang: currentProject.targetLang,
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.translations) {
        data.translations.forEach((t: any) => {
          if (t.id && t.translation) {
            updateElement(t.id, { targetText: t.translation } as Partial<TextBlock>)
          }
        })
        
        toast.success(`Translated ${data.translations.length} blocks`)
      }
    } catch (error) {
      toast.error('Translation failed')
    }
    
    setProcessing(false)
  }
  
  // Handle Inpainting
  const handleClean = async () => {
    if (!currentPageData?.originalUrl) return
    
    setProcessing(true, 'Cleaning text from image...')
    
    try {
      const textElements = (currentPageData.elements || []).filter((el): el is TextBlock => el.type === 'text')
      const response = await fetch('/api/inpaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageUrl: currentPageData.originalUrl,
          maskAreas: textElements.map(b => ({
            x: (b.x / (currentPageData.width || 800)) * 100,
            y: (b.y / (currentPageData.height || 1200)) * 100,
            width: (b.width / (currentPageData.width || 800)) * 100,
            height: (b.height / (currentPageData.height || 1200)) * 100,
          }))
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.processedUrl) {
        // Update page with cleaned URL
        setCurrentPageData({
          ...currentPageData,
          cleanedUrl: data.processedUrl,
          isProcessed: true,
        })
        toast.success('Image cleaned successfully')
      }
    } catch (error) {
      toast.error('Inpainting failed')
    }
    
    setProcessing(false)
  }
  
  // Handle Export - render all pages and download as ZIP
  const handleExport = async () => {
    if (!currentChapter || !currentProject) return
    
    setProcessing(true, 'Preparing export...')
    
    try {
      const pages = currentChapter.pages
      const exportImages: string[] = []
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        setProcessing(true, `Rendering page ${i + 1}/${pages.length}...`)
        
        // Create a temporary canvas to render the page
        const img = new window.Image()
        img.crossOrigin = 'anonymous'
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject(new Error('Failed to load image'))
          img.src = page.cleanedUrl || page.originalUrl
        })
        
        // Create canvas with page dimensions
        const canvas = document.createElement('canvas')
        canvas.width = page.width || img.width
        canvas.height = page.height || img.height
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          throw new Error('Could not get canvas context')
        }
        
        // Draw background image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Render elements (text blocks)
        const textElements = (page.elements || []).filter((el): el is TextBlock => el.type === 'text')
        for (const block of textElements) {
          if (!block.isVisible || !block.targetText) continue
          
          ctx.save()
          
          // Set font
          const fontStyle = block.fontStyle === 'italic' ? 'italic ' : ''
          const fontWeight = block.fontWeight === 'bold' ? 'bold ' : ''
          ctx.font = `${fontStyle}${fontWeight}${block.fontSize}px "${block.fontFamily}"`
          
          // Set colors
          ctx.fillStyle = block.fill || '#000000'
          if (block.stroke && block.strokeWidth > 0) {
            ctx.strokeStyle = block.stroke
            ctx.lineWidth = block.strokeWidth
          }
          
          // Set alignment
          ctx.textAlign = (block.textAlign as CanvasTextAlign) || 'center'
          ctx.textBaseline = 'top'
          
          // Apply rotation and position
          const centerX = block.x + block.width / 2
          const centerY = block.y + block.height / 2
          ctx.translate(centerX, centerY)
          ctx.rotate((block.rotation * Math.PI) / 180)
          ctx.translate(-centerX, -centerY)
          
          // Word wrap text
          const words = block.targetText.split(' ')
          const lines: string[] = []
          let currentLine = ''
          
          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word
            const metrics = ctx.measureText(testLine)
            if (metrics.width > block.width && currentLine) {
              lines.push(currentLine)
              currentLine = word
            } else {
              currentLine = testLine
            }
          }
          if (currentLine) lines.push(currentLine)
          
          // Draw text lines
          const lineHeight = block.fontSize * 1.2
          const totalHeight = lines.length * lineHeight
          let startY = block.y + (block.height - totalHeight) / 2
          
          for (const line of lines) {
            let textX = block.x
            if (block.textAlign === 'center') {
              textX = block.x + block.width / 2
            } else if (block.textAlign === 'right') {
              textX = block.x + block.width
            }
            
            if (block.stroke && block.strokeWidth > 0) {
              ctx.strokeText(line, textX, startY)
            }
            ctx.fillText(line, textX, startY)
            startY += lineHeight
          }
          
          ctx.restore()
        }
        
        // Get image data
        const dataUrl = canvas.toDataURL('image/png')
        exportImages.push(dataUrl)
      }
      
      setProcessing(true, 'Creating ZIP file...')
      
      // Create and download ZIP using JSZip (dynamically imported)
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      const folderName = `${currentProject.name.replace(/[^a-zA-Z0-9]/g, '_')}_${currentChapter.title.replace(/[^a-zA-Z0-9]/g, '_')}`
      const folder = zip.folder(folderName)
      
      for (let i = 0; i < exportImages.length; i++) {
        const base64Data = exportImages[i].split(',')[1]
        folder?.file(`page_${String(i + 1).padStart(3, '0')}.png`, base64Data, { base64: true })
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      
      // Download the ZIP
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${folderName}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success(`Exported ${pages.length} pages successfully!`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
    
    setProcessing(false)
  }
  
  // Style handlers
  const handleStyleUpdate = (property: string, value: any) => {
    if (!selectedElement) return
    updateElement(selectedElement.id, { [property]: value })
  }
  
  const toggleBold = () => {
    if (!selectedElement || selectedElement.type !== 'text') return
    updateElement(selectedElement.id, { 
      fontWeight: (selectedElement as TextBlock).fontWeight === 'bold' ? 'normal' : 'bold' 
    } as Partial<TextBlock>)
  }
  
  const toggleItalic = () => {
    if (!selectedElement || selectedElement.type !== 'text') return
    updateElement(selectedElement.id, { 
      fontStyle: (selectedElement as TextBlock).fontStyle === 'italic' ? 'normal' : 'italic' 
    } as Partial<TextBlock>)
  }
  
  const setAlignment = (align: 'left' | 'center' | 'right') => {
    if (!selectedElement || selectedElement.type !== 'text') return
    updateElement(selectedElement.id, { textAlign: align } as Partial<TextBlock>)
  }
  
  const toggleLock = () => {
    if (!selectedElement) return
    updateElement(selectedElement.id, { isLocked: !selectedElement.isLocked })
  }
  
  const toggleVisibility = () => {
    if (!selectedElement) return
    updateElement(selectedElement.id, { isVisible: !selectedElement.isVisible })
  }
  
  // Page navigation
  const currentPageIndex = currentChapter.pages.findIndex(p => p.id === currentPageData?.id)
  const prevPage = currentPageIndex > 0 ? currentChapter.pages[currentPageIndex - 1] : null
  const nextPage = currentPageIndex < currentChapter.pages.length - 1 ? currentChapter.pages[currentPageIndex + 1] : null
  
  const goToPage = (page: Page) => {
    setCurrentPageData(page)
    elementObjectsRef.current.clear()
  }
  
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-background">
        <Button 
          variant="ghost" 
          size="sm"
          className="gap-2"
          onClick={() => navigateTo('project-detail')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="font-semibold text-sm">{currentProject.name}</span>
            <span className="text-muted-foreground text-xs ml-2">
              {currentChapter.title} - Page {currentPageIndex + 1}/{currentChapter.pages.length}
            </span>
          </div>
        </div>
        
        <div className="flex-1" />
        
        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={!prevPage}
            onClick={() => prevPage && goToPage(prevPage)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {currentPageIndex + 1} / {currentChapter.pages.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!nextPage}
            onClick={() => nextPage && goToPage(nextPage)}
          >
            Next
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6 mx-2" />
        
        {/* AI Actions */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={handleOCR}
          disabled={isProcessing || !currentPageData?.originalUrl}
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          OCR
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={handleClean}
          disabled={isProcessing || !currentPageData?.originalUrl || (currentPageData.elements || []).length === 0}
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          Clean
        </Button>
        
        <Button
          variant="default"
          size="sm"
          className="gap-1.5 bg-primary"
          onClick={handleTranslate}
          disabled={isProcessing || (currentPageData?.elements || []).length === 0}
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
          Translate
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={handleExport}
          disabled={isProcessing}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
      
      {/* Second Toolbar - Text Styling */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-muted/30">
        {/* Font Family - Only for text */}
        {selectedElement && selectedElement.type === 'text' && (() => {
          const textEl = selectedElement as TextBlock
          return (
            <>
              <Select
                value={textEl.fontFamily}
                onValueChange={(value) => handleStyleUpdate('fontFamily', value)}
              >
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="Font" />
                </SelectTrigger>
                <SelectContent>
                  {GOOGLE_FONTS.map(font => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Font Size */}
              <Select
                value={textEl.fontSize.toString()}
                onValueChange={(value) => handleStyleUpdate('fontSize', parseInt(value))}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map(size => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Separator orientation="vertical" className="h-6 mx-1" />
              
              {/* Bold */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      textEl.fontWeight === 'bold' && "bg-primary text-primary-foreground"
                    )}
                    onClick={toggleBold}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
              </Tooltip>
              
              {/* Italic */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      textEl.fontStyle === 'italic' && "bg-primary text-primary-foreground"
                    )}
                    onClick={toggleItalic}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
              </Tooltip>
              
              <Separator orientation="vertical" className="h-6 mx-1" />
              
              {/* Alignment */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      textEl.textAlign === 'left' && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setAlignment('left')}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Left</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      textEl.textAlign === 'center' && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setAlignment('center')}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Center</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      textEl.textAlign === 'right' && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setAlignment('right')}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Right</TooltipContent>
              </Tooltip>
              
              <Separator orientation="vertical" className="h-6 mx-1" />
            </>
          )
        })()}
        
        {/* Colors - Works for all elements */}
        {selectedElement && (
          <>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Fill:</Label>
              <Input
                type="color"
                value={selectedElement.fill || '#000000'}
                onChange={(e) => handleStyleUpdate('fill', e.target.value)}
                className="w-8 h-8 p-0.5 cursor-pointer"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Stroke:</Label>
              <Input
                type="color"
                value={selectedElement.stroke || '#000000'}
                onChange={(e) => handleStyleUpdate('stroke', e.target.value)}
                className="w-8 h-8 p-0.5 cursor-pointer"
              />
            </div>
            
            {/* Stroke Width */}
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Stroke W:</Label>
              <Input
                type="number"
                value={selectedElement.strokeWidth || 0}
                onChange={(e) => handleStyleUpdate('strokeWidth', parseInt(e.target.value) || 0)}
                className="w-14 h-8 text-xs"
                min={0}
                max={20}
              />
            </div>
            
            {/* Opacity */}
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Opacity:</Label>
              <Slider
                value={[selectedElement.opacity * 100]}
                onValueChange={(val) => handleStyleUpdate('opacity', val[0] / 100)}
                min={0}
                max={100}
                step={1}
                className="w-20"
              />
              <span className="text-xs">{Math.round(selectedElement.opacity * 100)}%</span>
            </div>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Lock */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    selectedElement.isLocked && "bg-primary text-primary-foreground"
                  )}
                  onClick={toggleLock}
                >
                  {selectedElement.isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{selectedElement.isLocked ? 'Unlock' : 'Lock'}</TooltipContent>
            </Tooltip>
            
            {/* Visibility */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    !selectedElement.isVisible && "bg-destructive text-destructive-foreground"
                  )}
                  onClick={toggleVisibility}
                >
                  {selectedElement.isVisible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{selectedElement.isVisible ? 'Hide' : 'Show'}</TooltipContent>
            </Tooltip>
            
            {/* Delete */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => deleteElement(selectedElement.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </>
        )}
        
        {/* Add Elements */}
        <div className="flex items-center gap-1 ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleAddShape('rect')}
              >
                <Square className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Rectangle</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleAddShape('circle')}
              >
                <Circle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Circle</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleAddShape('triangle')}
              >
                <Triangle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Triangle</TooltipContent>
          </Tooltip>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleAddText}
          >
            <Type className="w-4 h-4" />
            Add Text
          </Button>
        </div>
        
        {/* Layer Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 gap-1.5",
                showOriginalLayer ? "" : "bg-primary/10 text-primary"
              )}
              onClick={toggleOriginalLayer}
            >
              <Layers className="w-4 h-4" />
              {showOriginalLayer ? 'Original' : 'Cleaned'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle between original and cleaned image</TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        {/* Pan Mode Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                isPanMode && "bg-primary text-primary-foreground"
              )}
              onClick={togglePanMode}
            >
              <Hand className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Pan Mode (drag to move canvas)</TooltipContent>
        </Tooltip>
        
        {/* Fit to View */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                if (canvasContainerRef.current && (actualImageSize || currentPageData)) {
                  fitToView(
                    canvasContainerRef.current.clientWidth,
                    canvasContainerRef.current.clientHeight,
                    actualImageSize?.width || currentPageData?.width || 800,
                    actualImageSize?.height || currentPageData?.height || 1200
                  )
                }
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fit to View</TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        {/* Zoom */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setZoom(Math.min(5, zoom + 0.1))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              // Reset to 100% and center in viewport
              if (canvasContainerRef.current && currentPageData) {
                const container = canvasContainerRef.current
                const imgWidth = currentPageData.width || 800
                const imgHeight = currentPageData.height || 1200
                
                // Center the canvas in the container
                const centerX = (container.clientWidth - imgWidth) / 2
                const centerY = (container.clientHeight - imgHeight) / 2
                
                setZoom(1)
                setPanOffset({ x: centerX, y: centerY })
              } else {
                setZoom(1)
                setPanOffset({ x: 0, y: 0 })
              }
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out flex-shrink-0 border-r border-border relative",
            leftPanelOpen ? "" : "w-0"
          )}
          style={{ width: leftPanelOpen ? `${leftPanelWidth}px` : '0px' }}
        >
          {leftPanelOpen && (
            <>
              <div className="flex flex-col h-full flex-1 overflow-hidden">
                {/* Sidebar Tabs */}
              <div className="flex border-b border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex-1 rounded-none h-10",
                    activeSidebarTab === 'pages' && "bg-muted"
                  )}
                  onClick={() => setActiveSidebarTab('pages')}
                >
                  Pages
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex-1 rounded-none h-10",
                    activeSidebarTab === 'layers' && "bg-muted"
                  )}
                  onClick={() => setActiveSidebarTab('layers')}
                >
                  <Layers className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex-1 rounded-none h-10",
                    activeSidebarTab === 'tools' && "bg-muted"
                  )}
                  onClick={() => setActiveSidebarTab('tools')}
                >
                  Tools
                </Button>
              </div>
              
              {/* Sidebar Content */}
              <ScrollArea className="flex-1" onWheel={(e) => e.stopPropagation()}>
                {activeSidebarTab === 'pages' && (
                  <div className="p-2 space-y-2">
                    {/* Page List with Drag and Drop */}
                    <PageListDnD 
                      pages={currentChapter.pages}
                      currentPageId={currentPageData?.id}
                      onSelectPage={goToPage}
                      onDeletePage={(pageId) => {
                        if (confirm('Delete this page?')) {
                          deletePage(pageId)
                          toast.success('Page deleted')
                        }
                      }}
                      onMovePage={movePage}
                    />
                  </div>
                )}
                
                {activeSidebarTab === 'layers' && (
                  <div className="p-2 space-y-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Layers</p>
                      <span className="text-xs text-muted-foreground">
                        {canvasElements.length} elements
                      </span>
                    </div>
                    
                    {canvasElements.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No elements yet
                      </p>
                    ) : (
                      [...canvasElements]
                        .sort((a, b) => b.zIndex - a.zIndex)
                        .map((element, index, sortedArray) => (
                          <div
                            key={element.id}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                              selectedElementId === element.id 
                                ? "bg-primary/10 border border-primary/30" 
                                : "hover:bg-muted border border-transparent"
                            )}
                            onClick={() => selectElement(element.id)}
                          >
                            {/* Position indicator - shows layer order */}
                            <div className="w-5 h-5 flex items-center justify-center bg-muted rounded text-xs font-medium text-muted-foreground">
                              {index + 1}
                            </div>
                            
                            {/* Element type icon */}
                            {element.type === 'text' ? (
                              <Type className="w-4 h-4" />
                            ) : element.type === 'rect' ? (
                              <Square className="w-4 h-4" />
                            ) : element.type === 'circle' ? (
                              <Circle className="w-4 h-4" />
                            ) : element.type === 'triangle' ? (
                              <Triangle className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                            
                            {/* Element name */}
                            <span className="flex-1 text-sm truncate">
                              {element.name || `${element.type} ${index + 1}`}
                            </span>
                            
                            {/* Position badge - Top/Bottom indicator */}
                            {index === 0 && (
                              <Badge variant="outline" className="text-[10px] h-5 px-1">
                                Top
                              </Badge>
                            )}
                            {index === sortedArray.length - 1 && sortedArray.length > 1 && (
                              <Badge variant="outline" className="text-[10px] h-5 px-1">
                                Bottom
                              </Badge>
                            )}
                            
                            {/* Visibility toggle */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateElement(element.id, { isVisible: !element.isVisible })
                              }}
                            >
                              {element.isVisible ? (
                                <Eye className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3 text-muted-foreground" />
                              )}
                            </Button>
                            
                            {/* Lock toggle */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateElement(element.id, { isLocked: !element.isLocked })
                              }}
                            >
                              {element.isLocked ? (
                                <Lock className="w-3 h-3" />
                              ) : (
                                <Unlock className="w-3 h-3 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        ))
                    )}
                    
                    {/* Layer Actions */}
                    {selectedElement && (
                      <div className="flex gap-1 mt-2 pt-2 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7 text-xs"
                          onClick={() => bringToFront(selectedElement.id)}
                        >
                          <BringToFront className="w-3 h-3 mr-1" />
                          Front
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7 text-xs"
                          onClick={() => sendToBack(selectedElement.id)}
                        >
                          <SendToBack className="w-3 h-3 mr-1" />
                          Back
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            // Duplicate element
                            const newElement = { ...selectedElement }
                            newElement.x += 20
                            newElement.y += 20
                            newElement.name = `${selectedElement.name} copy`
                            addElement(newElement as Omit<CanvasObject, 'id' | 'zIndex'>)
                            toast.success('Element duplicated')
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {activeSidebarTab === 'tools' && (
                  <div className="p-3 space-y-2">
                    <p className="text-sm text-muted-foreground">Magic Tools</p>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={handleOCR}
                    >
                      <Wand2 className="w-4 h-4" />
                      Auto OCR
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={handleTranslate}
                    >
                      <Languages className="w-4 h-4" />
                      Auto Translate
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={handleClean}
                    >
                      <ImageIcon className="w-4 h-4" />
                      Clean Image
                    </Button>
                  </div>
                )}
              </ScrollArea>
              
              {/* Add Page Button at Bottom */}
              {activeSidebarTab === 'pages' && (
                <div className="p-2 border-t border-border">
                  <label className="w-full cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = e.target.files
                        if (!files || files.length === 0) return
                        
                        setProcessing(true, 'Adding pages...')
                        
                        for (let i = 0; i < files.length; i++) {
                          const file = files[i]
                          
                          try {
                            const dataUrl = await new Promise<string>((resolve, reject) => {
                              const reader = new FileReader()
                              reader.onload = () => resolve(reader.result as string)
                              reader.onerror = reject
                              reader.readAsDataURL(file)
                            })
                            
                            const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
                              const img = new window.Image()
                              img.onload = () => resolve({ width: img.width, height: img.height })
                              img.src = dataUrl
                            })
                            
                            addPage(currentChapter.id, {
                              originalUrl: dataUrl,
                              pageNumber: currentChapter.pages.length + i + 1,
                              width: dimensions.width,
                              height: dimensions.height,
                              elements: [],
                              isProcessed: false,
                              isOCRed: false,
                            })
                          } catch (err) {
                            toast.error(`Failed to add ${file.name}`)
                          }
                        }
                        
                        setProcessing(false)
                        toast.success(`Added ${files.length} pages`)
                        e.target.value = ''
                      }}
                    />
                    <div className="w-full py-3 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                      <Plus className="w-5 h-5" />
                      <span className="text-sm font-medium">Add Page</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
            
            {/* Resize Handle */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/50 transition-colors group"
              onMouseDown={(e) => {
                e.preventDefault()
                setIsResizingLeft(true)
                const startX = e.clientX
                const startWidth = leftPanelWidth
                
                const handleMouseMove = (e: MouseEvent) => {
                  const diff = e.clientX - startX
                  const newWidth = Math.max(200, Math.min(400, startWidth + diff))
                  setLeftPanelWidth(newWidth)
                }
                
                const handleMouseUp = () => {
                  setIsResizingLeft(false)
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                }
                
                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
              }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-border rounded group-hover:bg-primary" />
            </div>
          </>
          )}
        </div>
        
        {/* Toggle Left Panel */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute z-10 h-8 w-8 bg-background border border-border shadow-sm"
          style={{ 
            left: leftPanelOpen ? `${leftPanelWidth + 4}px` : '4px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
        >
          {leftPanelOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </Button>
        
        {/* Canvas Area */}
        <div 
          ref={canvasContainerRef}
          className="flex-1 relative overflow-hidden bg-muted/30"
          style={{ 
            touchAction: 'none',
            cursor: isPanMode ? 'grab' : 'default'
          }}
          onMouseDown={(e) => {
            if (!isPanMode) return
            isPanningRef.current = true
            panStartRef.current = {
              x: e.clientX,
              y: e.clientY,
              panX: panOffset.x,
              panY: panOffset.y
            }
            e.currentTarget.style.cursor = 'grabbing'
          }}
          onMouseMove={(e) => {
            if (!isPanningRef.current || !panStartRef.current) return
            const dx = e.clientX - panStartRef.current.x
            const dy = e.clientY - panStartRef.current.y
            setPanOffset({
              x: panStartRef.current.panX + dx,
              y: panStartRef.current.panY + dy
            })
          }}
          onMouseUp={(e) => {
            isPanningRef.current = false
            e.currentTarget.style.cursor = isPanMode ? 'grab' : 'default'
          }}
          onMouseLeave={() => {
            isPanningRef.current = false
          }}
          onWheel={(e) => {
            // Zoom with mouse wheel - zoom towards center
            e.preventDefault()
            e.stopPropagation()
            
            if (!canvasContainerRef.current || !(actualImageSize || currentPageData)) return
            
            const container = canvasContainerRef.current
            const rect = container.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top
            
            const imgWidth = actualImageSize?.width || currentPageData?.width || 800
            const imgHeight = actualImageSize?.height || currentPageData?.height || 1200
            
            // Calculate current center of the image in screen coordinates
            const imageCenterX = panOffset.x + (imgWidth * zoom) / 2
            const imageCenterY = panOffset.y + (imgHeight * zoom) / 2
            
            const delta = e.deltaY > 0 ? 0.9 : 1.1
            const newZoom = Math.max(0.1, Math.min(5, zoom * delta))
            
            // Adjust pan to zoom towards mouse position
            const zoomRatio = newZoom / zoom
            const newPanX = mouseX - (mouseX - panOffset.x) * zoomRatio
            const newPanY = mouseY - (mouseY - panOffset.y) * zoomRatio
            
            setZoom(newZoom)
            setPanOffset({ x: newPanX, y: newPanY })
          }}
          onTouchStart={(e) => {
            if (e.touches.length === 2) {
              // Pinch to zoom - record initial distance and center
              const touch1 = e.touches[0]
              const touch2 = e.touches[1]
              const distance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
              )
              lastTouchDistanceRef.current = distance
              lastTouchCenterRef.current = {
                x: (touch1.clientX + touch2.clientX) / 2,
                y: (touch1.clientY + touch2.clientY) / 2
              }
            } else if (e.touches.length === 1 && isPanMode) {
              // Start panning with one finger
              isPanningRef.current = true
              panStartRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                panX: panOffset.x,
                panY: panOffset.y
              }
            }
          }}
          onTouchMove={(e) => {
            e.preventDefault()
            e.stopPropagation()
            
            if (e.touches.length === 2 && lastTouchDistanceRef.current) {
              // Pinch to zoom
              const touch1 = e.touches[0]
              const touch2 = e.touches[1]
              const distance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
              )
              
              if (lastTouchDistanceRef.current > 0) {
                const scale = distance / lastTouchDistanceRef.current
                const newZoom = Math.max(0.1, Math.min(5, zoom * scale))
                setZoom(newZoom)
              }
              
              lastTouchDistanceRef.current = distance
              
              // Also handle pan during pinch
              if (lastTouchCenterRef.current) {
                const centerX = (touch1.clientX + touch2.clientX) / 2
                const centerY = (touch1.clientY + touch2.clientY) / 2
                const dx = centerX - lastTouchCenterRef.current.x
                const dy = centerY - lastTouchCenterRef.current.y
                setPanOffset({
                  x: panOffset.x + dx,
                  y: panOffset.y + dy
                })
                lastTouchCenterRef.current = { x: centerX, y: centerY }
              }
            } else if (e.touches.length === 1 && isPanningRef.current && panStartRef.current) {
              // Pan with one finger
              const dx = e.touches[0].clientX - panStartRef.current.x
              const dy = e.touches[0].clientY - panStartRef.current.y
              setPanOffset({
                x: panStartRef.current.panX + dx,
                y: panStartRef.current.panY + dy
              })
            }
          }}
          onTouchEnd={() => {
            lastTouchDistanceRef.current = null
            lastTouchCenterRef.current = null
            isPanningRef.current = false
            panStartRef.current = null
          }}
        >
          {/* Canvas wrapper - positioned and scaled */}
          {/* Use left/top for positioning and transform scale for zoom */}
          {/* This keeps panOffset independent of zoom scale */}
          {/* IMPORTANT: Use actualImageSize to match the fabric canvas dimensions exactly */}
          <div
            className="absolute shadow-2xl rounded-lg overflow-hidden border border-border bg-white"
            style={{
              left: panOffset.x,
              top: panOffset.y,
              width: actualImageSize?.width || currentPageData?.width || 800,
              height: actualImageSize?.height || currentPageData?.height || 1200,
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            <canvas 
              ref={canvasRef}
            />
          </div>
          
          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Processing...</p>
              </div>
            </div>
          )}
          
          {/* Floating Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-1 shadow-lg z-10">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            
            <span className="text-xs w-12 text-center font-medium">{Math.round(zoom * 100)}%</span>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setZoom(Math.min(5, zoom + 0.1))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            
            <div className="w-px h-5 bg-border mx-1" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs font-medium"
                  onClick={() => {
                    if (canvasContainerRef.current && (actualImageSize || currentPageData)) {
                      const container = canvasContainerRef.current
                      const imgWidth = actualImageSize?.width || currentPageData?.width || 800
                      const imgHeight = actualImageSize?.height || currentPageData?.height || 1200
                      
                      // Match the same logic as initial fit
                      const padding = 10
                      const availableWidth = container.clientWidth - padding * 2
                      const availableHeight = container.clientHeight - padding * 2
                      
                      const scaleX = availableWidth / imgWidth
                      const scaleY = availableHeight / imgHeight
                      const fitZoom = Math.min(scaleX, scaleY)
                      
                      // Center the image
                      const scaledWidth = imgWidth * fitZoom
                      const scaledHeight = imgHeight * fitZoom
                      const panX = (container.clientWidth - scaledWidth) / 2
                      const panY = (container.clientHeight - scaledHeight) / 2
                      
                      setZoom(fitZoom)
                      setPanOffset({ x: panX, y: panY })
                    }
                  }}
                >
                  Fit
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fit image to view</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs font-medium"
                  onClick={() => {
                    if ((actualImageSize || currentPageData) && canvasContainerRef.current) {
                      const container = canvasContainerRef.current
                      const imgWidth = actualImageSize?.width || currentPageData?.width || 800
                      const imgHeight = actualImageSize?.height || currentPageData?.height || 1200
                      
                      // At 100%, center the image in the container
                      const panX = (container.clientWidth - imgWidth) / 2
                      const panY = (container.clientHeight - imgHeight) / 2
                      
                      setZoom(1)
                      setPanOffset({ x: panX, y: panY })
                    }
                  }}
                >
                  100%
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show at actual size (100%)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      
      {/* Bottom Panel - Text Grid */}
      <div
        className="relative"
        style={{ height: bottomPanelOpen ? `${bottomPanelHeight}px` : '40px' }}
      >
        {/* Resize Handle */}
        {bottomPanelOpen && (
          <div
            className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-primary/50 transition-colors group z-10"
            onMouseDown={(e) => {
              e.preventDefault()
              setIsResizingBottom(true)
              const startY = e.clientY
              const startHeight = bottomPanelHeight
              
              const handleMouseMove = (e: MouseEvent) => {
                const diff = startY - e.clientY
                const newHeight = Math.max(100, Math.min(400, startHeight + diff))
                setBottomPanelHeight(newHeight)
              }
              
              const handleMouseUp = () => {
                setIsResizingBottom(false)
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }
              
              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-12 bg-border rounded group-hover:bg-primary" />
          </div>
        )}
        
        <div
          className={cn(
            "h-full flex flex-col border-t border-border bg-background",
          )}
        >
          <button
            className="w-full h-10 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors flex-shrink-0"
            onClick={() => setBottomPanelOpen(!bottomPanelOpen)}
          >
            {bottomPanelOpen ? (
              <>
                <PanelBottomClose className="h-4 w-4" />
                <span>Hide Text Grid</span>
              </>
            ) : (
              <>
                <PanelBottom className="h-4 w-4" />
                <span>Show Text Grid ({canvasElements.length} elements)</span>
              </>
            )}
          </button>
          
          {bottomPanelOpen && (
            <div 
              className="flex-1 overflow-hidden"
              onWheel={(e) => e.stopPropagation()}
            >
              <TextGridComponent />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ Text Grid Component ============
function TextGridComponent() {
  const { currentPageData, selectedElementId, selectElement, updateElement, deleteElement, moveElementUp, moveElementDown } = useAppStore()
  const elements = currentPageData?.elements ?? []
  const textElements = elements.filter(el => el.type === 'text') as TextBlock[]
  
  // Removed autoscroll to prevent jumps when clicking textbox
  // const selectedRowRef = useRef<HTMLDivElement>(null)
  
  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground p-2 border-b border-border w-10">#</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-2 border-b border-border w-40">Original</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-2 border-b border-border w-40">Translation</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-2 border-b border-border w-20">Position</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-2 border-b border-border w-16">Color</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-2 border-b border-border w-16">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-2 border-b border-border w-10">Vis</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-2 border-b border-border w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {textElements.map((block, index) => (
              <tr
                key={block.id}
                className={cn(
                  "border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer",
                  block.id === selectedElementId && "bg-primary/10"
                )}
                onClick={() => selectElement(block.id)}
              >
                <td className="p-2 text-xs text-muted-foreground font-mono">{index + 1}</td>
                <td className="p-2">
                  <span className="text-sm truncate block max-w-[150px]">{block.sourceText || <span className="text-muted-foreground italic">Empty</span>}</span>
                </td>
                <td className="p-2">
                  <Input
                    value={block.targetText || ''}
                    onChange={(e) => updateElement(block.id, { targetText: e.target.value } as Partial<TextBlock>)}
                    placeholder="Enter translation..."
                    className="h-7 text-sm border-0 bg-transparent focus:bg-background px-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="p-2 text-xs text-muted-foreground">
                  {Math.round(block.x)}, {Math.round(block.y)}
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: block.fill }}
                    />
                    {block.stroke && (
                      <div 
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: block.stroke }}
                      />
                    )}
                  </div>
                </td>
                <td className="p-2">
                  {!block.targetText ? (
                    <Badge variant="outline" className="text-[10px]">Pending</Badge>
                  ) : block.confidence < 0.8 ? (
                    <Badge variant="secondary" className="text-[10px]">Low</Badge>
                  ) : (
                    <Badge className="text-[10px] bg-primary text-primary-foreground">Done</Badge>
                  )}
                </td>
                <td className="p-2">
                  <Checkbox
                    checked={block.isVisible}
                    onCheckedChange={(checked) => updateElement(block.id, { isVisible: !!checked })}
                    className="h-4 w-4"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveElementUp(block.id)
                      }}
                    >
                      <ChevronUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveElementDown(block.id)
                      }}
                    >
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {textElements.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground text-sm">
                  No text elements. Click "Add Text" or run OCR to detect text.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  )
}
