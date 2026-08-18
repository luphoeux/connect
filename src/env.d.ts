/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DATABASE_URL?: string;
  readonly FACEBOOK_PAGE_ID?: string;
  readonly FACEBOOK_ACCESS_TOKEN?: string;
  readonly PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
