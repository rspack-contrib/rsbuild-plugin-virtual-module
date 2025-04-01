import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { createRsbuild } from '@rsbuild/core';
import { pluginVirtualModule } from 'rsbuild-plugin-virtual-module';
import { getRandomPort } from '../helper';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('should render page as expected', async ({ page }) => {
  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      plugins: [
        pluginVirtualModule({
          virtualModules: {
            'virtual-json-list': async () => {
              return 'export default {}';
            },
          },
        }),
      ],
      server: {
        port: getRandomPort(),
      },
    },
  });

  const { server, urls } = await rsbuild.startDevServer();

  await page.goto(urls[0]);
  expect(JSON.stringify(await page.evaluate('window.test'))).toMatchSnapshot();

  await server.close();
});

test('should build succeed', async ({ page }) => {
  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      plugins: [
        pluginVirtualModule({
          virtualModules: {
            'virtual-json-list': async ({ addDependency }) => {
              const jsonFolderPath = join(__dirname, 'json');
              const ls = await readdir(jsonFolderPath);
              const res: Record<string, unknown> = {};
              for (const file of ls) {
                if (file.endsWith('.json')) {
                  const jsonFilePath = join(jsonFolderPath, file);
                  const jsonContent = await readFile(jsonFilePath, 'utf-8');
                  addDependency(jsonFilePath);
                  res[file] = JSON.parse(jsonContent);
                }
              }

              return `export default ${JSON.stringify(res)};`;
            },
          },
        }),
      ],
    },
  });

  await rsbuild.build();
  const { server, urls } = await rsbuild.preview();

  await page.goto(urls[0]);
  expect(JSON.stringify(await page.evaluate('window.test'))).toMatchSnapshot();

  await server.close();
});
