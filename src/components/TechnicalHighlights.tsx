import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Container, Database, Route, Workflow } from 'lucide-react';
import { reveal } from '../lib/motion';

const highlights = [
  { title: 'AI Applications', detail: 'LLM integration, prompt engineering, and local inference', icon: BrainCircuit },
  { title: 'Models & Pipelines', detail: 'Fine-tuning, evaluation, and data processing workflows', icon: Route },
  { title: 'Backend Engineering', detail: 'FastAPI services, REST APIs, and database integration', icon: Database },
  { title: 'AI Automation', detail: 'API integrations, webhooks, and multi-step workflows', icon: Workflow },
  { title: 'Deployment', detail: 'Dockerized services and practical AI infrastructure', icon: Container },
];

export function TechnicalHighlights() {
  return (
    <section id="highlights" className="technical-highlights py-16 px-6" aria-labelledby="highlights-title">
      <div className="max-w-6xl mx-auto">
        <motion.div {...reveal()} className="text-center mb-10">
          <h2 id="highlights-title" className="section-title text-3xl md:text-4xl font-bold">Engineering Capabilities</h2>
          <p className="section-copy max-w-2xl mx-auto">
            Practical work across the AI engineering lifecycle—from data and models to APIs, automation, and deployment.
          </p>
        </motion.div>
        <div className="technical-highlights-grid">
          {highlights.map((highlight, index) => (
            <motion.article key={highlight.title} {...reveal(index * 0.05)} whileHover={{ y: -4 }} className="surface-card technical-highlight-card border p-5">
              <highlight.icon className="w-5 h-5 text-blue-400 mb-3" aria-hidden="true" />
              <h3 className="text-white font-semibold mb-2">{highlight.title}</h3>
              <p className="section-copy text-sm leading-relaxed">{highlight.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
