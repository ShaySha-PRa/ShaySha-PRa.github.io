import type { APIRoute } from 'astro';

const body = `User-agent: *
Allow: /
Sitemap: https://shaysha-pra.github.io/sitemap-index.xml
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
