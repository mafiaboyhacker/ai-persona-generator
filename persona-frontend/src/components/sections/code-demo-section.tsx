"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ZoomIn, User, Sparkles, Bot, FileText, Image, ToggleLeft, ToggleRight } from "lucide-react"

export function CodeDemoSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videoSources] = useState([
    '/videos/bella_lipsync.mp4',
    '/videos/cinematic_closeup.mp4',
    '/videos/lala.mp4'
  ])
  
  // 360도 뷰어 시스템
  const [viewer360Pairs] = useState([
    { id: '360_1', image: '/gallery/360_1.png', video: '/videos/360_1.mp4' },
    { id: '360_2', image: '/gallery/360_2.png', video: '/videos/360_2.mp4' }
    // 추후 더 많은 페어 추가 가능
  ])
  const [selectedPair, setSelectedPair] = useState('360_1')
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [modalSelectedPair, setModalSelectedPair] = useState('360_1')
  const [current360Index, setCurrent360Index] = useState(0)
  
  // 클라이언트 전용 상태 관리
  const [isClient, setIsClient] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({
    width: 1200,
    height: 800
  })
  const [imageLoading, setImageLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // 노드 위치 상태 관리
  const [nodePositions, setNodePositions] = useState({
    user: { x: 32, y: 32 },
    agent: { x: 0, y: 0 },
    result: { x: 32, y: -80 }
  })
  
  // DOM 참조 시스템
  const userNodeRef = useRef<HTMLDivElement>(null)
  const agentNodeRef = useRef<HTMLDivElement>(null)
  const resultNodeRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 실제 DOM 위치 상태
  const [realNodePositions, setRealNodePositions] = useState({
    user: { left: 0, top: 0, right: 0, bottom: 0 },
    agent: { left: 0, top: 0, right: 0, bottom: 0 },
    result: { left: 0, top: 0, right: 0, bottom: 0 }
  })
  
  // 연결선 동적 계산
  const calculateConnectionPath = (start: {x: number, y: number}, end: {x: number, y: number}, curvature = 80) => {
    const midX = (start.x + end.x) / 2
    const midY = Math.min(start.y, end.y) - curvature
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
  }

  // 실제 DOM 위치 측정 함수
  const measureNodePositions = useCallback(() => {
    if (!containerRef.current || !isClient) return
    
    const containerRect = containerRef.current.getBoundingClientRect()
    const newPositions = {
      user: { left: 0, top: 0, right: 0, bottom: 0 },
      agent: { left: 0, top: 0, right: 0, bottom: 0 },
      result: { left: 0, top: 0, right: 0, bottom: 0 }
    }
    
    // User 노드 측정
    if (userNodeRef.current) {
      const rect = userNodeRef.current.getBoundingClientRect()
      newPositions.user = {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
        right: rect.right - containerRect.left,
        bottom: rect.bottom - containerRect.top
      }
    }
    
    // Agent 노드 측정
    if (agentNodeRef.current) {
      const rect = agentNodeRef.current.getBoundingClientRect()
      newPositions.agent = {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
        right: rect.right - containerRect.left,
        bottom: rect.bottom - containerRect.top
      }
    }
    
    // Result 노드 측정
    if (resultNodeRef.current) {
      const rect = resultNodeRef.current.getBoundingClientRect()
      newPositions.result = {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
        right: rect.right - containerRect.left,
        bottom: rect.bottom - containerRect.top
      }
    }
    
    setRealNodePositions(newPositions)
  }, [isClient])

  // 노드 연결점 계산 (실제 DOM 위치 기반)
  const getNodeConnectionPoint = (nodeType: 'user' | 'agent' | 'result', side: 'left' | 'right') => {
    const pos = realNodePositions[nodeType]
    const centerY = pos.top + (pos.bottom - pos.top) / 2
    
    switch (side) {
      case 'left':
        return { x: pos.left, y: centerY }
      case 'right':
        return { x: pos.right, y: centerY }
      default:
        return { x: 0, y: 0 }
    }
  }

  // 클라이언트 전용 초기화
  useEffect(() => {
    setIsClient(true)
    const updateWindowDimensions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setWindowDimensions({ width, height })
      setIsMobile(width < 768)
    }
    
    updateWindowDimensions()
    window.addEventListener('resize', updateWindowDimensions)
    
    return () => window.removeEventListener('resize', updateWindowDimensions)
  }, [])

  // 실시간 위치 추적 시스템
  useEffect(() => {
    if (!isClient) return
    
    // 초기 위치 측정
    measureNodePositions()
    
    // ResizeObserver로 노드 크기/위치 변화 감지
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(measureNodePositions)
    })
    
    // 모든 노드 관찰 시작
    if (userNodeRef.current) resizeObserver.observe(userNodeRef.current)
    if (agentNodeRef.current) resizeObserver.observe(agentNodeRef.current)
    if (resultNodeRef.current) resizeObserver.observe(resultNodeRef.current)
    if (containerRef.current) resizeObserver.observe(containerRef.current)
    
    return () => {
      resizeObserver.disconnect()
    }
  }, [isClient])

  // 드래그 중 위치 업데이트는 onDrag 이벤트에서 직접 처리

  // 갤러리 PNG 파일들을 빠르게 로드
  useEffect(() => {
    const loadGalleryImages = async () => {
      // 갤러리 폴더에 있는 실제 PNG 파일들 (확인된 파일들)
      const knownImages = [
        '/gallery/persona_01.png',
        '/gallery/persona_02.png', 
        '/gallery/persona_03.png',
        '/gallery/persona_04.png',
        '/gallery/persona_05.png',
        '/gallery/persona_06.png',
        '/gallery/persona_07.jpg',
        '/gallery/persona_08.jpg'
      ]
      
      // 빠른 병렬 확인 (HEAD 요청 없이 바로 사용)
      setGalleryImages(knownImages)
      console.log('Loaded gallery images:', knownImages.length)
      
      // 첫 번째 이미지 미리 로드
      if (knownImages.length > 0 && typeof window !== 'undefined') {
        const preloadImg = document.createElement('img')
        preloadImg.src = knownImages[0]
      }
    }

    loadGalleryImages()
  }, [])

  const nextImage = useCallback(() => {
    if (galleryImages.length === 0) return
    const newIndex = (currentImageIndex + 1) % galleryImages.length
    console.log('Next image:', newIndex, 'Total:', galleryImages.length)
    setCurrentImageIndex(newIndex)
    // 모달이 열려있으면 selectedImage도 업데이트
    if (isModalOpen && galleryImages[newIndex]) {
      setSelectedImage(galleryImages[newIndex])
    }
  }, [galleryImages, currentImageIndex, isModalOpen])

  const prevImage = useCallback(() => {
    if (galleryImages.length === 0) return
    const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length
    console.log('Prev image:', newIndex, 'Total:', galleryImages.length)
    setCurrentImageIndex(newIndex)
    // 모달이 열려있으면 selectedImage도 업데이트
    if (isModalOpen && galleryImages[newIndex]) {
      setSelectedImage(galleryImages[newIndex])
    }
  }, [galleryImages, currentImageIndex, isModalOpen])

  // 자동 이미지 변경
  useEffect(() => {
    if (galleryImages.length === 0) return
    
    const imageInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % galleryImages.length)
    }, 4000)
    
    return () => clearInterval(imageInterval)
  }, [galleryImages.length])

  // 자동 비디오 변경 (순차적 - 영상별 다른 시간)
  useEffect(() => {
    if (videoSources.length === 0) return
    
    const scheduleNextVideo = () => {
      const currentDuration = currentVideoIndex === 2 ? 4000 : 8000 // 3번 영상(index 2)은 4초, 나머지는 8초
      
      setTimeout(() => {
        setCurrentVideoIndex(prev => (prev + 1) % videoSources.length)
      }, currentDuration)
    }
    
    scheduleNextVideo()
  }, [currentVideoIndex, videoSources.length])

  // 360도 영상 자동 순환 (6초마다)
  useEffect(() => {
    if (viewer360Pairs.length === 0) return
    
    const interval = setInterval(() => {
      setCurrent360Index(prev => {
        const nextIndex = (prev + 1) % viewer360Pairs.length
        const nextPair = viewer360Pairs[nextIndex]
        setSelectedPair(nextPair.id)
        console.log(`Auto switching to 360 pair: ${nextPair.id}`)
        return nextIndex
      })
    }, 6000) // 6초마다 전환
    
    return () => clearInterval(interval)
  }, [viewer360Pairs.length])

  const openModal = () => {
    if (galleryImages[currentImageIndex]) {
      setSelectedImage(galleryImages[currentImageIndex])
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage("")
  }

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModalOpen) {
        if (event.key === 'Escape') {
          closeModal()
        } else if (event.key === 'ArrowLeft') {
          prevImage()
        } else if (event.key === 'ArrowRight') {
          nextImage()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, galleryImages.length, nextImage, prevImage])

  // currentImageIndex가 변경될 때 모달의 selectedImage 동기화
  useEffect(() => {
    if (isModalOpen && galleryImages[currentImageIndex]) {
      setSelectedImage(galleryImages[currentImageIndex])
    }
  }, [currentImageIndex, isModalOpen, galleryImages])

  return (
    <>
      <section id="code-demo" className="py-20 px-4 relative overflow-hidden bg-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* 제목 섹션 */}
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              AI Personas at your service
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl">
              Run a single or fleet of AI persona generators with access to all your creative tools
            </p>
          </div>

          {/* 메인 플로우 영역 */}
          <div ref={containerRef} className={`relative mb-16 ${isMobile ? 'min-h-[1400px]' : 'min-h-[600px]'}`}>
            {!isClient && (
              <div className="flex items-center justify-center min-h-[600px]">
                <div className="text-white text-lg">Loading interactive demo...</div>
              </div>
            )}
            {isClient && (
            <>
            {/* SVG 연결선들 - 동적 업데이트 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="connectionGradient1" x1="0%" y1="0%" x2={isMobile ? "0%" : "100%"} y2={isMobile ? "100%" : "0%"}>
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="connectionGradient2" x1="0%" y1="0%" x2={isMobile ? "0%" : "100%"} y2={isMobile ? "100%" : "0%"}>
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              
              {!isMobile && (
                <>
                  {/* User to Agent 연결선 - 데스크톱만 */}
                  <motion.path
                    animate={{
                      d: calculateConnectionPath(
                        getNodeConnectionPoint('user', 'right'),
                        getNodeConnectionPoint('agent', 'left')
                      )
                    }}
                    stroke="url(#connectionGradient1)"
                    strokeWidth="2"
                    fill="none"
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="drop-shadow-lg"
                  />
                  
                  {/* Agent to Result 연결선 - 데스크톱만 */}
                  <motion.path
                    animate={{
                      d: calculateConnectionPath(
                        getNodeConnectionPoint('agent', 'right'),
                        getNodeConnectionPoint('result', 'left')
                      )
                    }}
                    stroke="url(#connectionGradient2)"
                    strokeWidth="2"
                    fill="none"
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="drop-shadow-lg"
                  />
                </>
              )}
              
              {isMobile && (
                <>
                  {/* 모바일 수직 연결선 1: User to Agent */}
                  <motion.line
                    x1={windowDimensions.width / 2}
                    y1="200"
                    x2={windowDimensions.width / 2}
                    y2="280"
                    stroke="url(#connectionGradient1)"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                    strokeDasharray="8,4"
                    initial={{ strokeDashoffset: 100, opacity: 0 }}
                    animate={{ strokeDashoffset: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                  
                  {/* 모바일 화살표 1 */}
                  <motion.polygon
                    points={`${windowDimensions.width / 2 - 6},270 ${windowDimensions.width / 2 + 6},270 ${windowDimensions.width / 2},285`}
                    fill="#3B82F6"
                    className="drop-shadow-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  />
                  
                  {/* 모바일 수직 연결선 2: Agent to Result */}
                  <motion.line
                    x1={windowDimensions.width / 2}
                    y1="640"
                    x2={windowDimensions.width / 2}
                    y2="720"
                    stroke="url(#connectionGradient2)"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                    strokeDasharray="8,4"
                    initial={{ strokeDashoffset: 100, opacity: 0 }}
                    animate={{ strokeDashoffset: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 1.4 }}
                  />
                  
                  {/* 모바일 화살표 2 */}
                  <motion.polygon
                    points={`${windowDimensions.width / 2 - 6},710 ${windowDimensions.width / 2 + 6},710 ${windowDimensions.width / 2},725`}
                    fill="#10B981"
                    className="drop-shadow-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                  />
                </>
              )}
            </svg>

            {/* 플로우 카드들 */}
            <div className="relative" style={{ zIndex: 2 }}>
              {/* User 카드 - 드래그 가능 */}
              <motion.div
                ref={userNodeRef}
                className={isMobile ? "absolute" : "absolute cursor-move"}
                style={isMobile ? { 
                  top: 16, 
                  left: 16,
                  width: 'calc(100vw - 32px)',
                  maxWidth: '320px'
                } : { 
                  top: nodePositions.user.y, 
                  left: nodePositions.user.x 
                }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                drag={!isMobile}
                dragMomentum={false}
                dragElastic={0.1}
                onDrag={isMobile ? undefined : (event, info) => {
                  setNodePositions(prev => ({
                    ...prev,
                    user: {
                      x: Math.max(0, Math.min(windowDimensions.width - 320, prev.user.x + info.delta.x)),
                      y: Math.max(0, Math.min(windowDimensions.height - 200, prev.user.y + info.delta.y))
                    }
                  }))
                  // 드래그 중 실시간 위치 업데이트
                  requestAnimationFrame(measureNodePositions)
                }}
                whileDrag={isMobile ? {} : { scale: 1.05, zIndex: 1000 }}
              >
                <div className={`bg-gray-800 rounded-2xl p-6 border border-gray-700 ${isMobile ? 'w-full' : 'w-80'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold">User</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Create a detailed AI persona with unique personality traits, visual characteristics, and background story for my creative project.
                  </p>
                </div>
              </motion.div>

              {/* AI Agent 카드 - 드래그 가능 */}
              <motion.div
                ref={agentNodeRef}
                className={isMobile ? "absolute" : "absolute cursor-move"}
                style={isMobile ? { 
                  top: 280, 
                  left: 16,
                  width: 'calc(100vw - 32px)',
                  maxWidth: '384px'
                } : { 
                  top: nodePositions.agent.y, 
                  left: `calc(50% - 192px + ${nodePositions.agent.x}px)` 
                }}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                drag={!isMobile}
                dragMomentum={false}
                dragElastic={0.1}
                onDrag={isMobile ? undefined : (event, info) => {
                  setNodePositions(prev => ({
                    ...prev,
                    agent: {
                      x: Math.max(-384, Math.min(384, prev.agent.x + info.delta.x)),
                      y: Math.max(-50, Math.min(windowDimensions.height - 300, prev.agent.y + info.delta.y))
                    }
                  }))
                  // 드래그 중 실시간 위치 업데이트
                  requestAnimationFrame(measureNodePositions)
                }}
                whileDrag={isMobile ? {} : { scale: 1.05, zIndex: 1000 }}
              >
                <div className={`bg-gray-900 rounded-2xl p-6 border border-purple-500/50 shadow-2xl shadow-purple-500/20 ${isMobile ? 'w-full' : 'w-96'}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-semibold text-lg">AI Agent</span>
                      <div className="text-purple-400 text-sm">Processing...</div>
                    </div>
                  </div>

                  {/* Prompt 섹션 */}
                  <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-600/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-gray-300 text-sm font-medium">Prompt</span>
                    </div>
                    <p className="text-gray-400 text-xs">Generate unique AI persona with personality and visuals</p>
                  </div>

                  {/* Model 섹션 */}
                  <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-gray-300 text-sm font-medium">Model</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500/20 px-2 py-1 rounded text-xs text-green-400 font-medium">Persona-LLM</div>
                        <div className="bg-blue-500/20 px-2 py-1 rounded text-xs text-blue-400 font-medium">Persona-v.01</div>
                      </div>
                    </div>
                  </div>

                  {/* Tools 섹션 */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-600/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-gray-300 text-sm font-medium">Tools</span>
                      <span className="text-gray-500 text-xs">2 active</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3 text-purple-400" />
                        <span className="text-gray-400 text-xs">Text Generation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image className="w-3 h-3 text-purple-400" />
                        <span className="text-gray-400 text-xs">Image Synthesis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Generated Result 카드 - 드래그 가능 */}
              <motion.div
                ref={resultNodeRef}
                className={isMobile ? "absolute" : "absolute cursor-move"}
                style={isMobile ? { 
                  top: 720, 
                  left: 16,
                  width: 'calc(100vw - 32px)',
                  maxWidth: '384px'
                } : { 
                  top: nodePositions.result.y, 
                  right: `${32 - nodePositions.result.x}px` 
                }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                drag={!isMobile}
                dragMomentum={false}
                dragElastic={0.1}
                onDrag={isMobile ? undefined : (event, info) => {
                  setNodePositions(prev => ({
                    ...prev,
                    result: {
                      x: Math.max(-384, Math.min(384, prev.result.x - info.delta.x)),
                      y: Math.max(0, Math.min(windowDimensions.height - 250, prev.result.y + info.delta.y))
                    }
                  }))
                  // 드래그 중 실시간 위치 업데이트
                  requestAnimationFrame(measureNodePositions)
                }}
                whileDrag={isMobile ? {} : { scale: 1.05, zIndex: 1000 }}
              >
                <div className={`bg-gray-800 rounded-2xl p-6 border border-green-500/50 shadow-2xl shadow-green-500/20 ${isMobile ? 'w-full' : 'w-96'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-semibold">Generated Result</span>
                      <div className="text-green-400 text-sm">Complete</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-600/50">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      AI persona offers scalable, on-demand character creation, reducing creative costs and speeding up development in areas like storytelling and digital media.
                    </p>
                  </div>

                  {/* 미니 갤러리 */}
                  <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-900 border border-gray-600">
                    {galleryImages.length > 0 ? (
                      <motion.img
                        key={currentImageIndex}
                        src={galleryImages[currentImageIndex]}
                        alt={`AI Persona ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={openModal}
                        onLoad={() => setImageLoading(false)}
                        onLoadStart={() => setImageLoading(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-500 text-sm">Loading gallery...</div>
                      </div>
                    )}
                    
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                        <div className="text-white text-sm">Loading...</div>
                      </div>
                    )}
                    
                    {/* 줌 아이콘 */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={openModal}
                        className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      >
                        <ZoomIn className="w-3 h-3" />
                      </button>
                    </div>
                    
                    {/* 네비게이션 */}
                    <button
                      onClick={prevImage}
                      className="absolute left-1 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-500">
                      {galleryImages.length > 0 ? `${currentImageIndex + 1} of ${galleryImages.length}` : 'Loading...'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            </>
            )}
          </div>

          {/* 360도 페르소나 뷰어 */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Persona-v.01 AI Training
              </h3>
              <p className="text-gray-400 max-w-3xl mx-auto">
                After generating personas, train images with Persona-v.01 AI to bring personas to life and create realistic implementations
              </p>
            </div>

            <div className="max-w-7xl mx-auto">
              <div className={`relative ${isMobile ? 'flex flex-col items-center gap-8' : 'flex items-center justify-center gap-12'}`}>
                {/* 왼쪽: 썸네일 그리드 */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white text-center">Generated Personas</h4>
                  <div className={`grid gap-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {viewer360Pairs.map((pair) => (
                      <motion.div
                        key={pair.id}
                        className={`relative ${isMobile ? 'w-32 h-32' : 'w-48 h-48'} rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                          selectedPair === pair.id 
                            ? 'border-purple-500 ring-4 ring-purple-500/40 shadow-2xl shadow-purple-500/30' 
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        onClick={() => {
                          console.log(`Selecting pair: ${pair.id}, video: ${pair.video}`)
                          setSelectedPair(pair.id)
                          setModalSelectedPair(pair.id)
                          setShowVideoModal(true)
                        }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={pair.image}
                          alt={`Persona ${pair.id}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 화살표 연결선 */}
                {!isMobile && (
                  <div className="flex items-center">
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 1 }}
                    >
                      <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                      <div className="w-0 h-0 border-l-8 border-l-blue-500 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-green-500"></div>
                    </motion.div>
                  </div>
                )}

                {/* 모바일 화살표 */}
                {isMobile && (
                  <div className="flex justify-center">
                    <motion.div
                      className="flex flex-col items-center gap-2"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1 }}
                    >
                      <div className="h-8 w-0.5 bg-gradient-to-b from-purple-500 to-blue-500"></div>
                      <div className="w-0 h-0 border-t-8 border-t-blue-500 border-l-4 border-l-transparent border-r-4 border-r-transparent"></div>
                      <div className="h-8 w-0.5 bg-gradient-to-b from-blue-500 to-green-500"></div>
                    </motion.div>
                  </div>
                )}

                {/* 오른쪽: 360도 비디오 플레이어 */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white text-center">Persona-v.01 Training</h4>
                  <div 
                    className={`relative ${isMobile ? 'w-80 h-60' : 'w-96 h-72'} rounded-2xl overflow-hidden bg-gray-900 border border-gray-600 shadow-2xl cursor-pointer`}
                    onClick={() => {
                      setModalSelectedPair(selectedPair)
                      setShowVideoModal(true)
                    }}
                  >
                    {selectedPair && (
                      <video
                        key={`video-${selectedPair}`}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-contain"
                        style={{ transform: 'translateY(-4.3%)' }}
                        src={viewer360Pairs.find(p => p.id === selectedPair)?.video}
                        onLoadStart={() => console.log(`Loading video for ${selectedPair}:`, viewer360Pairs.find(p => p.id === selectedPair)?.video)}
                      />
                    )}
                  </div>
                  
                  {/* 비디오 오버레이 - 비디오 아래로 이동 (더 투명하게) */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <div className="font-semibold text-sm">
                          {selectedPair ? `Persona ${selectedPair}` : 'Select a persona'}
                        </div>
                        <div className="text-xs text-gray-300">
                          AI Training in Progress
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-xs">AUTO</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI 페르소나 영상 쇼케이스 */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Meet Our AI Personas
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Experience lifelike AI personas with realistic expressions, voice synthesis, and cinematic quality
            </p>
            
            <div className="max-w-6xl mx-auto">
              <motion.div
                key={currentVideoIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-gray-700"
              >
                <video
                  key={videoSources[currentVideoIndex]}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-auto min-h-[50vh] max-h-[80vh] object-cover"
                  style={{ backgroundColor: '#1f2937' }}
                  onLoadStart={() => console.log('Video loading:', videoSources[currentVideoIndex])}
                  onLoadedData={() => console.log('Video loaded:', videoSources[currentVideoIndex])}
                >
                  <source src={videoSources[currentVideoIndex]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* 비디오 오버레이 정보 */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <div className="font-semibold text-sm">
                          {currentVideoIndex === 0 
                            ? 'Bella Lee - AI Persona' 
                            : currentVideoIndex === 1 
                            ? 'Cinematic AI Portrait' 
                            : 'Lala - AI Character'}
                        </div>
                        <div className="text-xs text-gray-300">
                          {currentVideoIndex === 0 
                            ? 'LipSync TTS with Realistic Voice' 
                            : currentVideoIndex === 1 
                            ? 'High-Quality Visual Generation' 
                            : 'Advanced AI Animation'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {currentVideoIndex + 1} / {videoSources.length}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 자동 변경 인디케이터 */}
                <div className="absolute top-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-xs">Auto</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* 비디오 네비게이션 도트 */}
              <div className="flex justify-center gap-2 mt-6">
                {videoSources.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentVideoIndex === index
                        ? 'bg-purple-500 scale-125'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 이미지 모달 팝업 */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Full size persona"
                className="w-full h-full object-contain"
              />
              
              {/* 닫기 버튼 */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/90 transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>

              {/* 모달 내 네비게이션 - 이미지가 여러 개일 때만 표시 */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/90 transition-colors backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/90 transition-colors backdrop-blur-sm"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </>
              )}

              {/* 모달 하단 정보 */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <div className="bg-black/70 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <p className="text-white text-sm">
                    {currentImageIndex + 1} of {galleryImages.length}
                  </p>
                  <p className="text-gray-300 text-xs mt-1">
                    Use arrow keys or click buttons to navigate
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 360도 비디오 팝업 모달 */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden"
              style={{ transform: 'translateY(-3vh)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>

              {/* 왼쪽 화살표 버튼 */}
              <button
                onClick={() => setModalSelectedPair(modalSelectedPair === '360_1' ? '360_2' : '360_1')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* 오른쪽 화살표 버튼 */}
              <button
                onClick={() => setModalSelectedPair(modalSelectedPair === '360_1' ? '360_2' : '360_1')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>


              {/* 비디오 플레이어 */}
              <div className="relative aspect-video bg-black">
                {modalSelectedPair && (
                  <video
                    key={`modal-video-${modalSelectedPair}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                    style={{ transform: 'translateY(-15%)' }}
                    src={viewer360Pairs.find(p => p.id === modalSelectedPair)?.video}
                  />
                )}
                
                {/* 투명 오버레이 - 하단 (더 투명하게) */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                    <div className="flex items-center justify-between gap-6">
                      <div className="text-white text-center">
                        <div className="font-semibold text-sm">
                          Persona {modalSelectedPair}
                        </div>
                        <div className="text-xs text-gray-300">
                          AI Training in Progress
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-xs">AUTO</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}