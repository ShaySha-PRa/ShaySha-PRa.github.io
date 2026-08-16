import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site';

export const GET: APIRoute = async () => {
  const articles = await getCollection(
    'articles',
    ({ data }) => !data.draft && data.locale === 'zh',
  );

  return rss({
    title: `${SITE.name} · 技术文章`,
    description: SITE.descriptions.zh,
    site: SITE.url,
    items: articles.map(({ data }) => ({
      title: data.title,
      description: data.summary,
      pubDate: data.published,
      link: `/writing/${data.slug}/`,
    })),
  });
};
