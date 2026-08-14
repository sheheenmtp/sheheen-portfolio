import React from 'react';
import { motion } from 'motion/react';
import {
  Award,
  BadgeCheck,
  Brain,
  Briefcase,
  Code2,
  Database,
  GraduationCap,
  Settings,
  Sparkles,
} from 'lucide-react';
import { reveal } from '../lib/motion';

export function Credentials() {
  const education = [
    {
      title: 'B.Tech in Information Technology',
      institution: 'College of Engineering Thalassery',
      location: 'Kerala, India',
      icon: GraduationCap,
    },
    {
      title: 'Diploma in Mechanical Engineering',
      institution: 'Swami Nithyananda Polytechnic College',
      location: 'Kanhangad, Kerala, India',
      icon: Settings,
    },
  ];

  const certifications = [
    {
      title: 'Generative AI: Prompt Engineering Basics',
      issuer: 'IBM',
      category: 'Prompt Engineering',
      icon: Sparkles,
    },
    {
      title: 'Generative AI: Introduction and Applications',
      issuer: 'IBM',
      category: 'Generative AI',
      icon: Brain,
    },
    {
      title: 'Introduction to Artificial Intelligence',
      issuer: 'IBM',
      category: 'Artificial Intelligence',
      icon: Brain,
    },
    {
      title: 'AI Foundations for Business Specialization',
      issuer: 'IBM',
      category: 'Business AI',
      icon: Briefcase,
    },
    {
      title: 'Python for Data Science, AI and Development',
      issuer: 'IBM',
      category: 'Python',
      icon: Code2,
    },
    {
      title: 'PostgreSQL for Everybody Specialization',
      issuer: 'University of Michigan',
      category: 'PostgreSQL',
      icon: Database,
    },
  ];

  return (
    <section id="credentials" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          {...reveal()}
          className="text-center mb-16"
        >
          <h2 className="section-title text-4xl md:text-5xl font-bold">
            Education & Certifications
          </h2>
          <p className="section-copy text-lg">
            Academic foundations and continued learning in AI, data, and engineering
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {education.map((item, index) => (
            <motion.div
              key={item.title}
              {...reveal(index * 0.08)}
              whileHover={{ y: -4 }}
              className="surface-card h-full border p-6 transition-all duration-300"
            >
              <div className="flex items-start">
                <div className="p-2 bg-blue-500/20 rounded-full mr-4">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-blue-400 text-sm md:text-base">{item.institution}</p>
                  <p className="text-blue-300 text-sm mb-3">{item.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div>
          <motion.div
            {...reveal(0.12)}
            className="text-center mb-8"
          >
            <div className="accent-chip inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm mb-4">
              <Award className="w-4 h-4" />
              <span>{certifications.length} Credentials</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Professional Certifications</h3>
            <p className="section-copy text-lg max-w-2xl mx-auto">
              Continued learning across generative AI, prompt engineering, Python, and data systems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {certifications.map((certification, index) => (
              <motion.article
                key={certification.title}
                {...reveal(index * 0.08)}
                whileHover={{ y: -5, scale: 1.02 }}
                className="surface-card h-full border p-6 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="accent-icon p-2 rounded-full">
                    <certification.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="accent-chip inline-flex px-3 py-1 rounded-full text-sm mb-3">
                      {certification.category}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3">{certification.title}</h4>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <BadgeCheck className="w-5 h-5 text-blue-400" />
                      <span>Issued by {certification.issuer}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
