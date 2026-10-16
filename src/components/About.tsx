import { about } from '../content';
import { HandLine } from './ui/HandLine';

export function About() {
  return (
    <section id="about" className="section about reveal" aria-labelledby="about-title">
      <div className="section__head">
        <h2 id="about-title" className="section__title">
          {about.heading}
        </h2>
        <HandLine variant="underline" className="section__underline" />
      </div>
      <div className="about__body">
        <div className="about__letter">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="about__margin reveal-late" aria-label="Margin notes">
          {about.margin.map((note) => (
            <p
              key={note.text}
              className={note.malayalam ? 'margin-note margin-note--ml write-on' : 'margin-note write-on'}
              lang={note.malayalam ? 'ml' : undefined}
            >
              {note.text}
            </p>
          ))}
        </aside>
      </div>
    </section>
  );
}
