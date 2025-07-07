"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shuffle, Download, Share } from "lucide-react"

export function PersonaGeneratorSection() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPersona, setGeneratedPersona] = useState<any>(null)
  const [formData, setFormData] = useState({
    personaType: "",
    desiredStyle: "",
    allowNsfw: false
  })

  // API 기본 URL (환경에 따라 자동 설정)
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || 'https://ai-persona-generator-production.railway.app'
    : 'http://localhost:5000'

  const handleGenerate = async () => {
    if (!formData.personaType || !formData.desiredStyle) return
    
    setIsGenerating(true)
    
    try {
      // API call to our Flask backend
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60초 타임아웃
      
      const response = await fetch(`${API_BASE_URL}/generate_persona`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          persona_type: formData.personaType,
          desired_style: formData.desiredStyle,
          output_detail_level: "상세",
          allow_nsfw_image: formData.allowNsfw,
          fal_model: "flux-pro",
          lora_model: "none"
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      const result = await response.json()
      
      if (result.success) {
        setGeneratedPersona(result.data)
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
        message: error.name === 'AbortError' 
          ? 'Request timed out (60s). Please try again.' 
          : 'Connection failed. Please check if the server is running.'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRandomGenerate = async () => {
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
        setGeneratedPersona(result.data)
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
        message: error.name === 'AbortError' 
          ? 'Request timed out (60s). Please try again.' 
          : 'Connection failed. Please check if the server is running.'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="py-20 px-4 relative">
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
                    className="w-4 h-4"
                  />
                  <label htmlFor="nsfw" className="text-sm text-gray-300">
                    Allow NSFW content generation
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
                  >
                    <Shuffle className="w-4 h-4" />
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
                {generatedPersona && (
                  <div className="flex gap-2">
                    <NeonButton variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </NeonButton>
                    <NeonButton variant="ghost" size="sm">
                      <Share className="w-4 h-4" />
                    </NeonButton>
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
                        className="w-full h-64 object-cover"
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
    </section>
  )
}