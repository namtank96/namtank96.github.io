// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages 유저사이트로 배포하므로 루트에서 서빙됩니다.
  // 프로젝트 repo였다면 base: '/portfolio' 가 필요하고, 그 순간
  // 모든 내부 링크에 import.meta.env.BASE_URL 접두가 붙어야 합니다.
  // 유저사이트를 고른 이유가 이 버그 클래스를 통째로 없애기 위함이므로
  // base 는 추가하지 마세요.
  site: 'https://namtank96.github.io',
  integrations: [sitemap()],
});
