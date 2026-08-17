import { expect, type Page, test } from '@playwright/test';

const projectNames = [
  'My Company Brain',
  'GraphRAG 知识探索工作台',
  '合同审核多智能体工作流',
  'AI 数学动画生成工作台',
  'NL2SQL 数据分析工作台',
  '本地数据脱敏工作台',
];

async function expectArchitectureImage(
  page: Page,
  accessibleName: string,
  src: string,
  expectedSize: { width: number; height: number },
) {
  const architecture = page.getByRole('img', { name: accessibleName });
  await expect(architecture).toBeVisible();
  await expect(architecture).toHaveAttribute('src', src);
  const intrinsicSize = await architecture.evaluate((element) => {
    const image = element as HTMLImageElement;
    return {
      complete: image.complete,
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  });
  expect(intrinsicSize).toEqual({ complete: true, ...expectedSize });
}

test('Chinese project index lists exactly six ordered projects', async ({
  page,
}) => {
  await page.goto('/projects/');
  const cards = page.locator('[data-project-card]');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('h2')).toHaveText(projectNames);
});

test('My Company Brain is explicitly active', async ({ page }) => {
  await page.goto('/projects/my-company-brain/');
  await expect(page.getByText('持续开发中')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '限制与下一步' }),
  ).toBeVisible();
});

test('My Company Brain uses a loaded product preview', async ({ page }) => {
  for (const route of [
    '/projects/my-company-brain/',
    '/en/projects/my-company-brain/',
  ]) {
    await page.goto(route);
    const cover = page.getByRole('img', {
      name: 'My Company Brain cover',
    });
    await expect(cover).toBeVisible();

    const image = await cover.evaluate((element) => {
      const img = element as HTMLImageElement;
      return {
        complete: img.complete,
        width: img.naturalWidth,
        height: img.naturalHeight,
        src: img.currentSrc,
      };
    });

    expect(image.complete).toBe(true);
    expect(image.width).toBeGreaterThanOrEqual(1100);
    expect(image.height).toBeGreaterThanOrEqual(700);
    expect(image.src).not.toContain('.svg');
  }
});

test('My Company Brain presents scope, actions, product evidence, and technology in recruiter order', async ({
  page,
}) => {
  await page.goto('/projects/my-company-brain/');
  await expect(page.locator('.project-detail__category')).toHaveText(
    '企业知识平台 / RAG + Agent',
  );
  const overview = page.locator('.project-detail__overview');
  await expect(overview).toContainText('3 条知识路径');
  await expect(overview).toContainText('持续开发中');
  await expect(overview).toContainText('独立开发者');

  const actions = page.locator('.project-detail__actions');
  await expect(actions.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/ShaySha-PRa/my-company-brain',
  );
  await expect(
    actions.getByRole('link', { name: '查看验证证据' }),
  ).toHaveAttribute('href', '#validation');

  const sequence = await page
    .locator(
      '.project-detail__overview, .project-detail__actions, .project-detail__cover, .project-detail__technology',
    )
    .evaluateAll((nodes) => nodes.map((node) => node.className));
  expect(sequence).toEqual([
    'project-detail__overview',
    'project-detail__actions',
    'project-detail__cover',
    'project-detail__technology',
  ]);
});

test('My Company Brain case study exposes the approved workflow, architecture, and validation matrix', async ({
  page,
}) => {
  await page.goto('/projects/my-company-brain/');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText([
    '用户如何使用它',
    '系统架构',
    '三个关键技术决策',
    '当前验证状态',
    '限制与下一步',
  ]);
  await expect(page.locator('[data-project-flow] li')).toHaveText([
    '创建知识源',
    '导入资料',
    '发起查询',
    '查看回答与来源',
  ]);

  await expectArchitectureImage(
    page,
    'My Company Brain 系统架构：Web 经统一 API 进入 Agent Gateway，并连接三条知识路径',
    '/projects/my-company-brain-architecture.svg',
    { width: 1400, height: 820 },
  );

  const validation = page.locator('#validation');
  await expect(validation).toBeVisible();
  await expect(validation.locator('tbody tr')).toHaveCount(5);
  await expect(validation.getByRole('rowheader')).toHaveCount(5);
  await expect(validation).toContainText('88 项 Bun + 15 项 Python');
  await expect(validation).toContainText('8 个常驻服务健康');
  await expect(validation).toContainText('待完成');
  await expect(validation).toContainText('未声明');
});

test('English My Company Brain case study loads the approved architecture SVG', async ({
  page,
}) => {
  await page.goto('/en/projects/my-company-brain/');
  await expectArchitectureImage(
    page,
    'My Company Brain architecture: Web enters the Agent Gateway through a unified API and connects to three knowledge paths',
    '/projects/my-company-brain-architecture.svg',
    { width: 1400, height: 820 },
  );
});

test('GraphRAGAgent case study exposes bilingual workflow and evidence', async ({
  page,
}) => {
  const routes = [
    {
      path: '/projects/graphrag-agent/',
      title: 'GraphRAG 知识探索工作台',
      category: 'AI 知识系统',
      scope: '全栈 GraphRAG 工作台',
      flow: [
        '上传文档',
        '解析并建立索引',
        '探索知识图谱',
        '发起追问并查看回答',
      ],
    },
    {
      path: '/en/projects/graphrag-agent/',
      title: 'GraphRAGAgent',
      category: 'AI Knowledge Systems',
      scope: 'Full-stack GraphRAG workspace',
      flow: [
        'Upload a document',
        'Parse and index it',
        'Explore the knowledge graph',
        'Ask a follow-up and inspect the answer',
      ],
    },
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      route.title,
    );
    await expect(page.locator('.project-detail__category')).toHaveText(
      route.category,
    );
    await expect(page.locator('.project-detail__overview')).toContainText(
      route.scope,
    );
    await expect(page.locator('[data-project-flow] li')).toHaveText(route.flow);
    await expect(page.locator('.project-evidence')).toHaveCount(2);
    await expect(page.locator('#validation')).toBeVisible();
    await expectArchitectureImage(
      page,
      route.path.startsWith('/en/')
        ? 'GraphRAGAgent architecture: the React workspace uses FastAPI to connect indexing, graph, vector retrieval, and Q&A paths'
        : 'GraphRAG 知识探索工作台系统架构：React 工作台通过 FastAPI 连接索引、图谱、向量检索和问答路径',
      '/projects/graphrag-agent-architecture.svg',
      { width: 1400, height: 760 },
    );
  }
});

test('Agent Teams case study exposes bilingual workflow and evidence', async ({
  page,
}) => {
  const routes = [
    {
      path: '/projects/agent-teams-project/',
      title: '合同审核多智能体工作流',
      category: 'AI 工作流',
      scope: '合同审核 MVP',
      flow: ['上传合同', '核验字段', '人工处理风险', '查看 JSON 报告'],
      alt: '合同审核多智能体工作流系统架构：React 工作台通过 FastAPI 连接字段提取、风险路由、人工决策和报告流',
    },
    {
      path: '/en/projects/agent-teams-project/',
      title: 'Agent Teams Project',
      category: 'AI Workflow',
      scope: 'Contract-review MVP',
      flow: [
        'Upload a contract',
        'Review extracted fields',
        'Handle routed risks',
        'Inspect the JSON report',
      ],
      alt: 'Agent Teams Project architecture: the React workspace uses FastAPI for field extraction, risk routing, human decisions, and report streaming',
    },
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      route.title,
    );
    await expect(page.locator('.project-detail__category')).toHaveText(
      route.category,
    );
    await expect(page.locator('.project-detail__overview')).toContainText(
      route.scope,
    );
    await expect(page.locator('[data-project-flow] li')).toHaveText(route.flow);
    await expect(page.locator('.project-evidence')).toHaveCount(2);
    await expect(page.locator('#validation')).toBeVisible();
    await expectArchitectureImage(
      page,
      route.alt,
      '/projects/agent-teams-project-architecture.svg',
      { width: 1400, height: 760 },
    );
  }
});

test('Manim Project case study exposes bilingual workflow and evidence', async ({
  page,
}) => {
  const routes = [
    {
      path: '/projects/manim-project/',
      title: 'AI 数学动画生成工作台',
      category: '应用型 AI',
      scope: '安全媒体生成流水线',
      flow: ['输入教学需求', '生成结构化计划', '预览与检查', '交付最终产物'],
      alt: 'AI 数学动画生成工作台系统架构：Next.js 工作台通过 FastAPI 和 Redis 调度隔离 Manim 渲染与质量报告',
    },
    {
      path: '/en/projects/manim-project/',
      title: 'Manim Project',
      category: 'Applied AI',
      scope: 'Secure media generation pipeline',
      flow: [
        'Enter a teaching request',
        'Generate a structured plan',
        'Preview and inspect',
        'Deliver the final artifact',
      ],
      alt: 'Manim Project architecture: the Next.js workbench uses FastAPI and Redis to schedule isolated Manim rendering and quality reports',
    },
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      route.title,
    );
    await expect(page.locator('.project-detail__category')).toHaveText(
      route.category,
    );
    await expect(page.locator('.project-detail__overview')).toContainText(
      route.scope,
    );
    await expect(page.locator('[data-project-flow] li')).toHaveText(route.flow);
    await expect(page.locator('.project-evidence')).toHaveCount(2);
    await expect(page.locator('#validation')).toBeVisible();
    await expectArchitectureImage(
      page,
      route.alt,
      '/projects/manim-project-architecture.svg',
      { width: 1400, height: 760 },
    );
  }
});

test('SQLAgent case study exposes bilingual workflow and evidence', async ({
  page,
}) => {
  const routes = [
    {
      path: '/projects/sql-agent/',
      title: 'NL2SQL 数据分析工作台',
      category: '数据平台',
      scope: '全栈 NL2SQL 助手',
      flow: [
        '输入自然语言问题',
        '检索上下文并生成 SQL',
        '验证并执行查询',
        '查看表格、图表与回答',
      ],
      alt: 'NL2SQL 数据分析工作台系统架构：React 工作台通过 FastAPI 调度 NL2SQL Agent、向量检索、MySQL 查询和 SSE 结果',
    },
    {
      path: '/en/projects/sql-agent/',
      title: 'SQLAgent',
      category: 'Data Platform',
      scope: 'Full-stack NL2SQL assistant',
      flow: [
        'Enter a natural-language question',
        'Retrieve context and generate SQL',
        'Validate and execute the query',
        'Inspect the table, chart, and answer',
      ],
      alt: 'SQLAgent architecture: the React workspace uses FastAPI to orchestrate an NL2SQL agent, vector retrieval, MySQL queries, and SSE results',
    },
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      route.title,
    );
    await expect(page.locator('.project-detail__category')).toHaveText(
      route.category,
    );
    await expect(page.locator('.project-detail__overview')).toContainText(
      route.scope,
    );
    await expect(page.locator('[data-project-flow] li')).toHaveText(route.flow);
    await expect(page.locator('.project-evidence')).toHaveCount(2);
    await expect(page.locator('#validation')).toBeVisible();
    await expectArchitectureImage(
      page,
      route.alt,
      '/projects/sql-agent-architecture.svg',
      { width: 1400, height: 760 },
    );
  }
});

test('ITA-Maskit case study exposes bilingual workflow and evidence', async ({
  page,
}) => {
  const routes = [
    {
      path: '/projects/ita-maskit/',
      title: '本地数据脱敏工作台',
      category: '数据隐私',
      scope: 'CLI + Windows 桌面应用',
      flow: [
        '选择文件、规则集和可选人员数据',
        '预验证命中而不写出结果',
        '在本地执行遮盖或确定性伪名化',
        '查看统计、输出路径和审计日志',
      ],
      alt: '本地数据脱敏工作台系统架构：CLI 与 Windows GUI 通过规则校验进入表格和文本引擎，经过遮盖或伪名化后输出统计与审计日志',
    },
    {
      path: '/en/projects/ita-maskit/',
      title: 'ITA-Maskit',
      category: 'Data Privacy',
      scope: 'CLI + Windows desktop app',
      flow: [
        'Select files, a rule set, and optional personnel data',
        'Preview matches without writing output',
        'Execute masking or deterministic pseudonymization locally',
        'Inspect statistics, output paths, and the audit log',
      ],
      alt: 'ITA-Maskit architecture: the CLI and Windows GUI validate rules, route files through table and text engines, mask or pseudonymize values, and emit statistics and audit logs',
    },
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      route.title,
    );
    await expect(page.locator('.project-detail__category')).toHaveText(
      route.category,
    );
    await expect(page.locator('.project-detail__overview')).toContainText(
      route.scope,
    );
    await expect(page.locator('[data-project-flow] li')).toHaveText(route.flow);
    await expect(page.locator('.project-evidence')).toHaveCount(2);
    await expect(page.locator('#validation')).toBeVisible();
    await expectArchitectureImage(
      page,
      route.alt,
      '/projects/ita-maskit-architecture.svg',
      { width: 1400, height: 760 },
    );
  }
});

test('all five bilingual case studies load real cover and evidence images', async ({
  page,
}) => {
  const routes = [
    '/projects/graphrag-agent/',
    '/projects/agent-teams-project/',
    '/projects/manim-project/',
    '/projects/sql-agent/',
    '/projects/ita-maskit/',
    '/en/projects/graphrag-agent/',
    '/en/projects/agent-teams-project/',
    '/en/projects/manim-project/',
    '/en/projects/sql-agent/',
    '/en/projects/ita-maskit/',
  ];

  for (const route of routes) {
    await page.goto(route);
    const cover = page.locator('.project-detail__cover img');
    await expect(cover).toBeVisible();
    await expect(cover).not.toHaveAttribute('src', /\.svg(?:$|\?)/);
    await expect
      .poll(() =>
        cover.evaluate((element) => {
          const image = element as HTMLImageElement;
          return image.complete && image.naturalWidth > 0;
        }),
      )
      .toBe(true);

    const evidence = page.locator('.project-evidence img');
    await expect(evidence).toHaveCount(2);
    for (const image of await evidence.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((element) => {
            const image = element as HTMLImageElement;
            return image.complete && image.naturalWidth > 0;
          }),
        )
        .toBe(true);
    }
    const evidenceState = await evidence.evaluateAll((elements) =>
      elements.map((element) => {
        const image = element as HTMLImageElement;
        return {
          complete: image.complete,
          width: image.naturalWidth,
          height: image.naturalHeight,
          src: image.currentSrc,
        };
      }),
    );
    expect(evidenceState).toHaveLength(2);
    for (const image of evidenceState) {
      expect(image.complete).toBe(true);
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
      expect(image.src).not.toMatch(/\.svg(?:$|\?)/);
    }
  }
});

test('mobile case study contains wide architecture within its own scroller', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium');
  const routes = [
    '/projects/graphrag-agent/',
    '/projects/agent-teams-project/',
    '/projects/manim-project/',
    '/projects/sql-agent/',
    '/projects/ita-maskit/',
    '/en/projects/graphrag-agent/',
    '/en/projects/agent-teams-project/',
    '/en/projects/manim-project/',
    '/en/projects/sql-agent/',
    '/en/projects/ita-maskit/',
  ];

  for (const route of routes) {
    await page.goto(route);
    const dimensions = await page.evaluate(() => {
      const root = document.documentElement;
      const scroller = document.querySelector<HTMLElement>(
        '[data-project-architecture-scroller]',
      );
      if (!scroller) {
        return null;
      }
      scroller.scrollLeft = 0;
      const left = scroller.scrollLeft;
      scroller.scrollLeft = scroller.scrollWidth;
      const right = scroller.scrollLeft;
      return {
        pageWidth: root.scrollWidth,
        viewportWidth: root.clientWidth,
        scrollerWidth: scroller.scrollWidth,
        scrollerViewport: scroller.clientWidth,
        left,
        right,
        maxScrollLeft: scroller.scrollWidth - scroller.clientWidth,
      };
    });
    expect(dimensions).not.toBeNull();
    expect(dimensions?.pageWidth).toBeLessThanOrEqual(
      dimensions?.viewportWidth ?? 0,
    );
    expect(dimensions?.scrollerWidth).toBeGreaterThan(
      dimensions?.scrollerViewport ?? 0,
    );
    expect(dimensions?.left).toBe(0);
    expect(dimensions?.right).toBe(dimensions?.maxScrollLeft);
    expect(dimensions?.right).toBeGreaterThan(0);
  }
});

test('English project route is available', async ({ page }) => {
  await page.goto('/en/projects/graphrag-agent/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'GraphRAGAgent',
  );
});
