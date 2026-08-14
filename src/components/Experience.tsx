import React from 'react';
import { motion } from 'motion/react';
import { Brain } from 'lucide-react';
import { reveal } from '../lib/motion';

export function Experience() {
  const work = [
    {
      title: "Paid Intern",
      company: "ICFOSS — International Centre for Free and Open Source Solutions, Government of Kerala",
      location: "Thiruvananthapuram, Kerala",
      period: "August 2025 – August 2026",
      details: [
        "Contributed to Malayalam NLP and machine-translation data engineering for BHASHINI: POS tagging, NER, chunking, dependency-parser correction, discourse annotation, morphological segmentation, summarization, and paraphrasing.",
        "Built and validated English–Malayalam parallel-corpus workflows: text normalization, Unicode correction, language validation, duplicate removal, length-ratio checks, and sentence-alignment review.",
        "Designed semantic-quality filtering with multilingual sentence embeddings and cosine similarity to flag noisy or weakly aligned bilingual pairs.",
        "Fine-tuned Meta NLLB-200 Distilled 600M with Hugging Face Transformers and PEFT/LoRA; handled tokenization, language codes, checkpoints, adapter merging, inference, and BLEU/chrF evaluation.",
        "Applied 8-bit quantization, gradient checkpointing, gradient accumulation, mixed precision, dynamic padding, and batch-size tuning for resource-constrained training.",
        "Developed an AI Tutor backend with FastAPI, PostgreSQL, SQLAlchemy, and Docker: 15 REST endpoints, adaptive learner-state logic, LLM feedback via Ollama, and secure multi-language code execution via Judge0.",
        "Supported live Bhashini AI deployment at the VISION 2031 conference: real-time ASR and multilingual translation, audio integration, sync monitoring, and acoustic troubleshooting.",
        "Prepared domain-specific Malayalam resources: dialect mappings, medicinal-plant data, OCR/ASR verification, and large-scale English–Malayalam translation batches."
      ],
      icon: Brain,
      skills: [
        "Malayalam NLP",
        "Machine Translation",
        "NLLB-200",
        "PEFT/LoRA",
        "FastAPI",
        "PostgreSQL",
        "Docker"
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
            Experience Timeline
          </h2>
          <p className="section-copy text-lg">
            Malayalam NLP, machine translation, LLM applications, and multilingual AI deployment
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
