import React from 'react';
import { motion } from 'motion/react';
import { Brain } from 'lucide-react';
import { reveal } from '../lib/motion';

export function Experience() {
  const work = [
    {
      title: "AI/ML Research Intern",
      company: "International Centre for Free and Open Source Software (ICFOSS)",
      location: "Thiruvananthapuram, Kerala",
      period: "August 2025 – August 2026",
      details: [
        "Developed an AI Tutor backend with FastAPI, PostgreSQL, SQLAlchemy, Ollama, Judge0, and Docker, including 15+ REST endpoints and adaptive learner-state logic.",
        "Integrated local LLM inference and automated code execution into an AI application, connecting persistent learner state, adaptive recommendation logic, AI-generated feedback, and REST services.",
        "Supported a live Bhashini AI deployment using real-time ASR and multilingual translation, with audio integration, synchronization monitoring, and technical troubleshooting.",
        "Fine-tuned NLLB-200 with Hugging Face, PyTorch, and PEFT/LoRA; worked across tokenization, resource-aware training, inference, and BLEU/chrF evaluation.",
        "Conducted multilingual and Malayalam NLP research using NLLB, OpenNMT, sentence embeddings, corpus preprocessing, and translation-quality evaluation.",
        "Engineered and validated English–Malayalam parallel corpora with Python workflows for normalization, Unicode correction, language validation, deduplication, alignment review, and semantic-quality filtering."
      ],
      icon: Brain,
      skills: [
        "FastAPI",
        "REST APIs",
        "LLM Integration",
        "PostgreSQL",
        "Docker",
        "Python",
        "PyTorch",
        "Hugging Face",
        "Model Fine-Tuning",
        "Data Cleaning",
        "Data Preprocessing",
        "Dataset Engineering",
        "Parallel Corpus Processing",
        "Model Evaluation",
        "Machine Translation",
        "NLLB-200",
        "PEFT/LoRA"
      ],
    }
  ];


  return (
    <section id="experience" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          {...reveal()}
          className="text-center mb-16"
        >
          <h2 className="section-title text-4xl md:text-5xl font-bold">
            Experience
          </h2>
          <p className="section-copy text-lg">
            AI application engineering, backend systems, deployment, model research, and multilingual data workflows
          </p>
        </motion.div>

        {/* Work Experience */}
        <h3 className="text-2xl font-semibold mb-4 text-white">Work Experience</h3>
        <div className="relative">
          <div className="absolute left-5 md:left-6 w-1 h-full bg-gradient-to-b from-blue-300 via-blue-500 to-blue-700 rounded-full" />
          {work.map((exp, index) => (
            <motion.div
              key={exp.title}
              {...reveal(index * 0.08)}
              className="relative mb-10 pl-14 md:pl-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.08 + 0.16, duration: 0.35 }}
                viewport={{ once: true }}
                className="absolute left-5 md:left-6 transform -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full border-4 border-gray-900 z-10"
              />
              <motion.div
                whileHover={{ y: -4 }}
                className="w-full"
              >
                <div className="surface-card border p-6 transition-all duration-300">
                  <div className="flex items-start md:items-center mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-full mr-4">
                      <exp.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white">{exp.title}</h3>
                      <p className="text-blue-400 text-sm md:text-base">{exp.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{exp.location}</p>
                  <p className="text-blue-300 text-sm mb-3">{exp.period}</p>
                  <ul className="experience-details text-gray-300 mb-5 space-y-3">
                    {exp.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span key={skill} className="accent-chip px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
