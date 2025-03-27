import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import type { RsbuildPlugin, TransformHandler } from '@rsbuild/core';

interface PluginVirtualModuleOptions {
  virtualModules?: Record<string, TransformHandler>;
}

const PLUGIN_VIRTUAL_MODULE_NAME = 'rsbuild:virtual-module';

const pluginVirtualModule = (
  pluginOptions: PluginVirtualModuleOptions = {},
): RsbuildPlugin => ({
  name: PLUGIN_VIRTUAL_MODULE_NAME,
  async setup(api) {
    const TEMP_DIR = join(
      process.cwd(),
      'node_modules/.rsbuild-virtual-module',
    );
    const { virtualModules } = pluginOptions;
    const virtualFileAbsolutePaths: [string, string][] = Object.keys(
      virtualModules ?? {},
    ).map((i) => {
      let absolutePath = join(TEMP_DIR, i);
      if (!extname(absolutePath)) {
        absolutePath = `${absolutePath}.js`;
      }
      return [i, absolutePath];
    });

    api.onBeforeCreateCompiler(async () => {
      await mkdir(TEMP_DIR, { recursive: true });
      await Promise.all(
        virtualFileAbsolutePaths.map(([_, absolutePath]) =>
          writeFile(absolutePath, '', 'utf-8'),
        ),
      );
    });

    api.modifyBundlerChain((chain) => {
      chain.resolve.alias.merge(Object.fromEntries(virtualFileAbsolutePaths));
    });

    for (const [moduleName, absolutePath] of virtualFileAbsolutePaths) {
      const handler = virtualModules?.[moduleName];
      if (!handler) {
        continue;
      }
      api.transform({ test: absolutePath }, handler);
    }
  },
});

export { pluginVirtualModule, PLUGIN_VIRTUAL_MODULE_NAME };
export type { PluginVirtualModuleOptions };
