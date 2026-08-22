import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Skills', href: '#tech-stack', id: 'tech-stack' },
  { label: 'Education', href: '#credentials', id: 'credentials' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const sections = ['home', ...navItems.map((item) => item.id)]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection?.target.id) {
          setActiveSection(visibleSection.target.id);
        }
      },
      { rootMargin: '-24% 0px -58% 0px', threshold: [0, 0.1, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const navLinkClass = (id: string) =>
    `nav-link${activeSection === id ? ' nav-link--active' : ''}`;

  return (
    <header className={`site-header${isScrolled ? ' site-header--scrolled' : ''}`}>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#home" className="site-brand" aria-label="Muhammed Sheheen — home">
          <span aria-hidden="true">MS</span>
          <span className="site-brand__name">Muhammed Sheheen</span>
        </a>

        <div className="nav-links" aria-label="Portfolio sections">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={navLinkClass(item.id)}
              aria-current={activeSection === item.id ? 'location' : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <ThemeToggle />
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mobile-nav"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={navLinkClass(item.id)}
                aria-current={activeSection === item.id ? 'location' : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
