"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Copy, Play, Code2 } from "lucide-react"

const codeExample = `// Next.js API Route
export async function POST(request: Request) {
  const { personaType, desiredStyle } = await request.json()
  
  const persona = await generatePersona({
    type: personaType,
    style: desiredStyle,
    model: "gpt-4o-mini",
    imageModel: "flux-pro"
  })
  
  return Response.json({ 
    success: true, 
    data: persona 
  })
}`

const pythonExample = `# Flask Backend
@app.route('/generate_persona', methods=['POST'])
def generate_persona():
    data = request.get_json()
    
    # OpenAI API call
    persona_result = generate_persona_profile_with_openai(
        data['persona_type'], 
        data['desired_style'], 
        data['output_detail_level']
    )
    
    # Fal.ai image generation
    image_result = generate_persona_image_with_fal(
        persona_result['image_prompt'],
        data['allow_nsfw_image']
    )
    
    return jsonify({
        'success': True,
        'data': {
            'profile': persona_result['profile'],
            'imageUrl': image_result['image_url']
        }
    })`

export function CodeDemoSection() {
  const [activeTab, setActiveTab] = useState<"frontend" | "backend">("frontend")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab === "frontend" ? codeExample : pythonExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for <span className="neon-text">Developers</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Modern architecture with Next.js frontend and Flask backend. 
            Clean APIs, TypeScript support, and production-ready code.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8" glow>
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <NeonButton
                  variant={activeTab === "frontend" ? "neon" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("frontend")}
                >
                  <Code2 className="w-4 h-4" />
                  Frontend
                </NeonButton>
                <NeonButton
                  variant={activeTab === "backend" ? "neon" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("backend")}
                >
                  <Play className="w-4 h-4" />
                  Backend
                </NeonButton>
              </div>
              
              <NeonButton variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy"}
              </NeonButton>
            </div>

            <div className="relative">
              <pre className="bg-black/50 rounded-lg p-6 overflow-x-auto">
                <code className="text-sm text-gray-300 font-mono">
                  {activeTab === "frontend" ? codeExample : pythonExample}
                </code>
              </pre>
              
              {/* Syntax highlighting overlay */}
              <div className="absolute top-6 left-6 right-6 bottom-6 pointer-events-none">
                <div className="text-sm font-mono space-y-1">
                  {/* This would be enhanced with a proper syntax highlighter */}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Next.js 15</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Flask</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>OpenAI API</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Code2 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Modern Stack</h3>
            <p className="text-sm text-gray-400">Next.js 15, TypeScript, Tailwind CSS</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Production Ready</h3>
            <p className="text-sm text-gray-400">Deployed on Vercel with auto-scaling</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Copy className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Open Source</h3>
            <p className="text-sm text-gray-400">MIT license, community-driven</p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}