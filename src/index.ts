import type { RsbuildPlugin } from '@rsbuild/core';

export type pluginVirtualModuleOptions = {
  foo?: string;
  bar?: boolean;
};

export const pluginVirtualModule = (
  options: pluginVirtualModuleOptions = {},
): RsbuildPlugin => ({
  name: 'plugin-example',

  setup() {
    console.log('Hello Rsbuild!', options);
  },
});
