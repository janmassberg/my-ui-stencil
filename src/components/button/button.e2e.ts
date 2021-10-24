import { newE2EPage } from "@stencil/core/testing";

describe("my-ui-button", () => {
  it("should have variant classNames and render button with aria-label attribute", async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<my-ui-button label="Label" kind="primary">Content</my-ui-button>',
    );
    const el = await page.find("my-ui-button");
    await page.waitForChanges();
    expect(el).toHaveClass("hydrated");
    expect(el).toMatchSnapshot();
  });
});
