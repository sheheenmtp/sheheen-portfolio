import React from 'react';
import { motion } from 'motion/react';
import { Brain, Cpu, FileDown, Bot,Cog,Loader } from 'lucide-react';
import { Button } from './ui/button';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            {"SHEHEEN M T P".split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="inline-block bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent"
                style={{ 
                  perspective: "1000px",
                  transformStyle: "preserve-3d"
                }}
                whileHover={{
                  scale: 1.2,
                  rotateY: 360,
                  transition: { duration: 0.5 }
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Welcome to My Portfolio
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          Exploring AI, ML & Data Science
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-12"
        >
          <a href="/Sheheen_Resume.pdf" download>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
              <FileDown className="mr-2" size={18} />
              Download Resume
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center space-x-8 mb-12"
        >
          {[Cog,Bot, Cpu].map((Icon, index) => (
            <motion.div
              key={index}
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, delay: index * 0.3 }
              }}
              className="p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30"
            >
              <Icon size={40} className="text-blue-400" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="space-y-4"
        >
          <div className="text-lg text-gray-400">B.Tech IT Graduate</div>
          <div className="text-blue-400">Building Intelligent Systems • Python • NLP • Deep Learning</div>
        </motion.div>
      </div>
    </section>
  );
}
