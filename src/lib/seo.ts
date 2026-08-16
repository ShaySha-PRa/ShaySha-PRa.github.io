export interface HreflangLink {
  lang: 'zh-CN' | 'en' | 'x-default';
  href: string;
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
