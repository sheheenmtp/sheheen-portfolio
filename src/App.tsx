import { About } from './components/About';
import { Contact } from './components/Contact';
import { Credentials } from './components/Credentials';
import { Experience } from './components/Experience';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Projects } from './components/Projects';
import { SocialRail } from './components/SocialRail';
import { TechStack } from './components/TechStack';
import { useReveal } from './hooks/useReveal';

export default function App() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <SocialRail />
      <main id="main-content" className="page">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <TechStack />
        <Credentials />
        <Contact />
      </main>
    </>
  );
}
