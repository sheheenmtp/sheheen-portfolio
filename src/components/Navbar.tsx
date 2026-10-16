import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navItems, profile } from '../content';

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary">
        <a href="#top" className="site-nav__brand" aria-label={`${profile.name}, back to top`}>
          {profile.name}
        </a>
        <button
          type="button"
          className="site-nav__toggle"
          aria-expanded={open}
          aria-controls="site-nav-links"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <ul id="site-nav-links" className={open ? 'site-nav__links is-open' : 'site-nav__links'}>
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href={profile.links.resume} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              Résumé
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
