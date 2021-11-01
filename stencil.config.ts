import { Config } from "@stencil/core";
import { postcss } from "@stencil/postcss";
import { sass } from "@stencil/sass";
import { generateCustomElementsJson } from "./stencil.custom-elements-json";

export const config: Config = {
  namespace: "jx-ui",
  buildEs5: "prod",
  globalStyle: "src/themes/default.scss",
  plugins: [postcss(), sass()],
  devServer: {
    reloadStrategy: "hmr",
    openBrowser: false,
  },
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader",
    },
    {
      type: "dist-custom-elements-bundle",
    },
    {
      type: "docs-custom",
      generator: generateCustomElementsJson,
    },
    {
      type: "docs-readme",
    },
    {
      type: "docs-json",
      file: "./dist/components.json",
    },
    {
      type: "www",
      serviceWorker: null, // disable service workers
    },
  ],
};
