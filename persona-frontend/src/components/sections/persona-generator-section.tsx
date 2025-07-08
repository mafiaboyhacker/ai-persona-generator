"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shuffle, Download, Edit, X, RotateCcw, ChevronDown, FileText, Image as ImageIcon, Images, Trash2, Eye } from "lucide-react"

export function PersonaGeneratorSection() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPersona, setGeneratedPersona] = useState<{
    error?: boolean;
    message?: string;
    data?: Record<string, unknown>;
    imageUrl?: string;
    seed?: string;
    fal_model?: string;
    profile?: string;
    imagePrompt?: string;
    originalImageUrl?: string;
  } | null>(null)
  const [formData, setFormData] = useState({
    personaType: "",
    desiredStyle: "",
    allowNsfw: false,
    allowRandomGeneration: false
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    imagePrompt: "",
    fluxModel: "flux-pro-1.1",
    loraModel: "none",
    seed: ""
  })
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false)
  const downloadDropdownRef = useRef<HTMLDivElement>(null)
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)
  const [savedPersonas, setSavedPersonas] = useState<any[]>([])
  const [selectedPersonaForView, setSelectedPersonaForView] = useState<any>(null)

  // API 기본 URL (Vercel Serverless Functions)
  const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : ''

  // 다운로드 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
        setIsDownloadDropdownOpen(false)
      }
    }

    if (isDownloadDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDownloadDropdownOpen])

  // 저장된 페르소나 로드
  useEffect(() => {
    const loadSavedPersonas = () => {
      const saved = JSON.parse(localStorage.getItem('savedPersonas') || '[]')
      setSavedPersonas(saved)
    }
    
    loadSavedPersonas()
  }, [])

  const handleGenerate = async () => {
    if (!formData.personaType || !formData.desiredStyle) return
    
    setIsGenerating(true)
    
    try {
      // API call to our Flask backend
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60초 타임아웃
      
      const response = await fetch(`${API_BASE_URL}/api/generate-complete-persona`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personaType: formData.personaType,
          desiredStyle: formData.desiredStyle,
          personalityTraits: "Creative and engaging personality",
          background: "Professional AI persona",
          visualPreferences: "High-quality, realistic portrait",
          allowNsfw: formData.allowNsfw
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      const result = await response.json()
      
      if (result.success) {
        setGeneratedPersona({
          ...result.data,
          imagePrompt: result.data.imagePrompt || result.data.image_prompt
        })
      } else {
        console.error('Generation failed:', result.error)
        setGeneratedPersona({
          error: true,
          message: result.error || 'Generation failed'
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setGeneratedPersona({
        error: true,
        message: error instanceof Error && error.name === 'AbortError' 
          ? 'Request timed out (60s). Please try again.' 
          : 'Connection failed. Please check if the server is running.'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadImage = async () => {
    if (!generatedPersona?.imageUrl) return
    
    try {
      // 이미지 다운로드
      const response = await fetch(generatedPersona.imageUrl)
      const blob = await response.blob()
      
      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // 파일명 생성 (타임스탬프 포함)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      link.download = `ai-persona-${timestamp}.png`
      
      // 다운로드 실행
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // URL 해제
      window.URL.revokeObjectURL(url)
      
      // 추가로 localStorage에도 저장 (중복 체크)
      const saveData = {
        timestamp: new Date().toISOString(),
        persona: generatedPersona
      }
      
      const savedPersonas = JSON.parse(localStorage.getItem('savedPersonas') || '[]')
      
      // 중복 체크: 같은 이미지 URL과 프로필 내용이 있는지 확인
      const isDuplicate = savedPersonas.some((item: any) => 
        item.persona?.imageUrl === generatedPersona.imageUrl && 
        item.persona?.profile === generatedPersona.profile
      )
      
      if (!isDuplicate) {
        savedPersonas.push(saveData)
        localStorage.setItem('savedPersonas', JSON.stringify(savedPersonas))
        
        // 상태 업데이트
        setSavedPersonas(savedPersonas)
        console.log('✅ 새로운 페르소나가 저장되었습니다.')
      } else {
        console.log('⚠️ 이미 저장된 페르소나입니다. 중복 저장을 건너뜁니다.')
      }
      
      // 드롭다운 닫기
      setIsDownloadDropdownOpen(false)
      
      // PDF 다운로드 옵션 팝업
      if (confirm('이미지 다운로드가 완료되었습니다. PDF 프로필도 함께 다운로드하시겠습니까?')) {
        await handleDownloadPDFOnly()
      }
      
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }

  const handleDownloadPDF = async () => {
    if (!generatedPersona?.profile) return
    
    try {
      // 한글 텍스트 처리를 위해 마크다운을 일반 텍스트로 변환
      const cleanText = generatedPersona.profile
        .replace(/^#{1,6}\s+/gm, '') // 헤더 제거
        .replace(/\*\*(.*?)\*\*/g, (match, content) => content) // 볼드 제거
        .replace(/\*(.*?)\*/g, (match, content) => content) // 이탈릭 제거
        .replace(/^[-*+]\s+/gm, '• ') // 리스트 아이템
        .replace(/\n{3,}/g, '\n\n') // 과도한 줄바꿈 정리
        .trim()
      
      // HTML을 사용한 PDF 생성 방식으로 변경
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('팝업이 차단되었습니다. 팝업을 허용해주세요.')
      }
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>AI Persona Profile</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
            
            body {
              font-family: 'Noto Sans KR', Arial, sans-serif;
              line-height: 1.6;
              margin: 40px;
              color: #333;
              background: white;
            }
            
            h1 {
              color: #8B5CF6;
              border-bottom: 2px solid #8B5CF6;
              padding-bottom: 10px;
              margin-bottom: 30px;
            }
            
            .content {
              white-space: pre-wrap;
              font-size: 14px;
              line-height: 1.8;
            }
            
            .timestamp {
              text-align: right;
              color: #666;
              font-size: 12px;
              margin-bottom: 20px;
            }
            
            @media print {
              body { margin: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>AI Persona Profile</h1>
          <div class="timestamp">생성일: ${new Date().toLocaleString('ko-KR')}</div>
          <div class="content">${cleanText}</div>
        </body>
        </html>
      `
      
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      // 폰트 로딩 대기
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 1000)
      
      // 드롭다운 닫기
      setIsDownloadDropdownOpen(false)
      
      // 이미지 다운로드 옵션 팝업
      if (confirm('PDF 다운로드가 완료되었습니다. 이미지도 함께 다운로드하시겠습니까?')) {
        await handleDownloadImageOnly()
      }
      
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('PDF generation failed. Please try again.')
    }
  }

  const handleDownloadText = async () => {
    if (!generatedPersona?.profile) return
    
    try {
      // 텍스트 파일 생성
      const blob = new Blob([generatedPersona.profile], { type: 'text/plain;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // 파일명 생성
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      link.download = `ai-persona-profile-${timestamp}.txt`
      
      // 다운로드 실행
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // URL 해제
      window.URL.revokeObjectURL(url)
      
      // 드롭다운 닫기
      setIsDownloadDropdownOpen(false)
      
    } catch (error) {
      console.error('Text download failed:', error)
      alert('Text download failed. Please try again.')
    }
  }

  // 이미지만 다운로드 (크로스 프롬프트 없음 - 저장하지 않음)
  const handleDownloadImageOnly = async () => {
    if (!generatedPersona?.imageUrl) return
    
    try {
      const response = await fetch(generatedPersona.imageUrl)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      link.download = `ai-persona-${timestamp}.png`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)
      
      // 이 함수는 저장하지 않음 (중복 방지)
      
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }

  // PDF만 다운로드 (크로스 프롬프트 없음)
  const handleDownloadPDFOnly = async () => {
    if (!generatedPersona?.profile) return
    
    try {
      // 한글 텍스트 처리를 위해 마크다운을 일반 텍스트로 변환
      const cleanText = generatedPersona.profile
        .replace(/^#{1,6}\s+/gm, '') // 헤더 제거
        .replace(/\*\*(.*?)\*\*/g, (match, content) => content) // 볼드 제거
        .replace(/\*(.*?)\*/g, (match, content) => content) // 이탈릭 제거
        .replace(/^[-*+]\s+/gm, '• ') // 리스트 아이템
        .replace(/\n{3,}/g, '\n\n') // 과도한 줄바꿈 정리
        .trim()
      
      // HTML을 사용한 PDF 생성 방식으로 변경
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('팝업이 차단되었습니다. 팝업을 허용해주세요.')
      }
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>AI Persona Profile</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
            
            body {
              font-family: 'Noto Sans KR', Arial, sans-serif;
              line-height: 1.6;
              margin: 40px;
              color: #333;
              background: white;
            }
            
            h1 {
              color: #8B5CF6;
              border-bottom: 2px solid #8B5CF6;
              padding-bottom: 10px;
              margin-bottom: 30px;
            }
            
            .content {
              white-space: pre-wrap;
              font-size: 14px;
              line-height: 1.8;
            }
            
            .timestamp {
              text-align: right;
              color: #666;
              font-size: 12px;
              margin-bottom: 20px;
            }
            
            @media print {
              body { margin: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>AI Persona Profile</h1>
          <div class="timestamp">생성일: ${new Date().toLocaleString('ko-KR')}</div>
          <div class="content">${cleanText}</div>
        </body>
        </html>
      `
      
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      // 폰트 로딩 대기
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 1000)
      
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('PDF generation failed. Please try again.')
    }
  }

  // 갤러리 모달 열기
  const handleOpenGallery = () => {
    let saved = JSON.parse(localStorage.getItem('savedPersonas') || '[]')
    
    // 중복 제거 로직
    const uniquePersonas = saved.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t: any) => 
        t.persona?.imageUrl === item.persona?.imageUrl && 
        t.persona?.profile === item.persona?.profile
      )
    )
    
    // 중복이 제거된 경우 localStorage 업데이트
    if (uniquePersonas.length !== saved.length) {
      localStorage.setItem('savedPersonas', JSON.stringify(uniquePersonas))
      console.log(`🧹 중복 제거: ${saved.length - uniquePersonas.length}개의 중복 항목이 제거되었습니다.`)
      saved = uniquePersonas
    }
    
    setSavedPersonas(saved)
    setIsGalleryModalOpen(true)
  }

  // 갤러리 모달 닫기
  const handleCloseGallery = () => {
    setIsGalleryModalOpen(false)
    setSelectedPersonaForView(null)
  }

  // 페르소나 상세 보기
  const handleViewPersona = (personaData: any) => {
    setSelectedPersonaForView(personaData)
  }

  // 페르소나 삭제
  const handleDeletePersona = (index: number) => {
    if (confirm('이 페르소나를 삭제하시겠습니까?')) {
      const updatedPersonas = savedPersonas.filter((_, i) => i !== index)
      setSavedPersonas(updatedPersonas)
      localStorage.setItem('savedPersonas', JSON.stringify(updatedPersonas))
      
      // 현재 보고 있는 페르소나가 삭제된 경우 뷰 닫기
      if (selectedPersonaForView && savedPersonas[index] === selectedPersonaForView) {
        setSelectedPersonaForView(null)
      }
    }
  }

  const handleEditImage = () => {
    if (!generatedPersona?.imageUrl) return
    
    // 원본 이미지 URL 저장 (처음 편집하는 경우)
    if (!generatedPersona.originalImageUrl) {
      setGeneratedPersona(prev => ({
        ...prev,
        originalImageUrl: prev?.imageUrl
      }))
    }
    
    // 모달 폼 데이터 초기화
    setEditFormData({
      imagePrompt: generatedPersona.imagePrompt || "",
      fluxModel: generatedPersona.fal_model || "flux-pro-1.1",
      loraModel: "none",
      seed: generatedPersona.seed || ""
    })
    
    setIsEditModalOpen(true)
  }

  const handleSubmitEdit = async () => {
    setIsGenerating(true)
    setIsEditModalOpen(false)
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)
      
      const response = await fetch(`${API_BASE_URL}/regenerate_image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_prompt: editFormData.imagePrompt,
          allow_nsfw_image: formData.allowNsfw,
          fal_model: editFormData.fluxModel,
          lora_model: editFormData.loraModel,
          seed: editFormData.seed || undefined
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      const result = await response.json()
      
      if (result.success) {
        setGeneratedPersona((prev) => ({
          ...prev,
          imageUrl: result.data.imageUrl,
          seed: result.data.seed,
          fal_model: editFormData.fluxModel,
          imagePrompt: editFormData.imagePrompt
        }))
      } else {
        alert('Image regeneration failed: ' + result.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Image regeneration failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleToggleOriginal = () => {
    if (!generatedPersona?.originalImageUrl) return
    
    // 현재와 원본 이미지 URL 교환
    const currentUrl = generatedPersona.imageUrl
    setGeneratedPersona(prev => ({
      ...prev,
      imageUrl: prev?.originalImageUrl,
      originalImageUrl: currentUrl
    }))
  }

  const handleRandomGenerate = async () => {
    // 체크박스 검증
    if (!formData.allowRandomGeneration) {
      alert('Please check "Allow Random Generation" to use random generation feature.')
      return
    }
    
    setIsGenerating(true)
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60초 타임아웃
      
      const response = await fetch(`${API_BASE_URL}/generate_random_persona`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allow_nsfw_image: formData.allowNsfw
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      const result = await response.json()
      
      if (result.success) {
        setGeneratedPersona({
          ...result.data,
          imagePrompt: result.data.imagePrompt || result.data.image_prompt
        })
        // Update form with random params
        setFormData(prev => ({
          ...prev,
          personaType: result.data.random_params?.persona_type || "",
          desiredStyle: result.data.random_params?.desired_style || ""
        }))
      } else {
        setGeneratedPersona({
          error: true,
          message: result.error || 'Random generation failed'
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setGeneratedPersona({
        error: true,
        message: error instanceof Error && error.name === 'AbortError' 
          ? 'Request timed out (60s). Please try again.' 
          : 'Connection failed. Please check if the server is running.'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="persona-generator" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="neon-text">Limitless Control</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create detailed AI personas with full customization. From personality traits 
            to visual characteristics, every aspect is under your control.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8" glow>
              <h3 className="text-2xl font-semibold mb-6">Generate Your Persona</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Persona Type</label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, personaType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose persona type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI 인플루언서">AI Influencer</SelectItem>
                      <SelectItem value="AI 배우">AI Actor</SelectItem>
                      <SelectItem value="AI 가수">AI Singer</SelectItem>
                      <SelectItem value="AI 모델">AI Model</SelectItem>
                      <SelectItem value="AI 버튜버">AI VTuber</SelectItem>
                      <SelectItem value="기타">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Desired Style & Traits</label>
                  <Textarea
                    placeholder="Describe the personality, appearance, background, and unique characteristics you want..."
                    className="min-h-32 resize-none"
                    value={formData.desiredStyle}
                    onChange={(e) => setFormData(prev => ({ ...prev, desiredStyle: e.target.value }))}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="nsfw"
                    checked={formData.allowNsfw}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowNsfw: e.target.checked }))}
                    className="w-4 h-4 accent-purple-500"
                  />
                  <label htmlFor="nsfw" className="text-sm text-gray-300">
                    Allow NSFW content generation
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="randomGen"
                    checked={formData.allowRandomGeneration}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowRandomGeneration: e.target.checked }))}
                    className="w-4 h-4 accent-purple-500"
                  />
                  <label htmlFor="randomGen" className="text-sm text-gray-300">
                    Allow Random Generation
                  </label>
                </div>

                <div className="flex gap-3">
                  <NeonButton 
                    onClick={handleGenerate}
                    disabled={isGenerating || !formData.personaType || !formData.desiredStyle}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Generate Persona"
                    )}
                  </NeonButton>
                  
                  <NeonButton 
                    variant="ghost"
                    onClick={handleRandomGenerate}
                    disabled={isGenerating}
                    title="Random Generation"
                  >
                    <Shuffle className="w-4 h-4" />
                  </NeonButton>

                  <NeonButton 
                    variant="ghost"
                    onClick={handleOpenGallery}
                    disabled={isGenerating}
                    title="View Saved Personas"
                  >
                    <Images className="w-4 h-4" />
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8" glow>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">Generated Persona</h3>
                {generatedPersona && !generatedPersona.error && (
                  <div className="flex gap-2">
                    {/* 다운로드 드롭다운 */}
                    <div className="relative" ref={downloadDropdownRef}>
                      <NeonButton 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
                        title="Download Options"
                        className="flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        <ChevronDown className="w-3 h-3" />
                      </NeonButton>
                      
                      {isDownloadDropdownOpen && (
                        <div className="absolute top-full mt-1 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[180px]">
                          <button
                            onClick={handleDownloadImage}
                            className="w-full px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors first:rounded-t-lg"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>이미지 다운로드</span>
                          </button>
                          <button
                            onClick={handleDownloadPDF}
                            className="w-full px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            <span>PDF 다운로드</span>
                          </button>
                          <button
                            onClick={handleDownloadText}
                            className="w-full px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors last:rounded-b-lg"
                          >
                            <FileText className="w-4 h-4" />
                            <span>텍스트 다운로드</span>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <NeonButton 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditImage()}
                      title="Edit Image"
                    >
                      <Edit className="w-4 h-4" />
                    </NeonButton>
                    {generatedPersona.originalImageUrl && (
                      <NeonButton 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleToggleOriginal()}
                        title="Toggle Original/Edited"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </NeonButton>
                    )}
                  </div>
                )}
              </div>

              {isGenerating ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
                    <p className="text-gray-400">Generating your AI persona...</p>
                  </div>
                </div>
              ) : generatedPersona ? (
                generatedPersona.error ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                      </div>
                      <p className="text-red-400 font-medium mb-2">Generation Failed</p>
                      <p className="text-gray-400 text-sm">{generatedPersona.message}</p>
                    </div>
                  </div>
                ) : (
                <div className="space-y-6">
                  {generatedPersona.imageUrl && (
                    <div className="relative rounded-lg overflow-hidden">
                      <img 
                        src={generatedPersona.imageUrl} 
                        alt="Generated persona" 
                        className="w-full h-96 object-cover"
                      />
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {generatedPersona.fal_model}
                        </Badge>
                        {generatedPersona.seed && (
                          <Badge variant="outline" className="text-xs">
                            Seed: {generatedPersona.seed}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="prose prose-invert max-w-none">
                    <div 
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: generatedPersona.profile
                          ?.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-purple-300 mb-3 mt-4">$1</h1>')
                          ?.replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-purple-400 mb-2 mt-4">$1</h2>')
                          ?.replace(/^### (.+)$/gm, '<h3 class="text-base font-medium text-purple-500 mb-2 mt-3">$1</h3>')
                          ?.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                          ?.replace(/^- (.+)$/gm, '<div class="text-gray-300 mb-1">• $1</div>')
                          ?.replace(/\n\n/g, '<br><br>')
                          ?.replace(/\n/g, '<br>') || '' 
                      }}
                    />
                  </div>
                </div>
                )
              ) : (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <Shuffle className="w-8 h-8 text-purple-400" />
                    </div>
                    <p className="text-gray-400">Your generated persona will appear here</p>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* 편집 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Edit Image</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 이미지 프롬프트 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image Prompt
                </label>
                <Textarea
                  value={editFormData.imagePrompt}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, imagePrompt: e.target.value }))}
                  placeholder="Describe the image you want to generate..."
                  className="min-h-24 resize-none"
                />
              </div>

              {/* Flux 모델 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Flux Model
                </label>
                <Select
                  value={editFormData.fluxModel}
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, fluxModel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flux-pro-1.1">FLUX Pro 1.1 (Highest Quality)</SelectItem>
                    <SelectItem value="flux-dev">FLUX Dev (Faster)</SelectItem>
                    <SelectItem value="flux-schnell">FLUX Schnell (Fastest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* LoRA 모델 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LoRA Model
                </label>
                <Select
                  value={editFormData.loraModel}
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, loraModel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="realistic-portrait">Realistic Portrait</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="anime-style">Anime Style</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 시드값 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Seed (Optional)
                </label>
                <input
                  type="text"
                  value={editFormData.seed}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, seed: e.target.value }))}
                  placeholder="Enter seed number for reproducible results"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 모달 버튼들 */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <NeonButton
                onClick={handleSubmitEdit}
                disabled={!editFormData.imagePrompt.trim()}
                className="flex-1"
              >
                Generate New Image
              </NeonButton>
            </div>
          </motion.div>
        </div>
      )}

      {/* 페르소나 갤러리 모달 */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Images className="w-6 h-6" />
                저장된 페르소나 ({savedPersonas.length})
              </h3>
              <button
                onClick={handleCloseGallery}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex h-[calc(90vh-120px)]">
              {/* 왼쪽: 페르소나 목록 */}
              <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
                {savedPersonas.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <Images className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>저장된 페르소나가 없습니다.</p>
                      <p className="text-sm mt-2">페르소나를 생성하고 다운로드하면 여기에 표시됩니다.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {savedPersonas.map((item, index) => (
                      <div
                        key={index}
                        className={`relative group bg-gray-800 rounded-lg border transition-all duration-200 ${
                          selectedPersonaForView === item 
                            ? 'border-purple-500 bg-purple-500/10' 
                            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-750'
                        }`}
                      >
                        <div className="p-4">
                          {item.persona?.imageUrl && (
                            <div className="aspect-video w-full rounded-lg overflow-hidden mb-3">
                              <img 
                                src={item.persona.imageUrl} 
                                alt="Persona thumbnail"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="text-sm text-gray-400 mb-2">
                            {new Date(item.timestamp).toLocaleString('ko-KR')}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewPersona(item)}
                              className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              보기
                            </button>
                            <button
                              onClick={() => handleDeletePersona(index)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 오른쪽: 페르소나 상세 보기 */}
              <div className="flex-1 overflow-y-auto">
                {selectedPersonaForView ? (
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* 이미지 */}
                      {selectedPersonaForView.persona?.imageUrl && (
                        <div className="relative rounded-lg overflow-hidden">
                          <img 
                            src={selectedPersonaForView.persona.imageUrl} 
                            alt="Generated persona" 
                            className="w-full h-96 object-cover"
                          />
                          <div className="absolute bottom-2 left-2 flex gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {selectedPersonaForView.persona.fal_model}
                            </Badge>
                            {selectedPersonaForView.persona.seed && (
                              <Badge variant="outline" className="text-xs">
                                Seed: {selectedPersonaForView.persona.seed}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* 프로필 내용 */}
                      <div className="prose prose-invert max-w-none">
                        <div 
                          className="text-sm leading-relaxed whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ 
                            __html: selectedPersonaForView.persona?.profile
                              ?.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-purple-300 mb-3 mt-4">$1</h1>')
                              ?.replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-purple-400 mb-2 mt-4">$2</h2>')
                              ?.replace(/^### (.+)$/gm, '<h3 class="text-base font-medium text-purple-500 mb-2 mt-3">$3</h3>')
                              ?.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                              ?.replace(/^- (.+)$/gm, '<div class="text-gray-300 mb-1">• $1</div>')
                              ?.replace(/\n\n/g, '<br><br>')
                              ?.replace(/\n/g, '<br>') || '' 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>페르소나를 선택하여 상세 내용을 확인하세요.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}