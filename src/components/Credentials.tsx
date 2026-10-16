import { ArrowUpRight } from 'lucide-react';
import { certifications } from '../content';

export function Credentials() {
  return (
    <section id="certifications" className="section certs reveal" aria-labelledby="certs-title">
      <h2 id="certs-title" className="certs__title">
        Certificates
      </h2>
      <ul className="certs__list">
        {certifications.map((cert) => (
          <li key={cert.title}>
            <span className="certs__name">{cert.title}</span>
            <span className="certs__issuer">{cert.issuer}</span>
            {cert.href ? (
              <a href={cert.href} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${cert.title}`}>
                Verify
                <ArrowUpRight aria-hidden="true" />
              </a>
            ) : (
              <span className="certs__id">ID {cert.id}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
