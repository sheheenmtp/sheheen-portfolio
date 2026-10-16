import { hero, profile } from '../content';
import { ButtonLink } from './ui/button';
import { HandLine } from './ui/HandLine';
import { Todo } from './ui/Todo';
import { TalkBadge } from './TalkBadge';
import portrait from '../sheheen.webp';

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <h1 id="hero-title" className="hero__title">
          <span className="hero__hello">{hero.hello}</span>{' '}
          <span className="hero__headline">{hero.headline}</span>
        </h1>
        <p className="hero__lede">{hero.lede}</p>
        <div className="hero__actions">
          <ButtonLink href="#work">See my work</ButtonLink>
          <ButtonLink variant="text" href={profile.links.resume} target="_blank" rel="noopener noreferrer">
            Résumé (PDF)
          </ButtonLink>
        </div>
      </div>

      <div className="hero__art">
        <div className="hero__blob hero__blob--sand" aria-hidden="true" />
        <div className="hero__blob hero__blob--water" aria-hidden="true" />
        <figure className="hero__arch">
          {/* TODO(Sheheen): replace with a black-and-white cutout (transparent PNG/WebP) so the
              line can loop in front of and behind you. Until then the photo is greyed with CSS. */}
          <img
            src={portrait}
            alt={`Portrait of ${profile.name}`}
            width={720}
            height={720}
            fetchPriority="high"
            decoding="async"
          />
        </figure>
        <HandLine variant="portrait-loop" className="hero__loop" />
        <p className="hero__note">
          {hero.note} <span aria-hidden="true">↗</span>
        </p>
        <TalkBadge />
        <Todo className="hero__todo">swap in a black-and-white cutout portrait</Todo>
      </div>
    </section>
  );
}
