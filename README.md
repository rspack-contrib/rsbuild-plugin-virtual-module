# rsbuild-plugin-virtual-module

Example plugin for Rsbuild.

<p>
  <a href="https://npmjs.com/package/rsbuild-plugin-virtual-module">
   <img src="https://img.shields.io/npm/v/rsbuild-plugin-virtual-module?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/rsbuild-plugin-virtual-module?minimal=true"><img src="https://img.shields.io/npm/dm/rsbuild-plugin-virtual-module.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

## Usage

Install:

```bash
npm add rsbuild-plugin-virtual-module -D
```

Add plugin to your `rsbuild.config.ts`:

```ts
// rsbuild.config.ts
import { pluginVirtualModule } from "rsbuild-plugin-virtual-module";

export default {
  plugins: [pluginVirtualModule()],
};
```

## Options

### foo

Some description.

- Type: `string`
- Default: `undefined`
- Example:

```js
pluginVirtualModule({
  foo: "bar",
});
```

## License

[MIT](./LICENSE).
