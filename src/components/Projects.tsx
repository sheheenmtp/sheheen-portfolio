import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Hand, Languages, Code2, Ship, Terminal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function Projects() {
  const projects = [
    {
      title: "AI Tutor Platform",
      description:
        "Full-stack adaptive coding platform with 15 REST APIs for auth, learner progress, problem recommendation, code evaluation, and AI feedback. Adaptive prompting and learner-state logic.",
      icon: Code2,
      tech: ["FastAPI", "PostgreSQL", "SQLAlchemy", "Ollama", "Judge0", "Docker"],
      gradient: "from-indigo-400 to-purple-600",
      github: "https://github.com/sheheenmtp/AI_Tutor"
    },
    {
      title: "English–Malayalam NMT and Corpus Quality Pipeline",
      description:
        "Bilingual corpus preparation, semantic filtering, Transformer training experiments, inference, and translation-quality evaluation; optimized NLLB fine-tuning for limited GPU resources.",
      icon: Languages,
      tech: ["Python", "PyTorch", "Transformers", "NLLB-200", "OpenNMT", "PEFT/LoRA"],
      gradient: "from-emerald-400 to-teal-600",
      github: "#"
    },
    {
      title: "Autonomous USV for Aquatic Waste Detection",
      description:
        "Computer-vision subsystem for floating-waste detection and autonomous surface-vehicle operation; YOLOv8 + OpenCV + ESP32 control.",
      icon: Ship,
      tech: ["Python", "YOLOv8", "OpenCV", "ESP32"],
      gradient: "from-blue-400 to-cyan-600",
      github: "#"
    },
    {
      title: "GestureSync",
      description:
        "Multimodal HCI system combining real-time hand-landmark recognition with voice-command processing for hands-free desktop control.",
      icon: Hand,
      tech: ["Python", "OpenCV", "MediaPipe", "Speech Recognition"],
      gradient: "from-pink-400 to-rose-600",
      github: "#"
    },
    {
      title: "Linux Adaptive Tutor",
      description:
        "AI-assisted Linux learning platform with adaptive lesson difficulty, multiple explanation modes, progress tracking, and secure Bash command execution.",
      icon: Terminal,
      tech: ["FastAPI", "PostgreSQL", "Ollama", "Judge0"],
      gradient: "from-purple-400 to-blue-600",
      github: "#"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
           Interactive gallery showcasing real-world AI/ML projects focused on computer vision, NLP, and intelligent systems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className="bg-gray-900/50 border-gray-700/50 hover:border-blue-400/50 transition-all duration-300 overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`p-3 rounded-full bg-gradient-to-r ${project.gradient} bg-opacity-20`}
                    >
                      <project.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-blue-400">
                        <ExternalLink size={16} />
                      </Button>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">                                                                                                                                        
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-blue-400">                                                                                                                         
                        <Github size={16} />                                                                                                                                                                                   
                      </Button>                                                                                                                                                                                                
                      </a>   
                    </div>
                  </div>
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-400/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
