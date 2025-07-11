"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "../ui/glass-card"
import { NeonButton } from "../ui/neon-button"
import { Input } from "../ui/input"
import { ArrowRight, Sparkles, Zap, Github, X } from "lucide-react"

export function CtaSection() {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)

  const handleComingSoonClick = () => {
    setShowComingSoonModal(true)
  }
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-12 text-center relative overflow-hidden" glow>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-teal-500/10" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Ready to Get Started?</span>
                </div>

                <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Start Creating
                  <br />
                  <span className="neon-text bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                    Amazing Personas
                  </span>
                </h2>

                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of creators who are already using AI Persona Generator 
                  to bring their ideas to life. Start for free, no credit card required.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 max-w-md mx-auto"
              >
                <Input 
                  placeholder="Enter your email"
                  className="flex-1 bg-black/50 border-purple-500/30 focus:border-purple-500 cursor-pointer"
                  onClick={handleComingSoonClick}
                  readOnly
                />
                <NeonButton size="lg" className="w-full sm:w-auto" onClick={handleComingSoonClick}>
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </NeonButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <NeonButton variant="ghost" size="lg" onClick={handleComingSoonClick}>
                  <Zap className="w-5 h-5" />
                  Try Demo
                </NeonButton>
                <NeonButton variant="outline" size="lg" onClick={handleComingSoonClick}>
                  <Github className="w-5 h-5" />
                  View on GitHub
                </NeonButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="mt-8 text-sm text-gray-400"
              >
                Free tier includes 10 persona generations per month. No credit card required.
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">
            <div>
              © 2025 AI Persona Generator. Persona-LLM and Persona-v.01
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowComingSoonModal(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-gray-900 rounded-2xl border border-gray-700 p-8 max-w-md w-full relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Content */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  Coming Soon!
                </h3>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  We're working hard to bring you this amazing feature. 
                  Stay tuned for updates and be the first to know when it's ready!
                </p>
                
                <NeonButton 
                  size="lg" 
                  className="w-full"
                  onClick={() => setShowComingSoonModal(false)}
                >
                  Got it!
                </NeonButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}