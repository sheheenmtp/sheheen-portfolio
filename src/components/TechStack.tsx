import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { reveal } from '../lib/motion';

const coreSkills = ['Python', 'PyTorch', 'LLMs / Generative AI', 'FastAPI', 'Hugging Face', 'SQL', 'Docker'];

const techCategories = [
  { category: 'Programming & Data', icon: 'fi-rr-code-simple', skills: ['Python', 'SQL', 'C/C++', 'NumPy', 'Pandas'] },
  { category: 'AI / Machine Learning', icon: 'fi-rr-artificial-intelligence', skills: ['PyTorch', 'TensorFlow', 'scikit-learn', 'Hugging Face'] },
  { category: 'Generative AI / LLM', icon: 'fi-rr-robot', skills: ['LLMs', 'Prompt Engineering', 'RAG', 'Ollama', 'QLoRA', 'LoRA', 'Local LLM Inference'] },
  { category: 'Backend / AI Engineering', icon: 'fi-rr-data-transfer', skills: ['FastAPI', 'REST APIs', 'SQLAlchemy', 'PostgreSQL', 'Docker', 'Judge0'] },
  { category: 'Computer Vision', icon: 'fi-rr-eye', skills: ['OpenCV', 'YOLOv8', 'Object Detection', 'Image Processing', 'MediaPipe'] },
  { category: 'AI Automation / Workflow', icon: 'fi-rr-settings-sliders', skills: ['n8n', 'REST APIs', 'Webhooks', 'API Integration', 'Workflow Automation'], note: 'Basic hands-on experience' },
  { category: 'NLP / Machine Translation', icon: 'fi-rr-language', skills: ['NLP', 'NMT', 'NLLB', 'OpenNMT', 'Tokenization', 'Parallel Corpus Processing'] },
  { category: 'Data Visualization', icon: 'fi-rr-chart-histogram', skills: ['Matplotlib', 'Seaborn'] },
  { category: 'Developer / Research Tools', icon: 'fi-rr-terminal', skills: ['Git', 'GitHub', 'GitLab', 'Linux', 'Jupyter', 'Google Colab'] },
];

export function TechStack() {
  return (
    <section id="tech-stack" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...reveal()} className="text-center mb-12">
          <h2 className="section-title text-4xl md:text-5xl font-bold">Technical Skills</h2>
          <p className="section-copy text-lg">A categorized view of the tools I use across AI engineering and software delivery.</p>
        </motion.div>

        <motion.div {...reveal(0.05)} className="surface-card core-skills border p-6 mb-8">
          <p className="project-category mb-4">Core AI Engineering</p>
          <div className="flex flex-wrap gap-3">
            {coreSkills.map((skill) => <span key={skill} className="core-skill-chip">{skill}</span>)}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map((category, categoryIndex) => (
            <motion.div key={category.category} {...reveal(categoryIndex * 0.05)} whileHover={{ y: -4 }} className="h-full">
              <Card className="surface-card h-full transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="accent-icon p-2 rounded-full">
                      <i className={`fi ${category.icon} tech-flaticon tech-flaticon--category`} aria-hidden="true" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-white">{category.category}</CardTitle>
                      {category.note && <p className="section-copy text-xs mt-1">{category.note}</p>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <motion.span key={skill} whileHover={{ scale: 1.04 }} className="accent-chip px-3 py-1 rounded-full text-sm">{skill}</motion.span>
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
