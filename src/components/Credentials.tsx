import React from 'react';
import { motion } from 'motion/react';
import {
  Award,
  BadgeCheck,
  Brain,
  Briefcase,
  Code2,
  Database,
  ExternalLink,
  GraduationCap,
  Settings,
  ShieldCheck,
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
      verificationUrl: 'https://coursera.org/share/4598dafeedc050fe3c4d097668a96ca5',
    },
    {
      title: 'Generative AI: Introduction and Applications',
      issuer: 'IBM',
      category: 'Generative AI',
      icon: Brain,
      verificationUrl: 'https://coursera.org/share/606711336eacfb22bd1aba11129e47a9',
    },
    {
      title: 'Introduction to Artificial Intelligence (AI)',
      issuer: 'IBM',
      category: 'Artificial Intelligence',
      icon: Brain,
      verificationUrl: 'https://coursera.org/share/3266fa2b23c4475bcc1bbfb0c19245b6',
    },
    {
      title: 'AI Foundations for Business Specialization',
      issuer: 'IBM',
      category: 'Business AI',
      icon: Briefcase,
      verificationUrl: 'https://coursera.org/share/1968bc1cd55e460c208ac7a5d22af337',
    },
    {
      title: 'Python for Data Science, AI & Development',
      issuer: 'IBM',
      category: 'Python',
      icon: Code2,
      verificationUrl: 'https://coursera.org/share/6ba369bbe4c1393607ede83fb6838e76',
    },
    {
      title: 'PostgreSQL for Everybody Specialization',
      issuer: 'University of Michigan',
      category: 'PostgreSQL',
      icon: Database,
      verificationUrl: 'https://coursera.org/share/6d068dfd47c5ae8fe8aa17eef258af30',
    },
    {
      title: 'Google Cybersecurity Specialization',
      issuer: 'Google / Coursera',
      category: 'Cybersecurity',
      icon: ShieldCheck,
      verificationUrl: 'https://coursera.org/share/874206645a7bfde7908160b58b9f62fb',
    },
    {
      title: 'Tools for Data Science',
      issuer: 'IBM / Coursera',
      category: 'Data Science',
      icon: Database,
      verificationUrl: 'https://coursera.org/verify/0BX2136DCGZH',
    },
    {
      title: 'Tools of the Trade: Linux and SQL',
      issuer: 'Google / Coursera',
      category: 'Linux & SQL',
      icon: Settings,
      verificationUrl: 'https://coursera.org/verify/AT8EYQUUKTHE',
    },
    {
      title: 'SQL (Advanced)',
      issuer: 'HackerRank',
      category: 'SQL',
      icon: Database,
      certificateId: 'F8F80D286164',
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
            Education & Credentials
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
                    {'verificationUrl' in certification && certification.verificationUrl && (
                      <a
                        href={certification.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="certificate-link mt-4"
                        aria-label={`Verify ${certification.title} certificate`}
                      >
                        Verify certificate
                        <ExternalLink aria-hidden="true" />
                      </a>
                    )}
                    {'certificateId' in certification && certification.certificateId && (
                      <p className="section-copy mt-4 text-sm">
                        Certificate ID: {certification.certificateId}
                      </p>
                    )}
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
