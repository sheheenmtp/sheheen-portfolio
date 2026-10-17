/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional override for the contact endpoint (defaults to /api/contact). */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
