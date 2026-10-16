import { hero } from '../content';

/**
 * Circular "let's talk" badge. English rotates on the ring; the Malayalam sits upright
 * in the centre because Malayalam conjuncts break apart when set along a curved path.
 */
export function TalkBadge() {
  const ring = `${hero.badgeEnglish} ✿ `.repeat(3);
  const [lineOne, lineTwo] = hero.badgeMalayalam;
  return (
    <a href="#contact" className="talk-badge" aria-label="Let's talk: jump to contact details">
      <svg viewBox="0 0 150 150" aria-hidden="true" focusable="false">
        <defs>
          <path id="talk-badge-circle" d="M75,75 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0" />
        </defs>
        <g className="talk-badge__ring">
          <text>
            <textPath href="#talk-badge-circle" textLength="372" lengthAdjust="spacing">
              {ring}
            </textPath>
          </text>
        </g>
        <g className="talk-badge__center" lang="ml">
          <text x="75" y="71" textAnchor="middle">
            {lineOne}
          </text>
          <text x="75" y="92" textAnchor="middle">
            {lineTwo}
          </text>
        </g>
      </svg>
    </a>
  );
}
