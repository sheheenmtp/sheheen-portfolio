import { useRef } from 'react';
import { path } from '../content';
import { useTimelineProgress } from '../hooks/useTimelineProgress';
import { HandLine } from './ui/HandLine';

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  useTimelineProgress(listRef);
  return (
    <section id="path" className="section path" aria-labelledby="path-title">
      <div className="section__head reveal">
        <h2 id="path-title" className="section__title">
          Path
        </h2>
        <HandLine variant="underline" className="section__underline" />
      </div>
      <ol className="timeline" ref={listRef}>
        {path.map((entry) => (
          <li key={`${entry.place}-${entry.title}`} className={entry.current ? 'timeline__item is-current reveal' : 'timeline__item reveal'}>
            <p className="timeline__period">{entry.period}</p>
            <div className="timeline__body">
              <h3 className="timeline__title">
                {entry.title}, <span>{entry.place}</span>
              </h3>
              <p className="timeline__location">{entry.location}</p>
              {entry.points && (
                <ul className="timeline__points">
                  {entry.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
