import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { defineConfig } from '@rsbuild/core';
import { pluginVirtualModule } from 'rsbuild-plugin-virtual-module';

export default defineConfig({
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

          return `const x = ${JSON.stringify(res)};export default x;`;
        },
      },
    }),
  ],
});
