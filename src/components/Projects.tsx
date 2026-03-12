import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, ChefHat, Bot, BarChart3, Hand, Languages, Code2, Ship } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function Projects() {
 const projects = [
  {
    title: "Interactive Python AI Tutor",
    description:
      "AI-powered tutoring system that evaluates Python code, provides rule-based feedback, tracks learner progress, and guides students toward correct solutions using LLMs.",
    icon: Code2,
    tech: [
      "Python",
      "FastAPI",
      "LLMs",
      "Prompt Engineering",
      "Judge0 API",
      "NLP"
    ],
    gradient: "from-indigo-400 to-purple-600",
    demo: "#",
    github: "https://github.com/sheheenmtp/AI_Tutor"
  },
  // { 
  //   title: "DL-DISCO Machine Translation (Malayalam NLP)",
  //   description:
  //     "Linguistic data annotation and preprocessing pipeline for Malayalam POS tagging, NER, and chunking to support machine translation research at ICFOSS.",
  //   icon: Languages,
  //   tech: [
  //     "NLP",
  //     "POS Tagging",
  //     "NER",
  //     "Chunking",
  //     "Python",
  //     "Data Preprocessing"
  //   ],
  //   gradient: "from-emerald-400 to-teal-600",
  //   demo: "#",
  //   github: "#"
  // },
  {
    title: "Autonomous USV for Floating Waste Detection",
    description:
      "Vision-powered unmanned surface vehicle for real-time plastic waste detection using YOLOv8 with ESP32-based navigation and WebSocket control.",
    icon: Ship,
    tech: [
      "YOLOv8",
      "Computer Vision",
      "ESP32",
      "WebSocket",
      "Python",
      "OpenCV",
      "TFLite"
    ],
    gradient: "from-blue-400 to-cyan-600",
    demo: "#",
    github: "#"
  },
  {
    title: "Gesture_Sync – Multi-Modal Interaction System",
    description:
      "Real-time hand gesture recognition system to control system actions such as volume, cursor movement, and shortcuts using vision and speech.",
    icon: Hand,
    tech: [
      "Python",
      "OpenCV",
      "MediaPipe",
      "SpeechRecognition",
      "Computer Vision"
    ],
    gradient: "from-pink-400 to-rose-600",
    demo: "#",
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