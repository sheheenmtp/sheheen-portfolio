import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Hand, Languages, Code2, Ship, Terminal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { reveal } from '../lib/motion';

export function Projects() {
  const projects = [
    {
      title: "AI Tutor — AI-Powered Coding Education Platform",
      category: "Featured · Full-Stack AI Engineering",
      description:
        "Built a full-stack coding education platform integrating local LLM inference, adaptive learning, automated code execution, learner-state tracking, REST APIs, and persistent storage.",
      icon: Code2,
      tech: ["React", "Vite", "Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Ollama", "Qwen2.5-Coder", "Judge0", "Docker"],
      evidence: ["15+ REST API endpoints", "PostgreSQL-backed learner state", "Local Qwen2.5-Coder inference", "Judge0 code execution", "Dockerized backend"],
      gradient: "from-blue-400 to-blue-600",
      github: "https://github.com/sheheenmtp/AI_Tutor",
      featured: true,
    },
    {
      title: "NLLB Malayalam Machine Translation",
      category: "Generative AI · Model Fine-Tuning · Machine Translation",
      description:
        "Fine-tuned NLLB for English–Malayalam translation using parameter-efficient LoRA/QLoRA workflows, including parallel-corpus preprocessing, tokenization, training, inference, and evaluation.",
      icon: Languages,
      tech: ["Python", "PyTorch", "Hugging Face", "NLLB", "QLoRA", "LoRA"],
      evidence: ["Parameter-efficient fine-tuning", "Parallel-corpus preprocessing", "Model shared on Hugging Face"],
      gradient: "from-blue-400 to-blue-600",
      github: "#",
      projectUrl: "https://huggingface.co/Muhammed-sheheen/NLLB_FINETUNIG",
      linkLabel: "Hugging Face model",
    },
    {
      title: "Autonomous USV for Debris Collection",
      category: "Computer Vision · Autonomous Systems",
      description:
        "Built an unmanned surface vehicle that detects floating plastic waste with YOLOv8 and OpenCV, then connects visual detections to ESP32-based collection and control hardware.",
      icon: Ship,
      tech: ["Python", "YOLOv8", "OpenCV", "ESP32"],
      gradient: "from-blue-400 to-blue-600",
      github: "https://github.com/sheheenmtp/usv-debris-collection"
    },
    {
      title: "GestureSync",
      category: "Computer Vision · Human–Computer Interaction",
      description:
        "Built a hands-free desktop control system combining real-time MediaPipe hand-landmark recognition, OpenCV video processing, and voice commands.",
      icon: Hand,
      tech: ["Python", "OpenCV", "MediaPipe", "Speech Recognition"],
      gradient: "from-blue-400 to-blue-600",
      github: "https://github.com/sheheenmtp/Gesture_Sync",
      attribution: "Team project · linked to my fork"
    },
    {
      title: "Linux Adaptive Tutor",
      category: "AI Application · Backend",
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
            Applied AI systems spanning LLM applications, model fine-tuning, backend engineering, and computer vision.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              {...reveal(index * 0.08)}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`group h-full${project.featured ? ' featured-project' : ''}`}
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
                  <p className="project-category">{project.category}</p>
                  <CardDescription className="text-gray-400">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative">
                  {'attribution' in project && project.attribution && (
                    <p className="section-copy mb-4 text-sm">{project.attribution}</p>
                  )}
                  {'evidence' in project && project.evidence && (
                    <ul className="project-evidence mb-5">
                      {project.evidence.map((item) => <li key={item}>{item}</li>)}
                    </ul>
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
                  {'projectUrl' in project && project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="certificate-link mt-5">
                      {project.linkLabel}
                      <ExternalLink aria-hidden="true" />
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
