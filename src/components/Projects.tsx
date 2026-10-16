import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects, type Project, type Shot } from '../content';
import { HandLine } from './ui/HandLine';
import { Todo } from './ui/Todo';

function ProjectLinks({ project }: { project: Project }) {
  if (project.links.length === 0) return null;
  return (
    <ul className="project__links">
      {project.links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
            <ArrowUpRight aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function Screenshot({ shot, className }: { shot: Shot; className: string }) {
  return (
    <figure className={`${className} reveal-late`}>
      <a href={shot.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size screenshot: ${shot.caption}`}>
        <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
      </a>
      <figcaption className="write-on">{shot.caption}</figcaption>
    </figure>
  );
}

function Tags({ project }: { project: Project }) {
  const tags = [project.status, project.team].filter(Boolean);
  if (tags.length === 0) return null;
  return (
    <p className="project__tags">
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </p>
  );
}

function Spread({ project }: { project: Project }) {
  return (
    <article className="spread reveal" aria-labelledby={`${project.id}-title`}>
      <div className="spread__text">
        <p className="project__context">{project.context}</p>
        <h3 id={`${project.id}-title`} className="spread__title">
          {project.title}
          {project.malayalam && ' '}
          {project.malayalam && (
            <span className="spread__ml" lang="ml">
              {project.malayalam}
            </span>
          )}
        </h3>
        <p className="project__summary">{project.summary}</p>
        <p className="project__stack">
          <strong>Built with</strong> {project.stack.join(', ')}
        </p>
        <ProjectLinks project={project} />
      </div>
      {project.diagram && (
        <figure className="sheet reveal-late">
          <ol className="sheet__steps" aria-label={`How ${project.title} works`}>
            {project.diagram.steps.map((step, index) => (
              <li key={step.title} style={{ '--i': index } as CSSProperties}>
                <strong>{step.title}</strong>
                <span>{step.detail}</span>
              </li>
            ))}
          </ol>
          <figcaption className="sheet__note">{project.diagram.note}</figcaption>
          {project.todo && <Todo>{project.todo}</Todo>}
        </figure>
      )}
      {project.shots && (
        <div className={project.shots.length > 1 ? 'spread__shots spread__shots--pair' : 'spread__shots'}>
          {project.shots.map((shot) => (
            <Screenshot key={shot.src} shot={shot} className="spread__shot" />
          ))}
        </div>
      )}
    </article>
  );
}

function Entry({ project }: { project: Project }) {
  return (
    <article className="entry reveal" aria-labelledby={`${project.id}-title`}>
      <p className="project__context">{project.context}</p>
      <h3 id={`${project.id}-title`} className="entry__title">
        {project.title}
      </h3>
      <Tags project={project} />
      <p className="project__summary">{project.summary}</p>
      <p className="project__stack">
        <strong>Built with</strong> {project.stack.join(', ')}
      </p>
      {project.shots?.map((shot) => (
        <Screenshot key={shot.src} shot={shot} className="entry__shot" />
      ))}
      {project.note && <p className="margin-note entry__note write-on">{project.note}</p>}
      <ProjectLinks project={project} />
      {project.todo && <Todo>{project.todo}</Todo>}
    </article>
  );
}

export function Projects() {
  const spreads = projects.filter((project) => project.diagram);
  const entries = projects.filter((project) => !project.diagram);
  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="section__head reveal">
        <h2 id="work-title" className="section__title">
          Work
        </h2>
        <HandLine variant="underline" className="section__underline" />
        <p className="section__intro">
          Three pages from the notebook in detail, then the rest of what I have built.
        </p>
      </div>
      <div className="work__spreads">
        {spreads.map((project) => (
          <Spread key={project.id} project={project} />
        ))}
      </div>
      <div className="work__entries">
        {entries.map((project) => (
          <Entry key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
