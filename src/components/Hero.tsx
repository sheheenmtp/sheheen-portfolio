import React from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  ChevronDown,
  FileText,
  Github,
  Linkedin,
  MapPin,
  Boxes,
  BrainCircuit,
  Workflow,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/button';
import { enter } from '../lib/motion';

export function Hero() {
  const highlights = [
    {
      value: 'AI Systems',
      label: 'LLM applications, ML pipelines, and model integration',
      icon: Briefcase,
    },
    {
      value: 'Backend & APIs',
      label: 'FastAPI, PostgreSQL, and Dockerized services',
      icon: Boxes,
    },
    {
      value: 'Applied AI',
      label: 'Computer vision, data processing, and automation',
      icon: Workflow,
    },
  ];

  return (
    <section id="home" className="hero-section min-h-screen flex items-center justify-center px-6 py-24 relative">
      <div className="text-center max-w-6xl">
        <motion.div
          {...enter()}
          className="accent-chip inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span>Available for AI/ML opportunities</span>
        </motion.div>

        <motion.div
          {...enter(0.08)}
          className="mb-8"
        >
          <h1
            className="hero-name font-bold mb-4"
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
                className="inline-block hero-name-letter"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </h1>

          <motion.h2
            {...enter(0.28)}
            className="hero-role text-3xl md:text-5xl font-bold mb-6"
          >
            <span className="hero-role-accent">AI/ML Engineer</span>
            <span className="hero-role-title">| Generative AI | AI Systems</span>
          </motion.h2>

          <motion.p
            {...enter(0.36)}
            className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto"
          >
            Building intelligent software systems, LLM-powered applications, ML pipelines, and AI
            automation workflows with Python and modern AI infrastructure.
          </motion.p>

          <motion.div
            {...enter(0.52)}
            className="flex flex-wrap justify-center gap-3 mb-6"
          >
            <Button
              asChild
              size="lg"
              className="primary-cta"
            >
              <a href="#projects">
                <BrainCircuit size={18} />
                View Projects
              </a>
            </Button>

            <Button asChild size="lg" variant="outline">
              <a href="https://github.com/sheheenmtp" target="_blank" rel="noopener noreferrer">
                <Github size={18} />
                GitHub
              </a>
            </Button>

            <Button asChild size="lg" variant="outline">
              <a href="https://www.linkedin.com/in/sheheen-mtp/" target="_blank" rel="noopener noreferrer">
                <Linkedin size={18} />
                LinkedIn
              </a>
            </Button>

            <Button asChild size="lg" variant="outline">
              <a href="/Sheheen_Resume.pdf" target="_blank" rel="noopener noreferrer">
                <FileText size={18} />
                Resume
              </a>
            </Button>
          </motion.div>

          <motion.div
            {...enter(0.68)}
            className="flex items-center justify-center space-x-2 text-gray-400 mt-8 mb-12"
          >
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>Thiruvananthapuram, Kerala, India</span>
          </motion.div>
        </motion.div>

        <motion.div
          {...enter(0.76)}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.value}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="surface-card h-full border rounded-2xl p-6 transition-all duration-300"
            >
              <highlight.icon className="w-6 h-6 text-blue-400 mx-auto mb-4" />
              <div className="text-xl font-bold text-white mb-2">{highlight.value}</div>
              <div className="text-gray-400 text-sm">{highlight.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="hero-scroll-cue"
        aria-label="Scroll to the About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        <span>Explore</span>
        <motion.span
          aria-hidden="true"
          animate={{ y: [0, 6, 0] }}
          transition={{ delay: 1.3, duration: 1.8, repeat: Infinity }}
        >
          <ChevronDown />
        </motion.span>
      </motion.a>
    </section>
  );
}
