import React from 'react';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Credentials } from './components/Credentials';
import { TechStack } from './components/TechStack';
import { Contact } from './components/Contact';
import { NeuralBackground } from './components/NeuralBackground';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <div className="portfolio-shell min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <NeuralBackground />
      <Navbar />
      <main id="main-content" className="portfolio-content relative z-10">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Credentials />
        <TechStack />
        <Contact />
      </main>
    </div>
  );
}
