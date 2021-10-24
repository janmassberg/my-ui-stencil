import { Config } from "@stencil/core";
import { postcss } from "@stencil/postcss";
import { sass } from "@stencil/sass";

export const config: Config = {
  namespace: "my-ui",
  buildEs5: "prod",
  globalStyle: "src/themes/default.scss",
  plugins: [
    postcss(),
    sass(),
    /*
    sass({
      injectGlobalPaths: ["src/themes/default.scss"],
    }),
     */
  ],
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
