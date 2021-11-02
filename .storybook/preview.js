import { setCustomElements } from "@storybook/web-components";
import { defineCustomElements } from "../dist/esm/loader";
import customElements from "../dist/custom-elements.json";
import '../dist/jx-ui/jx-ui.css';

defineCustomElements();
setCustomElements(customElements);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
