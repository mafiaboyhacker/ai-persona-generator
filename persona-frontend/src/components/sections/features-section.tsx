"use client"

import { motion } from "framer-motion"
import { GlassCard } from "../ui/glass-card"
import { Badge } from "../ui/badge"
import { 
  Brain, 
  Zap, 
  Palette, 
  Download, 
  Settings,
  Image as ImageIcon
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Entertainment-Grade AI",
    description: "Powered by Persona-LLM and Persona-v.01 for industry-standard AI influencers, actors, and singers",
    tags: ["Industry-Grade", "Professional", "AI Stars"],
    color: "purple"
  },
  {
    icon: Zap,
    title: "Instant Star Creation",
    description: "Launch AI influencers with complete backstories and visuals in under 30 seconds",
    tags: ["Instant", "Professional", "Ready-to-Use"],
    color: "yellow"
  },
  {
    icon: Palette,
    title: "Total Character Control",
    description: "Craft unique AI personalities, appearances, and backstories for any entertainment genre",
    tags: ["Customizable", "Unique", "Authentic"],
    color: "teal"
  },
  {
    icon: ImageIcon,
    title: "Star-Quality Visuals",
    description: "Professional 4K AI-generated portraits perfect for social media, marketing, and content",
    tags: ["4K Quality", "Social Ready", "Marketing"],
    color: "pink"
  },
  {
    icon: Download,
    title: "Multi-Platform Export",
    description: "Deploy AI stars across platforms with downloadable profiles, images, and content packages",
    tags: ["Multi-Platform", "Content Packs", "Deploy"],
    color: "blue"
  },
  {
    icon: Settings,
    title: "Pro-Level Controls",
    description: "Fine-tune every detail with advanced parameters for consistent brand-aligned AI characters",
    tags: ["Brand Control", "Consistency", "Advanced"],
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
            Create, Launch and <span className="neon-text">Monetize</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything entertainment professionals need to create AI influencers, actors, singers, and VTubers. 
            Built for agencies, studios, and content creators who demand industry excellence.
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
                <div className="text-gray-400">AI Stars Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold neon-text mb-2">25s</div>
                <div className="text-gray-400">Star Launch Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold neon-text mb-2">99.9%</div>
                <div className="text-gray-400">Industry Reliability</div>
              </div>
              <div>
                <div className="text-3xl font-bold neon-text mb-2">4.9/5</div>
                <div className="text-gray-400">Entertainment Pro Rating</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}