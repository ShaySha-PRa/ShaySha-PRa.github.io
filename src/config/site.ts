export interface SiteContact {
  label: string;
  href: string;
  kind: 'profile' | 'website';
}

interface LocalizedMessage {
  zh: string;
  en: string;
}

const contacts: SiteContact[] = [
  { label: 'GitHub', href: 'https://github.com/ShaySha-PRa', kind: 'profile' },
];

export const SITE = {
  name: 'Junshu Sha',
  url: 'https://shaysha-pra.github.io',
  github: 'https://github.com/ShaySha-PRa',
  contacts,
  descriptions: {
    zh: 'Junshu Sha 的个人空间：软件项目、技术文章、摄影与生活记录。',
    en: 'Junshu Sha’s personal space for software projects, technical writing, photography, and life.',
  },
  positioning: {
    zh: 'AI 应用工程师 · Agent / RAG / Data Systems',
    en: 'AI Application Engineer · Agent / RAG / Data Systems',
  } satisfies LocalizedMessage,
  valueProposition: {
    zh: '将复杂知识、数据和业务流程构建为可验证、可部署的 AI 应用。',
    en: 'I turn complex knowledge, data, and business workflows into verifiable, deployable AI applications.',
  } satisfies LocalizedMessage,
  signature: 'Building useful systems, collecting curious ideas.',
  proof: {
    zh: [
      'LangGraph 工作流',
      'RAG / GraphRAG',
      'FastAPI / Next.js',
      'Docker Compose',
      '测试与验收边界',
    ],
    en: [
      'LangGraph workflows',
      'RAG / GraphRAG',
      'FastAPI / Next.js',
      'Docker Compose',
      'Testing and acceptance boundaries',
    ],
  },
  now: {
    date: '2026.08',
    zh: '正在整理 My Company Brain 的三条知识路径、来源追踪与真实资料验收边界。',
    en: 'Organizing My Company Brain’s three knowledge paths, source tracing, and acceptance boundaries for real-material validation.',
  },
  nav: {
    zh: {
      home: '首页',
      projects: '项目',
      writing: '文章',
      journal: '影像与生活',
      about: '关于',
      resume: '简历',
      contact: '联系',
    },
    en: {
      home: 'Home',
      projects: 'Projects',
      writing: 'Writing',
      journal: 'Journal',
      about: 'About',
      resume: 'Résumé',
      contact: 'Contact',
    },
  },
} as const;
