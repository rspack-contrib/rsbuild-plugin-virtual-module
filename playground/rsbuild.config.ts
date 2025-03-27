import { defineConfig } from '@rsbuild/core';
import { pluginVirtualModule } from '../src';

export default defineConfig({
  plugins: [pluginVirtualModule()],
});
