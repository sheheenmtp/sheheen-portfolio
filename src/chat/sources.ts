/**
 * Maps knowledge-base chunk ids (knowledge/*.md, see api/_data/embeddings.json) to
 * the page section that covers them. tests/chat-client.test.ts fails when a chunk
 * has no entry here, so add one whenever a `## ` section is added to knowledge/.
 */
import type { ChatSource } from './stream.ts';

export type SourceLink = { href: string; label: string };

const section = {
  about: { href: '#about', label: 'About' },
  path: { href: '#path', label: 'Experience & education' },
  skills: { href: '#skills', label: 'Skills' },
  certifications: { href: '#certifications', label: 'Certifications' },
  contact: { href: '#contact', label: 'Contact' },
  aiTutor: { href: '#ai-tutor-title', label: 'AI Tutor Platform' },
  linuxTutor: { href: '#linux-tutor-title', label: 'Linux Adaptive Tutor' },
  nmt: { href: '#nmt-title', label: 'English–Malayalam translation' },
  xogrid: { href: '#xogrid-title', label: 'XO Grid automation' },
  jobSearch: { href: '#job-search-title', label: 'Job search automation' },
  usv: { href: '#usv-title', label: 'Autonomous USV' },
  gestureSync: { href: '#gesture-sync-title', label: 'GestureSync' },
} satisfies Record<string, SourceLink>;

export const sourceAnchors: Record<string, SourceLink> = {
  'education/b-tech-in-information-technology-college-of-engineering': section.path,
  'education/diploma-in-mechanical-engineering-swami-nithyananda-polytechnic': section.path,
  'education/professional-certificates-and-specialisations': section.certifications,
  'education/individual-online-courses': section.certifications,

  'experience/icfoss-ai-engineer-overview': section.path,
  'experience/icfoss-ai-tutor-backend-engineering': section.aiTutor,
  'experience/icfoss-malayalam-nlp-and-machine-translation-data-engineering': section.nmt,
  'experience/icfoss-live-bhashini-ai-deployment-at-vision-2031': section.path,
  'experience/xogrid-technical-consultant-remote-contract': section.xogrid,
  'experience/techmaghi-python-full-stack-development-internship-short-course': section.path,

  'faq/what-roles-is-sheheen-looking-for': section.contact,
  'faq/is-sheheen-available-now-and-what-is-his-visa-status': section.contact,
  'faq/what-are-sheheen-s-salary-expectations': section.contact,
  'faq/where-is-sheheen-based-and-is-he-open-to-relocation-or-remote': section.contact,
  'faq/is-sheheen-open-to-freelance-or-contract-work': section.contact,
  'faq/how-much-experience-does-sheheen-have': section.path,
  'faq/has-sheheen-worked-with-llms-in-production': section.aiTutor,
  'faq/has-sheheen-fine-tuned-or-trained-models': section.nmt,
  'faq/what-is-sheheen-s-strongest-technical-stack': section.skills,
  'faq/what-did-sheheen-do-at-icfoss': section.path,
  'faq/what-did-sheheen-build-for-xogrid': section.xogrid,
  'faq/does-sheheen-have-workflow-automation-experience': section.jobSearch,
  'faq/can-sheheen-work-on-customer-facing-or-forward-deployed-ai-work': section.path,
  'faq/does-sheheen-have-computer-vision-experience': section.usv,
  'faq/does-sheheen-have-experience-with-malayalam-or-low-resource': section.nmt,
  'faq/what-is-sheheen-s-educational-background': section.path,
  'faq/what-certifications-does-sheheen-hold': section.certifications,
  'faq/which-languages-does-sheheen-speak': section.about,
  'faq/how-can-i-contact-sheheen-or-see-his-work': section.contact,

  'profile/who-is-muhammed-sheheen-m-t-p': section.about,
  'profile/sheheen-s-current-status-and-the-roles-he-is-targeting': section.about,
  'profile/where-sheheen-is-based-his-work-authorisation-and-languages': section.about,
  'profile/how-to-contact-muhammed-sheheen-m-t-p': section.contact,

  'projects/ai-tutor-platform-adaptive-coding-practice-with-llm-hints': section.aiTutor,
  'projects/linux-adaptive-tutor-part-of-the-ai-tutor-work': section.linuxTutor,
  'projects/english-malayalam-neural-machine-translation-with-nllb-200': section.nmt,
  'projects/xo-grid-booking-management-client-automation-system': section.xogrid,
  'projects/ai-powered-job-search-automation-system-active-development': section.jobSearch,
  'projects/autonomous-usv-for-aquatic-waste-detection-b-tech-major-project': section.usv,
  'projects/gesturesync-gesture-and-voice-control-b-tech-mini-project': section.gestureSync,

  'skills/programming-languages-and-backend-development': section.skills,
  'skills/machine-learning-nlp-and-llm-skills': section.skills,
  'skills/data-automation-infrastructure-and-tools': section.skills,
};

/** Page links for a reply's sources, best match first, one per page section. */
export function sourceLinks(sources: ChatSource[]): SourceLink[] {
  const seen = new Set<string>();
  const links: SourceLink[] = [];
  for (const source of [...sources].sort((a, b) => b.score - a.score)) {
    const link = sourceAnchors[source.id];
    if (!link || seen.has(link.href)) continue;
    seen.add(link.href);
    links.push(link);
  }
  return links;
}
