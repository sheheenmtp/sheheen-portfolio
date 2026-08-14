import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Briefcase,
  FileDown,
  Github,
  Languages,
  Linkedin,
  Mail,
  MapPin,
  Server,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/button';

export function Hero() {
  const highlights = [
    {
      value: '1 Year',
      label: 'Hands-on experience at ICFOSS',
      icon: Briefcase,
    },
    {
      value: '15 REST APIs',
      label: 'Built for an adaptive AI Tutor',
      icon: Server,
    },
    {
      value: 'English–Malayalam',
      label: 'NLP and machine-translation workflows',
      icon: Languages,
    },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 relative">
      <div className="text-center max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-400/30 mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span>Available for AI/ML opportunities</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1
            className="font-bold mb-4"
            style={{ fontSize: 'clamp(1.25rem, 5vw, 6rem)', whiteSpace: 'nowrap' }}
          >
            {'MUHAMMED SHEHEEN M T P'.split('').map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.15 + index * 0.035,
                  ease: 'easeOut',
                }}
                whileHover={{ y: -6, scale: 1.06 }}
                className="inline-block bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="hero-role text-3xl md:text-5xl font-bold mb-6"
          >
            <span className="hero-role-accent">AI/ML</span>
            <span className="hero-role-title">Engineer</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto"
          >
            NLP • Machine Translation • LLMs • Computer Vision
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.7 }}
            className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto"
          >
            Building practical multilingual AI systems—from English–Malayalam corpus engineering
            and NLLB-200 fine-tuning to LLM-powered APIs and live deployment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.84, duration: 0.7 }}
            className="flex flex-wrap justify-center gap-2 mb-6"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              <a href="/Sheheen_Resume.pdf" download>
                <FileDown size={18} />
                Download Resume
              </a>
            </Button>

            <Button asChild size="lg" variant="outline">
              <a href="mailto:muhamammedsheheen0@gmail.com">
                Let's Connect
                <ArrowRight size={18} />
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.96, duration: 0.7 }}
            className="flex items-center justify-center space-x-4 mb-8"
          >
            <Button asChild size="icon" variant="ghost" className="text-gray-400 hover:text-blue-400">
              <a href="https://github.com/sheheenmtp" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                <Github />
              </a>
            </Button>
            <Button asChild size="icon" variant="ghost" className="text-gray-400 hover:text-blue-400">
              <a href="https://www.linkedin.com/in/sheheen-mtp/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                <Linkedin />
              </a>
            </Button>
            <Button asChild size="icon" variant="ghost" className="text-gray-400 hover:text-blue-400">
              <a href="mailto:muhamammedsheheen0@gmail.com" aria-label="Send email">
                <Mail />
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            className="flex items-center justify-center space-x-2 text-gray-400 mb-12"
          >
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>Thiruvananthapuram, Kerala, India</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.value}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-blue-400/50 transition-all duration-300"
            >
              <highlight.icon className="w-6 h-6 text-blue-400 mx-auto mb-4" />
              <div className="text-xl font-bold text-white mb-2">{highlight.value}</div>
              <div className="text-gray-400 text-sm">{highlight.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
