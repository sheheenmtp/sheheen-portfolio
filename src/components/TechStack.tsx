import { skills } from '../content';
import { HandLine } from './ui/HandLine';

export function TechStack() {
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="section__head reveal">
        <h2 id="skills-title" className="section__title">
          Skills
        </h2>
        <HandLine variant="underline" className="section__underline" />
      </div>
      <div className="skills__grid reveal">
        {skills.map((group) => (
          <div key={group.group} className="skills__group">
            <h3 className="skills__heading">{group.group}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
