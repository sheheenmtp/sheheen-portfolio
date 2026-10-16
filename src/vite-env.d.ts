/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the contact backend. When unset, the contact form is hidden. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
