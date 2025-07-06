"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Zap, 
  Palette, 
  Download, 
  Share2, 
  Settings,
  Sparkles,
  Image as ImageIcon,
  FileText
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Advanced AI Models",
    description: "Powered by GPT-4 and FLUX 1.1 Pro for the highest quality persona generation",
    tags: ["OpenAI", "Fal.ai", "GPT-4"],
    color: "purple"
  },
  {
    icon: Zap,
    title: "Lightning Performance",
    description: "Generate detailed personas with images in under 30 seconds",
    tags: ["Fast", "Optimized", "Cached"],
    color: "yellow"
  },
  {
    icon: Palette,
    title: "Unlimited Customization",
    description: "Control every aspect from personality traits to visual characteristics",
    tags: ["Flexible", "Custom", "Detailed"],
    color: "teal"
  },
  {
    icon: ImageIcon,
    title: "Stunning Visuals",
    description: "High-resolution AI-generated images with multiple art styles",
    tags: ["4K", "Multiple Styles", "Professional"],
    color: "pink"
  },
  {
    icon: Download,
    title: "Export & Save",
    description: "Download personas as PDF, JSON, or share via unique links",
    tags: ["PDF", "JSON", "Export"],
    color: "blue"
  },
  {
    icon: Settings,
    title: "Advanced Controls",
    description: "Fine-tune generation parameters, seeds, and model selection",
    tags: ["Seeds", "Models", "Parameters"],
    color: "orange"
  }
]

const colorMap = {
  purple: "bg-purple-500/20 text-purple-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
  teal: "bg-teal-500/20 text-teal-400",
  pink: "bg-pink-500/20 text-pink-400",
  blue: "bg-blue-500/20 text-blue-400",
  orange: "bg-orange-500/20 text-orange-400"
}

export function FeaturesSection() {
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
            Run, Share and <span className="neon-text">Collaborate</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to create, customize, and share AI personas. 
            Built for teams, creators, and developers who demand the best.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 h-full hover:scale-105 transition-all duration-300 group" glow>
                <div className={`w-12 h-12 rounded-full ${colorMap[feature.color as keyof typeof colorMap]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{feature.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <GlassCard className="p-8" glow>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold neon-text mb-2">10,000+</div>
                <div className="text-gray-400">Personas Generated</div>
              </div>
              <div>
                <div className="text-3xl font-bold neon-text mb-2">25s</div>
                <div className="text-gray-400">Average Generation Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold neon-text mb-2">99.9%</div>
                <div className="text-gray-400">Uptime Reliability</div>
              </div>
              <div>
                <div className="text-3xl font-bold neon-text mb-2">4.9/5</div>
                <div className="text-gray-400">User Satisfaction</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}