"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "../ui/glass-card"
import { NeonButton } from "../ui/neon-button"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Loader2, Shuffle, Download, Edit, X, RotateCcw, ChevronDown, FileText, Image as ImageIcon, Images, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react"

export function PersonaGeneratorSection() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPersona, setGeneratedPersona] = useState<{
    error?: boolean;
    message?: string;
    data?: Record<string, unknown>;
    imageUrl?: string;
    seed?: string;
    fal_model?: string;
    model_used?: string;
    profile?: string;
    imagePrompt?: string;
    originalImageUrl?: string;
    imageHistory?: string[]; // 이미지 갤러리를 위한 히스토리
    success?: boolean;
    processing_time_ms?: number;
    imageError?: any;
  } | null>(null)
  const [formData, setFormData] = useState({
    personaType: "",
    desiredStyle: "",
    allowNsfw: false,
    allowRandomGeneration: false,
    fluxModel: "Persona-v.01" // Persona-v.01 모델 고정
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    imagePrompt: "",
    fluxModel: "Persona-v.01",
    loraModel: "none",
    loraModel2: "",
    loraModel3: "",
    seed: "",
    generateNewFace: false,
    lockSeed: false
  })
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false)
  const downloadDropdownRef = useRef<HTMLDivElement>(null)
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)
  const [savedPersonas, setSavedPersonas] = useState<any[]>([])
  const [selectedPersonaForView, setSelectedPersonaForView] = useState<any>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false)

  // API 기본 URL (Vercel Serverless Functions)
  const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'

  // 페르소나 이름 추출 함수 (개선된 버전)
  const extractPersonaName = (profile: string): string => {
    if (!profile) return "Unknown Persona"
    
    // 다양한 패턴으로 이름 추출 시도 (성+이름 형태 지원)
    const patterns = [
      /^##?\s*페르소나\s*이름:\s*([가-힣a-zA-Z\s]{1,30})\s*\(/m,  // "## 페르소나 이름: 김하늘별 (Kim Haneul)"
      /^##?\s*이름:\s*([가-힣a-zA-Z\s]{1,30})\s*\(/m,           // "## 이름: 박수민아 (Park Sumina)"
      /^##?\s*페르소나\s*이름:\s*([가-힣a-zA-Z\s]{1,30})$/m,     // "## 페르소나 이름: 이예은이"
      /^##?\s*이름:\s*([가-힣a-zA-Z\s]{1,30})$/m,              // "## 이름: 정소망이"
      /페르소나\s*이름:\s*([가-힣a-zA-Z\s]{1,30})\s*\(/,        // "페르소나 이름: 윤하늘 (Yoon Haneul)"
      /이름:\s*([가-힣a-zA-Z\s]{1,30})\s*\(/,                  // "이름: 조지우 (Jo Jiwoo)"
      /이름:\s*([가-힣a-zA-Z\s]{1,30})$/m,                     // "이름: 한은서"
      /^##?\s*([가-힣a-zA-Z\s]{3,30})\s*\(/m,                  // "## 김하늘별 (Kim Haneul)"
      /^##?\s*([가-힣a-zA-Z\s]{3,30})$/m,                      // "## 박수민아"
    ]
    
    for (const pattern of patterns) {
      const match = profile.match(pattern)
      if (match && match[1]) {
        const extractedName = match[1].trim()
        // 이름 유효성 검증 (한국어 또는 영어 이름 패턴)
        if (validateNamePattern(extractedName)) {
          return extractedName
        }
      }
    }
    
    // 패턴 매칭 실패 시 첫 번째 줄에서 이름 추출 시도
    const firstLine = profile.split('\n')[0]
    if (firstLine && firstLine.length < 50) {
      const cleanedLine = firstLine.replace(/^#+\s*/, '').trim()
      if (validateNamePattern(cleanedLine)) {
        return cleanedLine
      }
    }
    
    return "Unknown Persona"
  }

  // 이름 패턴 유효성 검증 함수 (성+이름 형태 지원)
  const validateNamePattern = (name: string): boolean => {
    if (!name || name.length < 2 || name.length > 30) return false
    
    // 한국어 성+이름 패턴 (2-8글자: 성1글자+이름1-7글자, 최소 3글자 권장)
    const koreanFullNamePattern = /^[가-힣]{2,8}$/
    
    // 영어 성+이름 패턴 (First Last 또는 Last First 형태)
    const englishFullNamePattern = /^[a-zA-Z]+\s+[a-zA-Z]+$/
    
    // 특수 문자나 숫자가 포함된 경우 제외
    const invalidChars = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    
    if (invalidChars.test(name)) return false
    
    return koreanFullNamePattern.test(name) || englishFullNamePattern.test(name)
  }

  // 이름 품질 검증 시스템
  const validateNameQuality = (name: string): { isValid: boolean; score: number; issues: string[] } => {
    const validation = {
      isValid: true,
      score: 100,
      issues: [] as string[]
    }
    
    // 기본 패턴 검증
    if (!validateNamePattern(name)) {
      validation.isValid = false
      validation.score = 0
      validation.issues.push('이름이 유효하지 않은 패턴입니다')
      return validation
    }
    
    // 길이 검증 (성+이름 형태 강화)
    if (name.length < 3) {
      validation.score -= 40
      validation.issues.push('성+이름 형태가 필요합니다 (최소 3글자)')
    } else if (name.length === 2) {
      validation.score -= 50
      validation.issues.push('2글자 이름은 성씨가 없습니다. 성+이름 형태로 생성해주세요')
    }
    
    // 한국어 성+이름 특별 검증
    if (/^[가-힣]+$/.test(name)) {
      // 일반적인 한국 성씨 확인 (성+이름 형태 강화)
      const koreanSurnames = ['김', '이', '박', '최', '정', '한', '윤', '조', '장', '임', '오', '강', '송', '유', '홍', '전', '고', '문', '신', '남', '백', '서', '허', '안', '노', '하', '배', '황', '차', '주']
      const firstChar = name.charAt(0)
      
      if (koreanSurnames.includes(firstChar)) {
        validation.score += 15  // 한국 성씨가 있으면 큰 보너스
        if (name.length >= 3) {
          validation.score += 10  // 성+이름(2글자 이상) 형태면 추가 보너스
        }
      } else {
        validation.score -= 20  // 한국 성씨가 없으면 감점
        validation.issues.push('한국 성씨로 시작하지 않습니다')
      }
      
      // 3-6글자 한국어 성+이름 보너스
      if (name.length >= 3 && name.length <= 6) {
        validation.score += 5
      }
      
      // 특별히 매력적인 이름 패턴 보너스
      const attractivePatterns = [
        /별$/, /하늘/, /미래/, /희망/, /사랑/, /빛/, /달/, /꽃/, /아름/, /소망/
      ]
      
      if (attractivePatterns.some(pattern => pattern.test(name))) {
        validation.score += 5
      }
    }
    
    // 영어 성+이름 특별 검증
    if (/^[a-zA-Z\s]+$/.test(name)) {
      // 공백으로 구분된 성+이름 형태 확인 (강화)
      const nameParts = name.split(' ').filter(part => part.length > 0)
      if (nameParts.length === 2) {
        validation.score += 15  // 성+이름 형태면 큰 보너스
        if (nameParts[0].length >= 2 && nameParts[1].length >= 2) {
          validation.score += 5  // 각 부분이 충분히 길면 추가 보너스
        }
      } else if (nameParts.length === 1) {
        validation.score -= 20  // 단일 이름이면 감점
        validation.issues.push('영어는 성+이름 형태가 필요합니다 (예: Kim Soyeon)')
      } else if (nameParts.length > 2) {
        validation.score -= 10  // 너무 많은 부분이면 약간 감점
        validation.issues.push('영어 이름은 성+이름 2부분이 선호됩니다')
      }
      
      // 독특하고 매력적인 영어 이름 보너스
      const uniqueEnglishNames = [
        'Aria', 'Luna', 'Stella', 'Zara', 'Nova', 'Kai', 'Sage', 'Rowan', 'Grace', 'Elena', 'Clara'
      ]
      
      if (uniqueEnglishNames.some(uniqueName => 
        name.toLowerCase().includes(uniqueName.toLowerCase())
      )) {
        validation.score += 10
      }
    }
    
    // 최종 점수 범위 조정
    validation.score = Math.max(0, Math.min(100, validation.score))
    validation.isValid = validation.score >= 70
    
    return validation
  }

  // 이름 생성 개선 제안 (성+이름 형태 강화)
  const suggestNameImprovement = (name: string, personaType: string): string[] => {
    const suggestions: string[] = []
    
    if (name.length === 2) {
      suggestions.push('성씨를 포함한 성+이름 형태가 필요합니다 (예: 김소연, 박지우)')
    }
    
    if (name.length < 3) {
      suggestions.push('최소 3글자 이상의 성+이름 형태로 생성해주세요')
    }
    
    // 한국어 이름에 성씨가 없는 경우
    if (/^[가-힣]+$/.test(name) && name.length >= 2) {
      const koreanSurnames = ['김', '이', '박', '최', '정', '한', '윤', '조', '장', '임', '오', '강', '송', '유', '홍', '전', '고', '문', '신', '남']
      const firstChar = name.charAt(0)
      if (!koreanSurnames.includes(firstChar)) {
        suggestions.push('한국 성씨로 시작하는 이름이 필요합니다 (예: 김하늘, 이수민)')
      }
    }
    
    // 영어 이름에 공백이 없는 경우
    if (/^[a-zA-Z]+$/.test(name) && !name.includes(' ')) {
      suggestions.push('영어는 성+이름 형태가 필요합니다 (예: Kim Soyeon, Park Luna)')
    }
    
    // 페르소나 타입별 성+이름 형태 제안
    switch (personaType) {
      case 'AI 인플루언서':
        suggestions.push('트렌디하고 모던한 성+이름 (예: 김하늘, 박지우, Kim Luna, Lee Aria)')
        break
      case '배우':
        suggestions.push('클래식하고 기억하기 쉬운 성+이름 (예: 최수민, 한은서, Park Stella)')
        break
      case '가수':
        suggestions.push('예술적이고 매력적인 성+이름 (예: 윤하늘별, 조소망이, Jung Nova)')
        break
      case '버튜버':
        suggestions.push('귀엽고 친근한 성+이름 (예: 임예은이, 오달이, Han Sage)')
        break
      case '모델':
        suggestions.push('세련되고 국제적인 성+이름 (예: 강아름, 유미래, Kim Zara)')
        break
      case '크리에이터':
        suggestions.push('창의적이고 개성 있는 성+이름 (예: 송소망, 전빛나, Lee Rowan)')
        break
      default:
        suggestions.push('개성 있고 매력적인 성+이름 형태로 생성해주세요')
    }
    
    return suggestions
  }

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

  // 컴포넌트 언마운트 시 메모리 누수 방지는 각 함수에서 개별적으로 처리

  // 이미지 갤러리 관련 함수들
  const openImageGallery = (imageUrl: string, imageHistory?: string[]) => {
    const allImages = imageHistory && imageHistory.length > 0 ? imageHistory : [imageUrl]
    setSelectedImageUrl(imageUrl)
    setCurrentImageIndex(allImages.indexOf(imageUrl))
    setIsImageGalleryOpen(true)
  }

  const closeImageGallery = () => {
    setIsImageGalleryOpen(false)
    setCurrentImageIndex(0)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    const currentImages = getCurrentImageList()
    if (currentImages.length <= 1) return
    
    let newIndex = currentImageIndex
    
    if (direction === 'prev') {
      newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentImages.length - 1
    } else {
      newIndex = currentImageIndex < currentImages.length - 1 ? currentImageIndex + 1 : 0
    }
    
    setCurrentImageIndex(newIndex)
    setSelectedImageUrl(currentImages[newIndex])
  }

  const getCurrentImageList = () => {
    if (generatedPersona?.imageHistory && generatedPersona.imageHistory.length > 0) {
      return generatedPersona.imageHistory
    }
    return generatedPersona?.imageUrl ? [generatedPersona.imageUrl] : []
  }

  // Auto-save feature - automatically save persona when generation is complete
  useEffect(() => {
    if (generatedPersona && !generatedPersona.error && generatedPersona.profile) {
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
        setSavedPersonas(savedPersonas)
        console.log('🔄 Persona automatically saved to gallery.')
      }
    }
  }, [generatedPersona])

  const handleGenerate = async () => {
    if (!formData.personaType || !formData.desiredStyle) return
    
    setIsGenerating(true)
    // 이전 결과를 유지하면서 로딩 표시
    // setGeneratedPersona(null) 제거하여 이전 결과 유지
    
    let controller: AbortController | null = null
    let timeoutId: NodeJS.Timeout | null = null
    
    try {
      controller = new AbortController()
      
      // 더 긴 타임아웃 설정 (5분)
      timeoutId = setTimeout(() => {
        if (controller && !controller.signal.aborted) {
          console.log('⏰ Timeout reached, aborting request...')
          controller.abort()
        }
      }, 300000) // 5분
      
      console.log('🚀 Starting persona generation...')
      
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
          allowNsfw: formData.allowNsfw,
          fluxModel: formData.fluxModel
        }),
        signal: controller.signal
      })
      
      // 타임아웃 클리어
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('🔍 API Response:', result)
      
      if (result.success) {
        console.log('✅ Generation successful, setting persona data')
        console.log('📄 Profile:', result.profile ? 'Present' : 'Missing')
        console.log('🖼️ Image URL:', result.imageUrl ? 'Present' : 'Missing')
        setGeneratedPersona({
          ...result,
          imagePrompt: result.imagePrompt || result.image_prompt,
          imageHistory: result.imageUrl ? [result.imageUrl] : [] // 초기 이미지로 히스토리 시작
        })
      } else {
        console.error('❌ Generation failed:', result.error)
        setGeneratedPersona({
          error: true,
          message: result.error || 'Generation failed'
        })
      }
    } catch (error) {
      console.error('❌ Generation error:', error)
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🔄 Request was aborted')
        setGeneratedPersona({
          error: true,
          message: '요청이 시간 초과되었습니다 (5분). 서버가 처리 중일 수 있습니다. 잠시 후 다시 시도해주세요.'
        })
      } else {
        setGeneratedPersona({
          error: true,
          message: error instanceof Error ? error.message : 'Network error occurred'
        })
      }
    } finally {
      // 정리 작업
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
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
        console.log('✅ New persona saved to gallery.')
      } else {
        console.log('⚠️ Persona already saved. Skipping duplicate save.')
      }
      
      // 드롭다운 닫기
      setIsDownloadDropdownOpen(false)
      
      // PDF 다운로드 옵션 팝업
      try {
        if (confirm('이미지 다운로드가 완료되었습니다. PDF 프로필도 함께 다운로드하시겠습니까?')) {
          await handleDownloadPDFOnly()
        }
      } catch (pdfError) {
        console.error('PDF 다운로드 중 오류:', pdfError)
        alert('PDF 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.')
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
      
      // 윈도우 로딩 대기
      await new Promise(resolve => setTimeout(resolve, 100))
      
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
      
      // 윈도우 로딩 대기
      await new Promise(resolve => setTimeout(resolve, 100))
      
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

  // 이미지 모달 열기
  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl)
    setIsImageModalOpen(true)
  }

  // 이미지 모달 닫기
  const handleCloseImageModal = () => {
    setIsImageModalOpen(false)
    setSelectedImageUrl("")
  }

  // 저장된 페르소나 다운로드 함수들
  const handleDownloadSavedPersona = (persona: any, index: number) => {
    if (!persona?.imageUrl) return
    
    // 이미지 다운로드 후 PDF 다운로드 옵션 팝업
    handleDownloadSavedPersonaImage(persona).then(() => {
      if (persona.profile && confirm('이미지 다운로드가 완료되었습니다. PDF 프로필도 함께 다운로드하시겠습니까?')) {
        handleDownloadSavedPersonaPDF(persona)
      }
    })
  }

  const handleDownloadSavedPersonaImage = async (persona: any) => {
    if (!persona?.imageUrl) return
    
    try {
      const response = await fetch(persona.imageUrl)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const personaName = extractPersonaName(persona.profile || '')
      link.download = `${personaName}-${timestamp}.png`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Saved persona image download failed:', error)
      alert('이미지 다운로드에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleDownloadSavedPersonaPDF = async (persona: any) => {
    if (!persona?.profile) return
    
    try {
      const cleanText = persona.profile
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*\*(.*?)\*\*/g, (match: string, content: string) => content)
        .replace(/\*(.*?)\*/g, (match: string, content: string) => content)
        .replace(/^[-*+]\s+/gm, '• ')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
      
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('팝업이 차단되었습니다. 팝업을 허용해주세요.')
      }
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const personaName = extractPersonaName(persona.profile || '')
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${personaName} - AI Persona Profile</title>
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
            
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${personaName} - AI Persona Profile</h1>
          <div class="content">${cleanText}</div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
        </html>
      `
      
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
    } catch (error) {
      console.error('Saved persona PDF generation failed:', error)
      alert('PDF 생성에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleDownloadSavedPersonaText = async (persona: any) => {
    if (!persona?.profile) return
    
    try {
      const blob = new Blob([persona.profile], { type: 'text/plain;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const personaName = extractPersonaName(persona.profile || '')
      link.download = `${personaName}-profile-${timestamp}.txt`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Saved persona text download failed:', error)
      alert('텍스트 다운로드에 실패했습니다. 다시 시도해주세요.')
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
      loraModel2: "",
      loraModel3: "",
      seed: generatedPersona.seed || "",
      generateNewFace: false,
      lockSeed: false
    })
    
    setIsEditModalOpen(true)
  }

  const handleSubmitEdit = async () => {
    setIsGenerating(true)
    setIsEditModalOpen(false)
    
    let controller: AbortController | null = null
    let timeoutId: NodeJS.Timeout | null = null
    
    try {
      controller = new AbortController()
      
      // 이미지 재생성 타임아웃 (3분)
      timeoutId = setTimeout(() => {
        if (controller && !controller.signal.aborted) {
          console.log('⏰ Image regeneration timeout reached, aborting...')
          controller.abort()
        }
      }, 180000) // 3분
      
      console.log('🎨 Starting image regeneration...')
      
      // 이미지만 재생성하는 API 호출 (올바른 파라미터 사용)
      const response = await fetch(`${API_BASE_URL}/api/generate-complete-persona`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // 기존 페르소나 정보는 유지하고 이미지만 재생성
          personaType: formData.personaType,
          desiredStyle: formData.desiredStyle,
          personalityTraits: "기존 페르소나 유지",
          background: "기존 페르소나 유지", 
          visualPreferences: formData.desiredStyle,
          allowNsfw: formData.allowNsfw,
          fluxModel: editFormData.fluxModel,
          // 커스텀 이미지 프롬프트 사용
          customImagePrompt: editFormData.imagePrompt,
          // 수동 LoRA 선택 추가
          manualLoraSelection: editFormData.loraModel !== "none" ? {
            lora1: editFormData.loraModel,
            lora2: editFormData.loraModel2 || null,
            lora3: editFormData.loraModel3 || null
          } : null,
          // 커스텀 시드 추가
          customSeed: editFormData.seed ? parseInt(editFormData.seed) : null,
          // 새로운 얼굴 생성 플래그 추가
          generateNewFace: editFormData.generateNewFace,
          // 시드 락 플래그 추가
          lockSeed: editFormData.lockSeed,
          imageOnly: true // 이미지만 재생성 플래그
        }),
        signal: controller.signal
      })
      
      // 타임아웃 클리어
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.imageUrl) {
        setGeneratedPersona((prev) => {
          if (!prev) return null
          const currentHistory = prev.imageHistory || []
          return {
            ...prev,
            imageUrl: result.imageUrl,
            imagePrompt: editFormData.imagePrompt,
            model_used: result.model_used || editFormData.fluxModel,
            imageHistory: [...currentHistory, result.imageUrl] // 새 이미지를 히스토리에 추가
          }
        })
        
        console.log('✅ Image regeneration successful')
      } else {
        console.error('❌ Image regeneration failed:', result)
        alert('이미지 재생성에 실패했습니다: ' + (result.imageError?.message || result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('❌ Image regeneration error:', error)
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🔄 Image regeneration was aborted')
        alert('이미지 생성 시간이 초과되었습니다 (3분). 다시 시도해주세요.')
      } else {
        alert('이미지 재생성에 실패했습니다: ' + (error instanceof Error ? error.message : 'Network error'))
      }
    } finally {
      // 정리 작업
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
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
    setGeneratedPersona(null)
    
    let controller: AbortController | null = null
    let timeoutId: NodeJS.Timeout | null = null
    
    try {
      controller = new AbortController()
      
      // 랜덤 생성 타임아웃 (5분)
      timeoutId = setTimeout(() => {
        if (controller && !controller.signal.aborted) {
          console.log('⏰ Random generation timeout reached, aborting...')
          controller.abort()
        }
      }, 300000) // 5분
      
      console.log('🎲 Starting random persona generation...')
      
      // 랜덤 페르소나 타입 선택
      const personaTypes = ["AI influencer", "actress", "singer", "VTuber", "model", "content creator", "professional"]
      const styles = ["Modern and trendy", "Classic and elegant", "Cute and friendly", "Sophisticated and chic", "Natural and comfortable", "Glamorous and dramatic"]
      
      const randomPersonaType = personaTypes[Math.floor(Math.random() * personaTypes.length)]
      const randomStyle = styles[Math.floor(Math.random() * styles.length)]
      
      const response = await fetch(`${API_BASE_URL}/api/generate-complete-persona`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personaType: randomPersonaType,
          desiredStyle: randomStyle,
          personalityTraits: "Creative and engaging personality",
          background: "Diverse and interesting background",
          visualPreferences: "High-quality portrait photography",
          allowNsfw: formData.allowNsfw,
          allowRandomGeneration: true
        }),
        signal: controller.signal
      })
      
      // 타임아웃 클리어
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setGeneratedPersona({
          ...result,
          imagePrompt: result.imagePrompt || result.image_prompt,
          imageHistory: result.imageUrl ? [result.imageUrl] : [] // 초기 이미지로 히스토리 시작
        })
        // Update form with random params (for random generation)
        if (result.random_params) {
          setFormData(prev => ({
            ...prev,
            personaType: result.random_params?.persona_type || "",
            desiredStyle: result.random_params?.desired_style || ""
          }))
        }
      } else {
        setGeneratedPersona({
          error: true,
          message: result.error || 'Random generation failed'
        })
      }
    } catch (error) {
      console.error('❌ Random generation error:', error)
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🔄 Random generation was aborted')
        setGeneratedPersona({
          error: true,
          message: '랜덤 생성 시간이 초과되었습니다 (5분). 다시 시도해주세요.'
        })
      } else {
        setGeneratedPersona({
          error: true,
          message: error instanceof Error ? error.message : 'Network error occurred'
        })
      }
    } finally {
      // 정리 작업
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
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
            to visual, The persona's prompt may cause an error. It's a space that's not complete yet.
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
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, personaType: value, allowRandomGeneration: false }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose persona type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI influencer">AI Influencer</SelectItem>
                      <SelectItem value="actress">AI Actor</SelectItem>
                      <SelectItem value="singer">AI Singer</SelectItem>
                      <SelectItem value="model">AI Model</SelectItem>
                      <SelectItem value="VTuber">AI VTuber</SelectItem>
                      <SelectItem value="professional">Other</SelectItem>
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

                {/* Persona-v.01 모델 고정으로 모델 선택 UI 제거 */}
                <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-green-400">Enable Persona-v.01 Model</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Create a Persona with AI</p>
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
                    <p className="text-gray-400">Generating your AI persona...1~3 minutes! The persona's prompt may cause an error. It's a space that's not complete yet</p>
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
                    <div className="relative rounded-lg overflow-hidden group">
                      <img 
                        src={generatedPersona.imageUrl} 
                        alt="Generated persona" 
                        className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => generatedPersona.imageUrl && openImageGallery(generatedPersona.imageUrl, generatedPersona.imageHistory)}
                        onLoad={() => console.log('🖼️ Image loaded successfully')}
                        onError={() => console.error('❌ Image failed to load')}
                      />
                      
                      {/* 이미지 네비게이션 버튼 */}
                      {getCurrentImageList().length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const images = getCurrentImageList()
                              const currentIndex = generatedPersona.imageUrl ? images.indexOf(generatedPersona.imageUrl) : 0
                              const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
                              setGeneratedPersona(prev => prev ? {...prev, imageUrl: images[prevIndex]} : null)
                            }}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const images = getCurrentImageList()
                              const currentIndex = generatedPersona.imageUrl ? images.indexOf(generatedPersona.imageUrl) : 0
                              const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
                              setGeneratedPersona(prev => prev ? {...prev, imageUrl: images[nextIndex]} : null)
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          
                          {/* 이미지 카운터 */}
                          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {getCurrentImageList().indexOf(generatedPersona.imageUrl) + 1} / {getCurrentImageList().length}
                          </div>
                        </>
                      )}
                      
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {generatedPersona.model_used || generatedPersona.fal_model || 'FLUX.1-dev'}
                        </Badge>
                        {generatedPersona.seed && (
                          <Badge variant="outline" className="text-xs">
                            Seed: {generatedPersona.seed}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {generatedPersona.profile && (
                    <div className="prose prose-invert max-w-none">
                      <div 
                        className="text-sm leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ 
                          __html: generatedPersona.profile
                            ?.replace(/^# (.+)$/gm, (match, p1) => `<h1 class="text-xl font-bold text-purple-300 mb-3 mt-4">${p1}</h1>`)
                            ?.replace(/^## (.+)$/gm, (match, p1) => `<h2 class="text-lg font-semibold text-purple-400 mb-2 mt-4">${p1}</h2>`)
                            ?.replace(/^### (.+)$/gm, (match, p1) => `<h3 class="text-base font-medium text-purple-500 mb-2 mt-3">${p1}</h3>`)
                            ?.replace(/\*\*(.+?)\*\*/g, (match, p1) => `<strong class="text-white font-semibold">${p1}</strong>`)
                            ?.replace(/^- (.+)$/gm, (match, p1) => `<div class="text-gray-300 mb-1">• ${p1}</div>`)
                            ?.replace(/\n\n/g, '<br><br>')
                            ?.replace(/\n/g, '<br>') || '' 
                        }}
                      />
                    </div>
                  )}
                  
                  {/* 디버그 정보 */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-400">
                      <div>Image URL: {generatedPersona.imageUrl ? '✅ Present' : '❌ Missing'}</div>
                      <div>Profile: {generatedPersona.profile ? '✅ Present' : '❌ Missing'}</div>
                      <div>Success: {generatedPersona.success ? '✅ True' : '❌ False'}</div>
                      <div>Model: {generatedPersona.model_used || 'Unknown'}</div>
                      <div>Processing Time: {generatedPersona.processing_time_ms ? `${Math.round(generatedPersona.processing_time_ms / 1000)}s` : 'Unknown'}</div>
                      {generatedPersona.imageError && (
                        <div className="text-red-400">Image Error: {generatedPersona.imageError.message}</div>
                      )}
                    </div>
                  )}
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
              {/* Persona-v.01 모델 고정으로 모델 선택 UI 제거 */}
              <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium text-green-400">Persona-v.01 모델</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">실사 특화 최적화 모델 사용 중</p>
              </div>

              {/* LoRA 모델 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LoRA Model 1
                </label>
                <Select
                  value={editFormData.loraModel}
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, loraModel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">AI 자동 선택</SelectItem>
                    <SelectItem value="korean-beauty">Korean Beauty Enhancement</SelectItem>
                    <SelectItem value="realistic-korean">Realistic Korean Face</SelectItem>
                    <SelectItem value="soft-features">Soft Korean Features</SelectItem>
                    <SelectItem value="idol-lora">K-Pop Idol Style</SelectItem>
                    <SelectItem value="fashion-model">Fashion Model Style</SelectItem>
                    <SelectItem value="influencer-beauty">Influencer Beauty</SelectItem>
                    <SelectItem value="luxury-beauty">Luxury Beauty</SelectItem>
                    <SelectItem value="celebrity-aura">Celebrity Aura</SelectItem>
                    <SelectItem value="professional-makeup">Professional Makeup</SelectItem>
                    <SelectItem value="editorial-fashion">Editorial Fashion</SelectItem>
                    <SelectItem value="actress-beauty">Actress Beauty</SelectItem>
                    <SelectItem value="glamour-model">Glamour Model</SelectItem>
                    <SelectItem value="commercial-beauty">Commercial Beauty</SelectItem>
                    <SelectItem value="vintage-elegance">Vintage Elegance</SelectItem>
                    <SelectItem value="street-chic">Street Chic</SelectItem>
                    <SelectItem value="artistic-portrait">Artistic Portrait</SelectItem>
                    <SelectItem value="ethereal-beauty">Ethereal Beauty</SelectItem>
                    <SelectItem value="fierce-confidence">Fierce Confidence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* LoRA 모델 2 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LoRA Model 2 (Optional)
                </label>
                <Select
                  value={editFormData.loraModel2 || "none"}
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, loraModel2: value === "none" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">선택 안함</SelectItem>
                    <SelectItem value="korean-beauty">Korean Beauty Enhancement</SelectItem>
                    <SelectItem value="realistic-korean">Realistic Korean Face</SelectItem>
                    <SelectItem value="soft-features">Soft Korean Features</SelectItem>
                    <SelectItem value="idol-lora">K-Pop Idol Style</SelectItem>
                    <SelectItem value="fashion-model">Fashion Model Style</SelectItem>
                    <SelectItem value="influencer-beauty">Influencer Beauty</SelectItem>
                    <SelectItem value="luxury-beauty">Luxury Beauty</SelectItem>
                    <SelectItem value="celebrity-aura">Celebrity Aura</SelectItem>
                    <SelectItem value="professional-makeup">Professional Makeup</SelectItem>
                    <SelectItem value="editorial-fashion">Editorial Fashion</SelectItem>
                    <SelectItem value="actress-beauty">Actress Beauty</SelectItem>
                    <SelectItem value="glamour-model">Glamour Model</SelectItem>
                    <SelectItem value="commercial-beauty">Commercial Beauty</SelectItem>
                    <SelectItem value="vintage-elegance">Vintage Elegance</SelectItem>
                    <SelectItem value="street-chic">Street Chic</SelectItem>
                    <SelectItem value="artistic-portrait">Artistic Portrait</SelectItem>
                    <SelectItem value="ethereal-beauty">Ethereal Beauty</SelectItem>
                    <SelectItem value="fierce-confidence">Fierce Confidence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* LoRA 모델 3 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LoRA Model 3 (Optional)
                </label>
                <Select
                  value={editFormData.loraModel3 || "none"}
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, loraModel3: value === "none" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">선택 안함</SelectItem>
                    <SelectItem value="korean-beauty">Korean Beauty Enhancement</SelectItem>
                    <SelectItem value="realistic-korean">Realistic Korean Face</SelectItem>
                    <SelectItem value="soft-features">Soft Korean Features</SelectItem>
                    <SelectItem value="idol-lora">K-Pop Idol Style</SelectItem>
                    <SelectItem value="fashion-model">Fashion Model Style</SelectItem>
                    <SelectItem value="influencer-beauty">Influencer Beauty</SelectItem>
                    <SelectItem value="luxury-beauty">Luxury Beauty</SelectItem>
                    <SelectItem value="celebrity-aura">Celebrity Aura</SelectItem>
                    <SelectItem value="professional-makeup">Professional Makeup</SelectItem>
                    <SelectItem value="editorial-fashion">Editorial Fashion</SelectItem>
                    <SelectItem value="actress-beauty">Actress Beauty</SelectItem>
                    <SelectItem value="glamour-model">Glamour Model</SelectItem>
                    <SelectItem value="commercial-beauty">Commercial Beauty</SelectItem>
                    <SelectItem value="vintage-elegance">Vintage Elegance</SelectItem>
                    <SelectItem value="street-chic">Street Chic</SelectItem>
                    <SelectItem value="artistic-portrait">Artistic Portrait</SelectItem>
                    <SelectItem value="ethereal-beauty">Ethereal Beauty</SelectItem>
                    <SelectItem value="fierce-confidence">Fierce Confidence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 다른 얼굴로 변경 토글 */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    다른 얼굴로 변경
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    활성화하면 완전히 새로운 얼굴이 생성됩니다 (시드 락 자동 해제)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditFormData(prev => ({ 
                    ...prev, 
                    generateNewFace: !prev.generateNewFace,
                    // 새로운 얼굴 생성 활성화 시 시드 락 자동 해제
                    lockSeed: !prev.generateNewFace ? false : prev.lockSeed
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    editFormData.generateNewFace ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editFormData.generateNewFace ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 시드값 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Seed (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">시드 락 {editFormData.generateNewFace ? '(비활성화됨)' : ''}</span>
                    <button
                      type="button"
                      onClick={() => setEditFormData(prev => ({ 
                        ...prev, 
                        lockSeed: !prev.lockSeed,
                        // 시드 락 활성화 시 새로운 얼굴 생성 자동 해제
                        generateNewFace: !prev.lockSeed ? false : prev.generateNewFace
                      }))}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        editFormData.lockSeed ? 'bg-green-600' : 'bg-gray-600'
                      }`}
                      disabled={editFormData.generateNewFace}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          editFormData.lockSeed ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editFormData.seed}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, seed: e.target.value }))}
                    placeholder={editFormData.generateNewFace ? "새 시드가 자동 생성됩니다" : editFormData.lockSeed ? "현재 시드가 고정됩니다" : "Enter seed number for reproducible results"}
                    disabled={editFormData.generateNewFace || editFormData.lockSeed}
                    className={`flex-1 px-3 py-2 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      editFormData.generateNewFace || editFormData.lockSeed ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-800'
                    }`}
                  />
                  {!editFormData.generateNewFace && !editFormData.lockSeed && (
                    <button
                      type="button"
                      onClick={() => setEditFormData(prev => ({ ...prev, seed: Math.floor(Math.random() * 1000000).toString() }))}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      랜덤
                    </button>
                  )}
                </div>
                {editFormData.generateNewFace && (
                  <p className="text-xs text-purple-400 mt-1">
                    🔄 새로운 얼굴 생성 모드: 시드 락을 무시하고 완전히 새로운 시드가 생성됩니다
                  </p>
                )}
                {editFormData.lockSeed && !editFormData.generateNewFace && (
                  <p className="text-xs text-green-400 mt-1">
                    🔒 시드 락 모드: 현재 시드가 고정되어 동일한 기본 구조가 유지됩니다
                  </p>
                )}
                {!editFormData.generateNewFace && !editFormData.lockSeed && (
                  <p className="text-xs text-blue-400 mt-1">
                    🎲 자유 모드: 시드를 수동으로 입력하거나 랜덤 생성할 수 있습니다
                  </p>
                )}
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
                          
                          <div className="text-sm font-medium text-white mb-1">
                            {extractPersonaName(item.persona?.profile || "")}
                          </div>
                          
                          <div className="text-xs text-gray-400 mb-2">
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
                              onClick={() => handleDownloadSavedPersona(item.persona, index)}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                            >
                              <Download className="w-4 h-4" />
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
                        <div className="relative rounded-lg overflow-hidden group">
                          <img 
                            src={selectedPersonaForView.persona.imageUrl} 
                            alt="Generated persona" 
                            className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => openImageGallery(selectedPersonaForView.persona.imageUrl, selectedPersonaForView.persona.imageHistory)}
                          />
                          
                          {/* 저장된 페르소나의 이미지 네비게이션 (이미지 히스토리가 있는 경우) */}
                          {selectedPersonaForView.persona.imageHistory && selectedPersonaForView.persona.imageHistory.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const images = selectedPersonaForView.persona.imageHistory
                                  const currentIndex = images.indexOf(selectedPersonaForView.persona.imageUrl)
                                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
                                  setSelectedPersonaForView((prev: any) => prev ? ({
                                    ...prev,
                                    persona: { ...prev.persona, imageUrl: images[prevIndex] }
                                  }) : null)
                                }}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const images = selectedPersonaForView.persona.imageHistory
                                  const currentIndex = images.indexOf(selectedPersonaForView.persona.imageUrl)
                                  const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
                                  setSelectedPersonaForView((prev: any) => prev ? ({
                                    ...prev,
                                    persona: { ...prev.persona, imageUrl: images[nextIndex] }
                                  }) : null)
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                              
                              {/* 이미지 카운터 */}
                              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                                {selectedPersonaForView.persona.imageHistory.indexOf(selectedPersonaForView.persona.imageUrl) + 1} / {selectedPersonaForView.persona.imageHistory.length}
                              </div>
                            </>
                          )}
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
                      
                      {/* 다운로드 버튼들 */}
                      <div className="flex items-center gap-2 mb-4">
                        <button
                          onClick={() => handleDownloadSavedPersonaImage(selectedPersonaForView.persona)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <ImageIcon className="w-4 h-4" />
                          이미지 다운로드
                        </button>
                        <button
                          onClick={() => handleDownloadSavedPersonaPDF(selectedPersonaForView.persona)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          PDF 다운로드
                        </button>
                        <button
                          onClick={() => handleDownloadSavedPersonaText(selectedPersonaForView.persona)}
                          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          텍스트 다운로드
                        </button>
                      </div>
                      
                      {/* 프로필 내용 */}
                      <div className="prose prose-invert max-w-none">
                        <div 
                          className="text-sm leading-relaxed whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ 
                            __html: selectedPersonaForView.persona?.profile
                              ?.replace(/^# (.+)$/gm, (match: string, p1: string) => `<h1 class="text-xl font-bold text-purple-300 mb-3 mt-4">${p1}</h1>`)
                              ?.replace(/^## (.+)$/gm, (match: string, p1: string) => `<h2 class="text-lg font-semibold text-purple-400 mb-2 mt-4">${p1}</h2>`)
                              ?.replace(/^### (.+)$/gm, (match: string, p1: string) => `<h3 class="text-base font-medium text-purple-500 mb-2 mt-3">${p1}</h3>`)
                              ?.replace(/\*\*(.+?)\*\*/g, (match: string, p1: string) => `<strong class="text-white font-semibold">${p1}</strong>`)
                              ?.replace(/^- (.+)$/gm, (match: string, p1: string) => `<div class="text-gray-300 mb-1">• ${p1}</div>`)
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

      {/* 이미지 갤러리 모달 */}
      {isImageGalleryOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeImageGallery}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImageUrl} 
              alt="Gallery image" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            
            {/* 네비게이션 버튼 */}
            {getCurrentImageList().length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* 이미지 카운터 */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded text-sm">
                  {currentImageIndex + 1} / {getCurrentImageList().length}
                </div>
              </>
            )}
            
            {/* 닫기 버튼 */}
            <button
              onClick={closeImageGallery}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-700 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}

      {/* 이미지 확대 모달 */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleCloseImageModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImageUrl} 
              alt="Enlarged persona" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={handleCloseImageModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-700 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </section>
  )
}