import { hero, profile } from '../content';
import { ButtonLink } from './ui/button';
import { HandLine } from './ui/HandLine';
import { TalkBadge } from './TalkBadge';
import portrait from '../assets/portrait-cutout.webp';

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
        <div className="hero__arch" aria-hidden="true" />
        {/* The loop is drawn twice: behind the portrait, then the shoulder-and-arm stretch in front. */}
        <HandLine variant="portrait-loop" className="hero__loop hero__loop--back" />
        <img
          className="hero__portrait"
          src={portrait}
          alt={`Portrait of ${profile.name}`}
          width={720}
          height={1040}
          fetchPriority="high"
          decoding="async"
        />
        <HandLine variant="portrait-loop" className="hero__loop hero__loop--front" />
        <p className="hero__note">
          {hero.note} <span aria-hidden="true">↗</span>
        </p>
        <TalkBadge />
      </div>
    </section>
  );
}
