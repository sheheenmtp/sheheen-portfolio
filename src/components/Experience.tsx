import React from 'react';
import { motion } from 'motion/react';
import { Brain } from 'lucide-react';

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
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Experience Timeline
          </h2>
          <p className="text-gray-400 text-lg">
            Malayalam NLP, machine translation, LLM applications, and multilingual AI deployment
          </p>
        </motion.div>

        {/* Work Experience */}
        <h3 className="text-2xl font-semibold mb-4 text-white">Work Experience</h3>
        <div className="relative">
          <div className="absolute left-3 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 rounded-full" />
          {work.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
              viewport={{ once: true }}
              className={`relative flex items-start md:items-center mb-10 md:mb-16 pl-10 md:pl-0 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.3 + 0.5, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute left-3 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full border-4 border-gray-900 z-10"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}
              >
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-blue-400/50 transition-all duration-300">
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
                  <p className="text-purple-300 text-sm mb-3">{exp.period}</p>
                  <div className="text-gray-300 mb-4 space-y-3">
                    {exp.details.map((detail) => (
                      <p key={detail}>• {detail}</p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-400/30">
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
