import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const root = path.resolve('src/content');
const collections = ['projects', 'articles', 'journal', 'profile', 'resume'];

async function markdownFiles(directory) {
  const entries = await fs
    .readdir(directory, { withFileTypes: true })
    .catch(() => []);
  const nested = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory()
        ? markdownFiles(target)
        : /\.mdx?$/.test(entry.name)
          ? [target]
          : [];
    }),
  );
  return nested.flat();
}

let invalid = false;
for (const collection of collections) {
  const seen = new Set();
  for (const file of await markdownFiles(path.join(root, collection))) {
    const { data } = matter(await fs.readFile(file, 'utf8'));
    const key = `${data.translationKey}/${data.locale}`;
    if (seen.has(key)) {
      console.error(`Duplicate localized content: ${collection}/${key}`);
      invalid = true;
    }
    seen.add(key);
  }
}
process.exitCode = invalid ? 1 : 0;
