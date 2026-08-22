import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Code2, Workflow } from 'lucide-react';
import photo from '../sheheen.webp';
import { fade, reveal } from '../lib/motion';

export function About() {
  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          {...reveal()}
          className="text-center mb-16"
        >
          <h2 className="section-title text-4xl md:text-5xl font-bold">
            About Me
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            {...reveal(0.06)}
          >
            <div className="about-portrait-wrap relative mx-auto">
              <div className="about-portrait mx-auto rounded-full bg-blue-500/20 border-2 border-blue-400/30 p-3 md:p-4 flex items-center justify-center overflow-hidden">
                <img 
                  src={photo} 
                  alt="Muhammed Sheheen M T P"
                  width="720"
                  height="720"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-blue-400/20 rounded-full"
              />
            </div>
          </motion.div>

          <motion.div
            {...reveal(0.14)}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              I build and integrate AI models into usable software systems.
            </h3>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              My work spans AI/ML, Generative AI, LLM applications, backend API engineering,
              computer vision, data processing, and multilingual machine translation. At ICFOSS,
              I have contributed to research and engineering workflows from dataset preparation
              and model experimentation through application integration.
            </p>

            <p className="text-gray-300 text-lg leading-relaxed">
              I use Python, PyTorch, scikit-learn, Hugging Face, FastAPI, PostgreSQL, Docker,
              OpenCV, and Ollama to turn models into practical tools. I also have basic hands-on
              experience creating n8n workflows with APIs, webhooks, and multi-step automation.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="text-blue-400" size={20} />
                <span>AI Systems</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code2 className="text-blue-400" size={20} />
                <span>Backend APIs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Workflow className="text-blue-400" size={20} />
                <span>AI Automation</span>
              </div>
            </div>

            <motion.p {...fade(0.22)} className="section-copy text-sm">
              NLP and NMT are part of this broader engineering practice, including NLLB fine-tuning,
              OpenNMT experimentation, and English–Malayalam parallel-corpus processing.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
