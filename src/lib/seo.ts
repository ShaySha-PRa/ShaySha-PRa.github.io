export interface HreflangLink {
  lang: 'zh-CN' | 'en' | 'x-default';
  href: string;
}

type SchemaContext = {
  '@context': 'https://schema.org';
};

export interface PersonStructuredData extends SchemaContext {
  '@type': 'Person';
  name: string;
  url: string;
  sameAs: string[];
}

export interface CreativeWorkStructuredData extends SchemaContext {
  '@type': 'CreativeWork';
  name: string;
  description: string;
  url: string;
}

export interface ArticleStructuredData extends SchemaContext {
  '@type': 'Article';
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
}

export type StructuredData =
  PersonStructuredData | CreativeWorkStructuredData | ArticleStructuredData;

export function buildArticleStructuredData(
  fields: Omit<ArticleStructuredData, '@context' | '@type'>,
): ArticleStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    ...fields,
  };
}

/** Keep JSON-LD inside a script element without allowing HTML to terminate it. */
export function serializeStructuredData(data: StructuredData): string {
  return JSON.stringify(data)
    .replaceAll('<', '\\u003C')
    .replaceAll('>', '\\u003E')
    .replaceAll('&', '\\u0026');
}

export function buildHreflangLinks(
  site: URL,
  zhPath: string,
  enPath: string,
): HreflangLink[] {
  return [
    { lang: 'zh-CN', href: new URL(zhPath, site).href },
    { lang: 'en', href: new URL(enPath, site).href },
    { lang: 'x-default', href: new URL(zhPath, site).href },
  ];
}
