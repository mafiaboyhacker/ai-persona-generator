"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ZoomIn, User, Sparkles, Bot, FileText, Image } from "lucide-react"

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
  
  // 클라이언트 전용 상태 관리
  const [isClient, setIsClient] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({
    width: 1200,
    height: 800
  })
  const [imageLoading, setImageLoading] = useState(false)
  
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
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
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
          <div ref={containerRef} className="relative min-h-[600px] mb-16">
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
                <linearGradient id="connectionGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="connectionGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              
              {/* User to Agent 연결선 */}
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
              
              {/* Agent to Result 연결선 */}
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
              
              
            </svg>

            {/* 플로우 카드들 */}
            <div className="relative" style={{ zIndex: 2 }}>
              {/* User 카드 - 드래그 가능 */}
              <motion.div
                ref={userNodeRef}
                className="absolute cursor-move"
                style={{ 
                  top: nodePositions.user.y, 
                  left: nodePositions.user.x 
                }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                drag
                dragMomentum={false}
                dragElastic={0.1}
                onDrag={(event, info) => {
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
                whileDrag={{ scale: 1.05, zIndex: 1000 }}
              >
                <div className="bg-gray-800 rounded-2xl p-6 w-80 border border-gray-700">
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
                className="absolute cursor-move"
                style={{ 
                  top: nodePositions.agent.y, 
                  left: `calc(50% - 192px + ${nodePositions.agent.x}px)` 
                }}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                drag
                dragMomentum={false}
                dragElastic={0.1}
                onDrag={(event, info) => {
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
                whileDrag={{ scale: 1.05, zIndex: 1000 }}
              >
                <div className="bg-gray-900 rounded-2xl p-6 w-96 border border-purple-500/50 shadow-2xl shadow-purple-500/20">
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
                className="absolute cursor-move"
                style={{ 
                  top: nodePositions.result.y, 
                  right: `${32 - nodePositions.result.x}px` 
                }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                drag
                dragMomentum={false}
                dragElastic={0.1}
                onDrag={(event, info) => {
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
                whileDrag={{ scale: 1.05, zIndex: 1000 }}
              >
                <div className="bg-gray-800 rounded-2xl p-6 w-96 border border-green-500/50 shadow-2xl shadow-green-500/20">
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

          {/* AI 페르소나 영상 쇼케이스 */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
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
    </>
  )
}