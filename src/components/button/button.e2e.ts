import { newE2EPage } from "@stencil/core/testing";

describe("my-button", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent('<my-button label="Label">Content</my-button>');
    const el = await page.find("my-button");
    expect(el).toHaveClass("hydrated");
    expect(el).toMatchSnapshot();
  });
});
