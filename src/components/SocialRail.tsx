import { Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '../content';

const items = [
  { label: 'GitHub', href: profile.links.github, Icon: Github, external: true },
  { label: 'LinkedIn', href: profile.links.linkedin, Icon: Linkedin, external: true },
  { label: 'Email', href: `mailto:${profile.email}`, Icon: Mail, external: false },
];

/** Vertical social links pinned to the left edge on wide screens. */
export function SocialRail() {
  return (
    <nav className="social-rail" aria-label="Social profiles">
      <ul>
        {items.map(({ label, href, Icon, external }) => (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              title={label}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <Icon aria-hidden="true" strokeWidth={1.6} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
