/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MONETAG_ZONE_ID: string;
  readonly VITE_MONETAG_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
