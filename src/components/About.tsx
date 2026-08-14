import React from 'react';
import { motion } from 'motion/react';
import { Code, Coffee, Heart } from 'lucide-react';
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
              AI/ML Engineer specializing in language technology and intelligent systems
            </h3>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              I have one year of hands-on experience as a Paid Intern at ICFOSS, contributing to
              Malayalam NLP and BHASHINI language-technology workflows. My work spans linguistic
              data annotation, English–Malayalam corpus engineering, semantic filtering, NLLB-200
              fine-tuning, OpenNMT experiments, and translation evaluation.
            </p>

            <p className="text-gray-300 text-lg leading-relaxed">
              I also build LLM-powered applications and backend APIs and have supported live multilingual
              AI deployments. My core toolkit includes Python, PyTorch, Hugging Face Transformers,
              PEFT/LoRA, FastAPI, PostgreSQL, Docker, and Linux, with additional experience in computer
              vision using OpenCV and YOLOv8.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <Code className="text-blue-400" size={20} />
                <span>Malayalam NLP</span>
              </div>
              <div className="flex items-center space-x-2">
                <Coffee className="text-blue-400" size={20} />
                <span>Machine Translation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="text-blue-400" size={20} />
                <span>Applied AI</span>
              </div>
            </div>

            <motion.div
              {...fade(0.22)}
              className="surface-card p-6 border"
            >
              <p className="text-blue-300 italic">
                "Building practical multilingual AI systems from high-quality data to live deployment."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
