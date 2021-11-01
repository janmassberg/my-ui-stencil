import { newE2EPage } from "@stencil/core/testing";

describe("ui-button", () => {
  it("should set class names and aria-label attribute correctly", async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<ui-button label="Label" kind="primary">Content</ui-button>',
    );
    const el = await page.find("ui-button.hydrated");
    expect(el).toMatchSnapshot();
  });
});
