import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { reveal } from '../lib/motion';

export function TechStack() {
  const techCategories: Array<{
    category: string;
    icon: string;
    skills: string[];
  }> = [
    {
      category: 'Programming',
      icon: 'fi-rr-code-simple',
      skills: ['Python', 'SQL'],
    },
    {
      category: 'Machine Learning',
      icon: 'fi-rr-artificial-intelligence',
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
      icon: 'fi-rr-language',
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
      icon: 'fi-rr-robot',
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
      icon: 'fi-rr-database',
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
      icon: 'fi-rr-data-transfer',
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
      icon: 'fi-rr-eye',
      skills: ['OpenCV', 'YOLOv8', 'Object Detection', 'MediaPipe'],
    },
  ];

  const skillIcons: Record<string, string> = {
    Python: 'fi-rr-code-simple',
    SQL: 'fi-rr-database',
    PyTorch: 'fi-rr-brain-circuit',
    TensorFlow: 'fi-rr-chart-network',
    'scikit-learn': 'fi-rr-algorithm',
    'Deep Learning': 'fi-rr-artificial-intelligence',
    'Transfer Learning': 'fi-rr-code-fork',
    'Model Evaluation': 'fi-rr-assessment',
    'Hugging Face Transformers': 'fi-rr-layers',
    'NLLB-200': 'fi-rr-language',
    OpenNMT: 'fi-rr-language',
    'Sentence Transformers': 'fi-rr-arrows-h-copy',
    LaBSE: 'fi-rr-network-analytic',
    Tokenization: 'fi-rr-token',
    'POS Tagging': 'fi-rr-tags',
    NER: 'fi-rr-search-alt',
    Chunking: 'fi-rr-objects-column',
    'Dependency Parsing': 'fi-rr-sitemap',
    'Discourse Annotation': 'fi-rr-text',
    'Morphological Segmentation': 'fi-rr-scissors',
    Summarization: 'fi-rr-align-left',
    Paraphrasing: 'fi-rr-arrows-repeat',
    PEFT: 'fi-rr-settings-sliders',
    LoRA: 'fi-rr-layers',
    QLoRA: 'fi-rr-layers',
    Quantization: 'fi-rr-binary',
    'Prompt Engineering': 'fi-rr-comment-code',
    Ollama: 'fi-rr-robot',
    'Qwen2.5-Coder': 'fi-rr-robot',
    NumPy: 'fi-rr-sigma',
    Pandas: 'fi-rr-table',
    'Hugging Face Datasets': 'fi-rr-folder-open',
    'Semantic Similarity': 'fi-rr-arrows-h-copy',
    'Cosine Similarity': 'fi-rr-chart-scatter',
    'Corpus Filtering': 'fi-rr-filter',
    BLEU: 'fi-rr-chart-histogram',
    chrF: 'fi-rr-chart-histogram',
    'Loss & Perplexity Analysis': 'fi-rr-chart-line-up-down',
    FastAPI: 'fi-rr-api',
    SQLAlchemy: 'fi-rr-database',
    PostgreSQL: 'fi-rr-database',
    'REST APIs': 'fi-rr-api',
    Docker: 'fi-rr-container-storage',
    'Docker Compose': 'fi-rr-layers',
    Judge0: 'fi-rr-terminal',
    Git: 'fi-rr-code-branch',
    Linux: 'fi-rr-terminal',
    Jupyter: 'fi-rr-notebook',
    'Google Colab': 'fi-rr-cloud-code',
    OpenCV: 'fi-rr-camera',
    YOLOv8: 'fi-rr-camera-viewfinder',
    'Object Detection': 'fi-rr-scanner-image',
    MediaPipe: 'fi-rr-hand',
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
                      <i className={`fi ${category.icon} tech-flaticon tech-flaticon--category`} aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">
                      {category.category}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => {
                      const skillIcon = skillIcons[skill];

                      return (
                        <motion.div
                          key={skill}
                          whileHover={{ scale: 1.05 }}
                          className="accent-chip flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
                        >
                          <i className={`fi ${skillIcon} tech-flaticon`} aria-hidden="true" />
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
