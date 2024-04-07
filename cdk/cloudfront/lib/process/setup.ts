import * as childProcess from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as mustache from 'mustache';

export const compileBundles = ({ kvsId }: { kvsId: string }) => {
  const functionBasePath = path.relative(process.cwd(), 'function');
  const template = fs.readFileSync(
    path.resolve(functionBasePath, 'index.template.ts'),
    {
      encoding: 'utf-8',
    },
  );
  const handlerCode = mustache.render(template, { kvsID: kvsId });
  fs.writeFileSync(path.resolve(functionBasePath, 'index.ts'), handlerCode);

  const appBasePath = path.resolve(process.cwd(), '../../app');
  // biome-ignore lint/complexity/noForEach: <explanation>
  [functionBasePath, appBasePath].forEach((basePath) => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    fs.readdirSync(basePath, {
      withFileTypes: true,
    })
      .filter(
        (p) =>
          p.isFile() && (p.name.endsWith('.js') || p.name.endsWith('.d.ts')),
      )
      .map((p) => `${basePath}/${p.name}`)
      .forEach((file) => {
        if (fs.existsSync(file)) {
          fs.rmSync(file, {
            recursive: true,
          });
        }
      });

    // biome-ignore lint/complexity/noForEach: <explanation>
    ['pwd', 'pnpm install', 'pnpm build'].forEach((cmd) => {
      childProcess.execSync(cmd, {
        cwd: path.resolve(basePath),
        stdio: ['ignore', 'inherit', 'inherit'],
        env: { ...process.env },
        shell: process.env.SHELL ?? 'bash',
      });
    });
  });
};
