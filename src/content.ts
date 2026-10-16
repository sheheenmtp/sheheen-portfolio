/*
 * All portfolio copy lives here, sourced from Sheheen's CV, ICFOSS experience
 * certificate and public GitHub / Hugging Face profiles.
 * Do not add projects, metrics, clients or roles that are not real.
 * Anything marked `todo` is rendered as a visible TODO note on the page.
 */

import aiTutorShot from './assets/ai-tutor-workspace.webp';
import linuxTutorShot from './assets/linux-tutor-lesson.webp';
import nmtDemo from './assets/nmt-demo.webp';

export const profile = {
  name: 'Muhammed Sheheen M T P',
  shortName: 'Sheheen',
  role: 'AI Engineer',
  location: 'Abu Dhabi, UAE',
  availability: 'Open to AI engineering roles',
  // TODO(Sheheen): the latest GitHub site and résumé spell this "muhamammedsheheen0"; the UAE CV
  // spells it "muhammedsheheen0". Confirm which inbox is real and keep only that one.
  email: 'muhammedsheheen0@gmail.com',
  phones: [
    { label: 'UAE', display: '+971 52 182 3134', href: 'tel:+971521823134' },
    { label: 'India', display: '+91 98950 57468', href: 'tel:+919895057468' },
  ],
  links: {
    github: 'https://github.com/sheheenmtp',
    linkedin: 'https://www.linkedin.com/in/sheheen-mtp/',
    huggingface: 'https://huggingface.co/Muhammed-sheheen',
    resume: '/Sheheen_Resume.pdf',
    site: 'https://sheheenmtp.vercel.app/',
  },
};

export const hero = {
  hello: "hi, I'm Sheheen",
  headline: 'I build the quiet machinery behind AI tools.',
  lede:
    'LLM backends for a coding tutor, a Malayalam translation model you can call over an API, and the scripts that run bookings for a workspace business. AI engineer, now based in Abu Dhabi.',
  note: 'open to AI engineering roles',
  badgeEnglish: "LET'S TALK",
  badgeMalayalam: ['നമുക്ക്', 'സംസാരിക്കാം'],
};

export const about = {
  heading: 'A short note',
  paragraphs: [
    'I started out with a diploma in mechanical engineering, moved into IT, and found the part I enjoy most: taking a model that works in a notebook and turning it into something people can use.',
    'During a year at ICFOSS in Thiruvananthapuram I built the backend of an AI coding tutor and an adaptive Linux course, tagged more than 200,000 Malayalam POS, chunk and NER entries, prepared fine-tuning data for Malayalam LLMs, and ran live speech recognition and translation for ministerial sessions at the VISION 2031 conference.',
    'On my own I fine-tuned NLLB-200 for English to Malayalam translation and served it through FastAPI. I also automated booking and client records for XOGRID with Google Apps Script. These days I am in Abu Dhabi, building an n8n job-search automation and looking for my next AI engineering role.',
  ],
  margin: [
    { text: 'mechanical → IT → AI', placement: 'top' },
    { text: 'കേരളം → അബുദാബി', malayalam: true, placement: 'bottom' },
  ],
};

export type Diagram = { steps: { title: string; detail: string }[]; note: string };

export type Project = {
  id: string;
  title: string;
  malayalam?: string;
  context: string;
  summary: string;
  stack: string[];
  status?: string;
  team?: string;
  links: { label: string; href: string }[];
  diagram?: Diagram;
  shot?: { src: string; alt: string; width: number; height: number; caption: string };
  note?: string;
  todo?: string;
};

export const projects: Project[] = [
  {
    id: 'ai-tutor',
    title: 'AI Tutor platform',
    context: 'ICFOSS',
    summary:
      'A coding-practice platform that runs learner code in a Judge0 sandbox and replies with feedback from a local LLM. Hint depth follows the learner’s level, and the next problem is chosen from their weak concepts, retry patterns and spaced practice.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Ollama (qwen2.5-coder:14b)', 'Judge0', 'Docker', 'React + Vite'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/sheheenmtp/AI_Tutor' }],
    diagram: {
      steps: [
        { title: 'Learner submits code', detail: 'React + Monaco editor' },
        { title: 'Judge0 sandbox', detail: 'multi-language execution' },
        { title: 'Ollama, qwen2.5-coder:14b', detail: 'prompt tuned to learner level' },
        { title: 'Feedback + next problem', detail: '15 REST endpoints on FastAPI' },
      ],
      note: 'learner state lives in PostgreSQL, so hint depth follows how you are doing',
    },
    shot: {
      src: aiTutorShot,
      alt: 'The PyTutor workspace: a beginner "Check Prime Number" problem with examples on the left and a Python editor with Check and Submit buttons on the right.',
      width: 1400,
      height: 724,
      caption: 'PyTutor: the problem on the left, the editor and Judge0 results on the right',
    },
  },
  {
    id: 'nmt',
    title: 'English to Malayalam translation',
    malayalam: 'ഇംഗ്ലീഷ് → മലയാളം',
    // TODO(Sheheen): the ICFOSS report (6.14) says fine-tuning there was study and pipeline prep only,
    // so this is labelled a personal project. Change it if the NLLB model was trained elsewhere.
    context: 'Personal project',
    summary:
      'Cleaned and aligned English–Malayalam parallel data, fine-tuned NLLB-200 Distilled 600M with LoRA and QLoRA, and scored it with BLEU and chrF. The adapter is merged back into the base model and exported to ONNX Runtime behind a small FastAPI service.',
    stack: ['Python', 'PyTorch', 'Hugging Face Transformers', 'NLLB-200', 'PEFT / LoRA', 'ONNX Runtime', 'FastAPI'],
    links: [{ label: 'Model on Hugging Face', href: 'https://huggingface.co/Muhammed-sheheen/NLLB_FINETUNIG' }],
    diagram: {
      steps: [
        { title: 'Parallel corpus', detail: 'normalised, deduplicated EN–ML pairs' },
        { title: 'NLLB-200 600M + LoRA', detail: 'parameter-efficient fine-tuning' },
        { title: 'BLEU and chrF', detail: 'translation-quality evaluation' },
        { title: 'ONNX Runtime + FastAPI', detail: 'local inference service' },
      ],
      note: 'the adapter is merged before export, so serving is one model file',
    },
    shot: {
      src: nmtDemo,
      alt: 'The translator web app turning "Kerala Khadi and Village Industries Board sell their khadi products in the market with a profit margin." into Malayalam, with beam size 4.',
      width: 1216,
      height: 750,
      caption: 'the local demo: one 23-token sentence in 1.7 s on CPU (int8), beam 4',
    },
    todo: 'Add your BLEU and chrF scores from the evaluation.',
  },
  {
    id: 'xogrid',
    title: 'XO Grid booking automation',
    context: 'XOGRID, technical consultant',
    summary:
      'Turned a workspace business’s booking process into Google Workspace workflows: client intake, seat and cabin allocation, client documents, monthly processing, renewal matching and payment-status tracking, on scheduled and edit triggers.',
    stack: ['Google Apps Script', 'JavaScript', 'Google Sheets', 'Forms', 'Drive'],
    links: [],
    note: 'runs on edit triggers and a monthly schedule',
    todo: 'Add a screenshot of the booking sheet with client names blurred.',
  },
  {
    id: 'linux-tutor',
    title: 'Linux adaptive tutor',
    context: 'ICFOSS',
    summary:
      'An AI-assisted Linux course with adaptive lesson difficulty, several explanation modes, progress tracking, sandboxed Bash execution and an “Ask teacher” assistant on every lesson. I worked on its UI, backend and database design and prepared its 240 course entries.',
    stack: ['FastAPI', 'PostgreSQL', 'Ollama', 'Judge0'],
    shot: {
      src: linuxTutorShot,
      alt: 'A Linux lesson, "Why Userspace Matters", with module progress in the sidebar and the Ask teacher chat panel open on the right.',
      width: 1400,
      height: 724,
      caption: 'a lesson with the Ask teacher panel open',
    },
    links: [],
  },
  {
    id: 'job-search',
    title: 'Job-search automation',
    context: 'Personal project',
    status: 'In progress',
    summary:
      'Self-hosted n8n and PostgreSQL workflows for job discovery, data extraction, verification and candidate–job matching. The discovery workflow runs today; extraction and SQL processing are still being built.',
    stack: ['n8n (self-hosted)', 'PostgreSQL', 'REST APIs', 'Webhooks'],
    links: [],
  },
  {
    id: 'usv',
    title: 'Autonomous boat for floating plastic',
    context: 'B.Tech final project',
    team: 'Team of four',
    summary:
      'A catamaran-style unmanned surface vehicle. A phone camera streams video to a laptop running YOLOv8, which spots floating plastic and sends steering commands to an ESP32 that drives the motors and collector.',
    stack: ['Python', 'YOLOv8', 'OpenCV', 'ESP32-WROOM-32', 'WebSocket'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/sheheenmtp/usv-debris-collection' }],
  },
  {
    id: 'gesture-sync',
    title: 'GestureSync',
    context: 'B.Tech mini project',
    team: 'Team of four',
    summary:
      'Hands-free desktop control: MediaPipe hand landmarks drive the mouse and volume, and voice commands launch and switch applications.',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'Speech Recognition'],
    links: [{ label: 'Code on GitHub (my fork)', href: 'https://github.com/sheheenmtp/Gesture_Sync' }],
  },
];

export type PathEntry = {
  period: string;
  title: string;
  place: string;
  location: string;
  points?: string[];
  current?: boolean;
};

export const path: PathEntry[] = [
  {
    period: 'Aug 2025 – Oct 2026',
    title: 'Technical Consultant',
    place: 'XOGRID',
    location: 'Google Workspace automation',
    points: [
      'Turned booking and operations requirements into Apps Script workflows across Sheets, Forms and Drive.',
      'Set up scheduled and edit-triggered scripts and fixed payment-cycle and date-boundary edge cases.',
    ],
    current: true,
  },
  {
    period: 'Aug 2025 – Aug 2026',
    title: 'AI Engineer',
    place: 'ICFOSS',
    location: 'Thiruvananthapuram, Kerala',
    points: [
      'Built and deployed the AI Tutor backend: 15 REST endpoints on FastAPI, PostgreSQL, SQLAlchemy and Docker.',
      'Integrated Ollama (qwen2.5-coder:14b) and Judge0 for adaptive hints and sandboxed code execution.',
      'Worked on the UI, backend and database of an Adaptive Linux Course and prepared its 240 course entries.',
      'Tagged more than 200,000 Malayalam POS, chunk and NER entries, and verified OCR and speech-transcription data for BHASHINI.',
      'Prepared LLM training data: 11,567 SFT entries, 100 DPO entries and 11,600 agglutination examples; validated 1,620 Malayalam root words.',
      'Ran live speech recognition and machine translation for ministerial sessions at VISION 2031 (Kerala State Planning Board).',
      'Studied LoRA, QLoRA and tokenizer design, and worked on LoRA / QLoRA fine-tuning pipelines for administrative data.',
    ],
  },
  {
    // TODO(Sheheen): the UAE CV says 2021 – 2025; the previous site said Sept 2022 (lateral entry). Confirm.
    period: '2022 – 2025',
    title: 'B.Tech, Information Technology',
    place: 'College of Engineering Thalassery',
    location: 'Kerala, lateral entry',
  },
  {
    period: '2018 – 2021',
    title: 'Diploma, Mechanical Engineering',
    place: 'Swami Nithyananda Polytechnic College',
    location: 'Kanhangad, Kerala',
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'LLMs and generative AI', items: ['LLM integration', 'Prompt engineering', 'Adaptive prompting', 'Ollama', 'Local inference', 'RAG', 'SFT and DPO data preparation'] },
  { group: 'Machine learning and NLP', items: ['PyTorch', 'Hugging Face Transformers', 'NLLB-200', 'PEFT / LoRA / QLoRA', 'OpenNMT', 'BLEU, chrF', 'scikit-learn'] },
  { group: 'Backend and data', items: ['Python', 'FastAPI', 'REST APIs', 'SQLAlchemy', 'PostgreSQL', 'SQL', 'Docker', 'ONNX Runtime', 'Judge0'] },
  { group: 'Automation', items: ['n8n', 'Google Apps Script', 'Google Workspace', 'Webhooks'] },
  { group: 'Computer vision', items: ['OpenCV', 'YOLOv8', 'MediaPipe'] },
  { group: 'Everyday tools', items: ['Git and GitHub', 'Linux', 'Jupyter', 'Google Colab', 'JavaScript'] },
];

export const certifications: { title: string; issuer: string; href?: string; id?: string }[] = [
  { title: 'Generative AI: Prompt Engineering Basics', issuer: 'IBM', href: 'https://coursera.org/share/4598dafeedc050fe3c4d097668a96ca5' },
  { title: 'Generative AI: Introduction and Applications', issuer: 'IBM', href: 'https://coursera.org/share/606711336eacfb22bd1aba11129e47a9' },
  { title: 'Introduction to Artificial Intelligence', issuer: 'IBM', href: 'https://coursera.org/share/3266fa2b23c4475bcc1bbfb0c19245b6' },
  { title: 'AI Foundations for Business Specialization', issuer: 'IBM', href: 'https://coursera.org/share/1968bc1cd55e460c208ac7a5d22af337' },
  { title: 'Python for Data Science, AI and Development', issuer: 'IBM', href: 'https://coursera.org/share/6ba369bbe4c1393607ede83fb6838e76' },
  { title: 'Tools for Data Science', issuer: 'IBM', href: 'https://coursera.org/verify/0BX2136DCGZH' },
  { title: 'PostgreSQL for Everybody Specialization', issuer: 'University of Michigan', href: 'https://coursera.org/share/6d068dfd47c5ae8fe8aa17eef258af30' },
  { title: 'Google Cybersecurity Specialization', issuer: 'Google', href: 'https://coursera.org/share/874206645a7bfde7908160b58b9f62fb' },
  { title: 'Tools of the Trade: Linux and SQL', issuer: 'Google', href: 'https://coursera.org/verify/AT8EYQUUKTHE' },
  { title: 'SQL (Advanced)', issuer: 'HackerRank', id: 'F8F80D286164' },
];

export const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'Path', href: '#path' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];
