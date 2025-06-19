import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import type { RsbuildPlugin, TransformHandler } from '@rsbuild/core';

type VirtualModules = Record<string, TransformHandler>;
interface PluginVirtualModuleOptions {
  /**
   * Generate virtual modules, where the key is the name of the virtual module and the value is `TransformHandler`. See [Rsbuild - api.transform](https://rsbuild.dev/plugins/dev/core#apitransform)
   */
  virtualModules?: VirtualModules;
  /**
   * The name of the virtual module folder under `node_modules`
   * @default '.rsbuild-virtual-module'
   */
  tempDir?: string;
}

const PLUGIN_VIRTUAL_MODULE_NAME = 'rsbuild:virtual-module';

const pluginVirtualModule = (
  pluginOptions: PluginVirtualModuleOptions = {},
): RsbuildPlugin => ({
  name: PLUGIN_VIRTUAL_MODULE_NAME,
  async setup(api) {
    const {
      virtualModules = {},
      tempDir: virtualFolderName = '.rsbuild-virtual-module',
    } = pluginOptions;
    const TEMP_DIR = join(
      api.context.rootPath,
      'node_modules',
      virtualFolderName,
    );

    const virtualFileAbsolutePaths: [string, string][] = Object.keys(
      virtualModules,
    ).map((i) => {
      let absolutePath = join(TEMP_DIR, i);
      if (!extname(absolutePath)) {
        absolutePath = `${absolutePath}.js`;
      }
      return [i, absolutePath];
    });

    // ensure the virtual module is transformed by swc to downgrade the syntax
    api.modifyRsbuildConfig((config) => {
      if (!config.source) {
        config.source = {};
      }
      config.source.include = [...(config.source.include || []), TEMP_DIR];
    });

    // 1. create TEMP_DIR under both rsbuild dev and build
    api.onBeforeCreateCompiler(async () => {
      await Promise.all(
        virtualFileAbsolutePaths.map(async ([_, absolutePath]) => {
          const dir = dirname(absolutePath);
          await mkdir(dir, { recursive: true });
          return writeFile(absolutePath, '', 'utf-8');
        }),
      );
    });

    // 2. add alias for virtual modules
    api.modifyBundlerChain((chain) => {
      chain.resolve.alias.merge(Object.fromEntries(virtualFileAbsolutePaths));
    });

    // 3. use loader to transform virtual modules
    for (const [moduleName, absolutePath] of virtualFileAbsolutePaths) {
      const handler = virtualModules[moduleName];
      if (!handler) {
        continue;
      }
      api.transform({ test: absolutePath }, handler);
    }
  },
});

export { pluginVirtualModule, PLUGIN_VIRTUAL_MODULE_NAME };
export type { PluginVirtualModuleOptions, VirtualModules };
