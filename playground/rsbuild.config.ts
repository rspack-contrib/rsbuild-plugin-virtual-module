import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { defineConfig } from '@rsbuild/core';
import { pluginVirtualModule } from 'rsbuild-plugin-virtual-module';

export default defineConfig({
  performance: {
    buildCache: true,
  },
  dev: {
    writeToDisk: true,
  },
  plugins: [
    pluginVirtualModule({
      virtualModules: {
        'virtual-json-list': async ({
          addDependency,
          addContextDependency,
        }) => {
          const jsonFolderPath = join(__dirname, 'json');
          const ls = await readdir(jsonFolderPath);
          addContextDependency(jsonFolderPath);

          const res: Record<string, unknown> = {};
          for (const file of ls) {
            if (file.endsWith('.json')) {
              const jsonFilePath = join(jsonFolderPath, file);
              const jsonContent = await readFile(jsonFilePath, 'utf-8');
              addDependency(jsonFilePath);
              res[file] = JSON.parse(jsonContent);
            }
          }

          return `export default ${JSON.stringify(res)}`;
        },
      },
    }),
  ],
});
