import { newE2EPage } from "@stencil/core/testing";

const testMenuItemsFlat = [
  {
    name: "item-1",
    label: "Menu Item 1",
  },
  {
    name: "item-2",
    label: "Menu Item 2",
  },
  {
    name: "item-3",
    label: "Menu Item 3",
  },
];

const testMenuItemsNested = [
  {
    name: "item-1",
    label: "Menu Item 1",
    items: [
      {
        name: "item-1-1",
        label: "Menu Item 1-1",
        items: [
          {
            name: "item-1-1-1",
            label: "Menu Item 1-1-1",
          },
          {
            name: "item-1-1-2",
            label: "Menu Item 1-1-2",
          },
        ],
      },
    ],
  },
];

describe("ui-menu", () => {
  it("should handle mouse and keyboard events correctly", async () => {
    const page = await newE2EPage();
    await page.setContent(`
            <ui-menu name="test-menu"></ui-menu>`);
    const uiMenuChange = await page.spyOnEvent("uiMenuChange");

    const menu = await page.find("ui-menu.hydrated");
    menu.setProperty("items", testMenuItemsFlat);
    menu.setProperty("current", testMenuItemsFlat[0].name);
    await page.waitForChanges();

    const item2 = await page.find("ui-menu-item[name=item-2].hydrated");
    const item3 = await page.find("ui-menu-item[name=item-3].hydrated");

    // Initial current value
    expect(menu.getAttribute("current")).toEqual("item-1");

    // Mouse events
    await item2.click();
    await expect(uiMenuChange).toHaveReceivedEventDetail({
      name: "test-menu",
      current: "item-2",
    });
    await page.waitForChanges();
    // expect(menu.getAttribute('current')).toEqual('item-2');

    // Keyboard events
    await item2.press("ArrowRight");
    await item3.press("Enter");
    expect(uiMenuChange).toHaveReceivedEventDetail({
      name: "test-menu",
      current: "item-3",
    });
    await page.waitForChanges();
    // expect(menu.getAttribute('current')).toEqual('item-3');

    expect(menu).toMatchSnapshot();
  });

  it("should render nested menu items correctly", async () => {
    const page = await newE2EPage();
    await page.setContent(`
            <ui-menu name="test-menu"></ui-menu>`);
    const uiMenuChange = await page.spyOnEvent("uiMenuChange");
    const menu = await page.find("ui-menu.hydrated");

    menu.setProperty("items", testMenuItemsNested);
    await page.waitForChanges();

    const rootItem = await page.find("ui-menu-item[name=item-1].hydrated");
    let nestedItem;
    // expand level 1
    await rootItem.click();
    await page.waitForChanges();
    // expand level 2
    nestedItem = await page.find("ui-menu-item[name=item-1-1].hydrated");
    await nestedItem.click();
    await page.waitForChanges();

    // select nested item
    nestedItem = await page.find("ui-menu-item[name=item-1-1-2].hydrated");
    await nestedItem.click();
    await page.waitForChanges();

    await expect(uiMenuChange).toHaveReceivedEventDetail({
      name: "test-menu",
      current: "item-1-1-2",
    });

    await page.waitForChanges();
    expect(menu.getAttribute("current")).toEqual("item-1-1-2");
    expect(rootItem.getProperty("selected")).toBeTruthy();

    expect(menu).toMatchSnapshot();
  });
});
