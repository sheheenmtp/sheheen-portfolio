import React from 'react';
import { motion } from 'motion/react';
import { Github, Hand, Languages, Code2, Ship, Terminal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { reveal } from '../lib/motion';

export function Projects() {
  const projects = [
    {
      title: "AI Tutor Platform",
      description:
        "Full-stack adaptive coding platform with 15 REST APIs for auth, learner progress, problem recommendation, code evaluation, and AI feedback. Adaptive prompting and learner-state logic.",
      icon: Code2,
      tech: ["FastAPI", "PostgreSQL", "SQLAlchemy", "Ollama", "Judge0", "Docker"],
      gradient: "from-blue-400 to-blue-600",
      github: "https://github.com/sheheenmtp/AI_Tutor"
    },
    {
      title: "English–Malayalam NMT and Corpus Quality Pipeline",
      description:
        "Bilingual corpus preparation, semantic filtering, Transformer training experiments, inference, and translation-quality evaluation; optimized NLLB fine-tuning for limited GPU resources.",
      icon: Languages,
      tech: ["Python", "PyTorch", "Transformers", "NLLB-200", "OpenNMT", "PEFT/LoRA"],
      gradient: "from-blue-400 to-blue-600",
      github: "#"
    },
    {
      title: "Autonomous USV for Debris Collection",
      description:
        "AI-powered unmanned surface vehicle for detecting and collecting floating plastic waste using YOLOv8, OpenCV, and ESP32 control.",
      icon: Ship,
      tech: ["Python", "YOLOv8", "OpenCV", "ESP32"],
      gradient: "from-blue-400 to-blue-600",
      github: "https://github.com/sheheenmtp/usv-debris-collection"
    },
    {
      title: "GestureSync",
      description:
        "Collaborative multimodal HCI project combining real-time hand-landmark recognition with voice-command processing for hands-free desktop control.",
      icon: Hand,
      tech: ["Python", "OpenCV", "MediaPipe", "Speech Recognition"],
      gradient: "from-blue-400 to-blue-600",
      github: "https://github.com/sheheenmtp/Gesture_Sync",
      attribution: "Team project · linked to my fork"
    },
    {
      title: "Linux Adaptive Tutor",
      description:
        "AI-assisted Linux learning platform with adaptive lesson difficulty, multiple explanation modes, progress tracking, and secure Bash command execution.",
      icon: Terminal,
      tech: ["FastAPI", "PostgreSQL", "Ollama", "Judge0"],
      gradient: "from-blue-400 to-blue-600",
      github: "#"
    }
  ];

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          {...reveal()}
          className="text-center mb-16"
        >
          <h2 className="section-title text-4xl md:text-5xl font-bold">
            Featured Projects
          </h2>
          <p className="section-copy text-lg max-w-2xl mx-auto">
           Interactive gallery showcasing real-world AI/ML projects focused on computer vision, NLP, and intelligent systems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              {...reveal(index * 0.08)}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group h-full"
            >
              <Card className="surface-card h-full transition-all duration-300 overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <CardHeader className="relative flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`p-3 rounded-full bg-gradient-to-r ${project.gradient} bg-opacity-20`}
                    >
                      <project.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    {project.github === '#' ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-gray-500"
                        disabled
                        aria-label={`${project.title} repository is not publicly available`}
                        title="Repository not publicly available"
                      >
                        <Github />
                      </Button>
                    ) : (
                      <Button asChild size="icon" variant="ghost" className="text-gray-400 hover:text-blue-400">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${project.title} on GitHub`}
                        >
                          <Github />
                        </a>
                      </Button>
                    )}
                  </div>
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative">
                  {'attribution' in project && project.attribution && (
                    <p className="section-copy mb-4 text-sm">{project.attribution}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="accent-chip px-3 py-1 rounded-full text-sm"
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
