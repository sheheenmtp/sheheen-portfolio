import React from 'react';
import { motion } from 'motion/react';
import {
  Bot,
  Brain,
  Code,
  Container,
  Database,
  Eye,
  GitBranch,
  Languages,
  Server,
  Sparkles,
  Terminal,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { reveal } from '../lib/motion';

export function TechStack() {
  const techCategories: Array<{
    category: string;
    icon: LucideIcon;
    skills: string[];
  }> = [
    {
      category: 'Programming',
      icon: Code,
      skills: ['Python', 'SQL'],
    },
    {
      category: 'Machine Learning',
      icon: Brain,
      skills: [
        'PyTorch',
        'TensorFlow',
        'scikit-learn',
        'Deep Learning',
        'Transfer Learning',
        'Model Evaluation',
      ],
    },
    {
      category: 'NLP / Machine Translation',
      icon: Languages,
      skills: [
        'Hugging Face Transformers',
        'NLLB-200',
        'OpenNMT',
        'Sentence Transformers',
        'LaBSE',
        'Tokenization',
        'POS Tagging',
        'NER',
        'Chunking',
        'Dependency Parsing',
        'Discourse Annotation',
        'Morphological Segmentation',
        'Summarization',
        'Paraphrasing',
      ],
    },
    {
      category: 'LLM / Generative AI',
      icon: Sparkles,
      skills: [
        'PEFT',
        'LoRA',
        'QLoRA',
        'Quantization',
        'Prompt Engineering',
        'Ollama',
        'Qwen2.5-Coder',
      ],
    },
    {
      category: 'Data / Evaluation',
      icon: Database,
      skills: [
        'NumPy',
        'Pandas',
        'Hugging Face Datasets',
        'Semantic Similarity',
        'Cosine Similarity',
        'Corpus Filtering',
        'BLEU',
        'chrF',
        'Loss & Perplexity Analysis',
      ],
    },
    {
      category: 'Backend / Infrastructure',
      icon: Server,
      skills: [
        'FastAPI',
        'SQLAlchemy',
        'PostgreSQL',
        'REST APIs',
        'Docker',
        'Docker Compose',
        'Judge0',
        'Git',
        'Linux',
        'Jupyter',
        'Google Colab',
      ],
    },
    {
      category: 'Computer Vision',
      icon: Eye,
      skills: ['OpenCV', 'YOLOv8', 'Object Detection', 'MediaPipe'],
    },
  ];

  const skillIcons: Partial<Record<string, LucideIcon>> = {
    Python: Code,
    SQL: Database,
    'Hugging Face Datasets': Database,
    'Prompt Engineering': Sparkles,
    Ollama: Bot,
    'Qwen2.5-Coder': Bot,
    FastAPI: Server,
    PostgreSQL: Database,
    'REST APIs': Server,
    Docker: Container,
    'Docker Compose': Container,
    Judge0: Terminal,
    Git: GitBranch,
    Linux: Terminal,
    OpenCV: Eye,
    YOLOv8: Eye,
    'Object Detection': Eye,
  };

  return (
    <section id="tech-stack" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          {...reveal()}
          className="text-center mb-16"
        >
          <h2 className="section-title text-4xl md:text-5xl font-bold">
            Tech Stack
          </h2>
          <p className="section-copy text-lg">
            Technologies and tools I use to build intelligent systems
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {techCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              {...reveal(categoryIndex * 0.08)}
              whileHover={{ y: -4 }}
              className="h-full"
            >
              <Card className="surface-card h-full transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="accent-icon p-2 rounded-full">
                      <category.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">
                      {category.category}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => {
                      const SkillIcon = skillIcons[skill];

                      return (
                        <motion.div
                          key={skill}
                          whileHover={{ scale: 1.05 }}
                          className="accent-chip flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
                        >
                          {SkillIcon && <SkillIcon className="w-4 h-4" />}
                          <span>{skill}</span>
                        </motion.div>
                      );
                    })}
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
