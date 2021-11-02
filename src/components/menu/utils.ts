const selectorBase = "ui-menu";

/**
 * Find a menu inside of an element
 */
export function findMenu(el: HTMLElement, name?: string): HTMLUiMenuElement {
  if (el === null) return null;
  return typeof name === "string"
    ? el.querySelector<HTMLUiMenuElement>(`${selectorBase}[name="${name}"]`)
    : el.querySelector<HTMLUiMenuElement>(`${selectorBase}`);
}

/**
 * Find all menus inside of an element
 */
export function findMenus(
  el: HTMLElement,
  menuName?: string,
): HTMLUiMenuElement[] {
  if (el === null) return [];
  const nodeList: NodeListOf<HTMLUiMenuElement> =
    typeof menuName === "string"
      ? el.querySelectorAll<HTMLUiMenuElement>(
          `${selectorBase}[name="${menuName}"]`,
        )
      : el.querySelectorAll<HTMLUiMenuElement>(`${selectorBase}`);
  return Array.from(nodeList);
}

/**
 * Find all menu items inside of an element
 */
export function findMenuItems(
  el: HTMLElement,
  selector: string = "",
): HTMLUiMenuItemElement[] {
  if (el === null) return [];
  const itemSelector = `${selectorBase}-item${selector}`;
  return Array.from(el.querySelectorAll<HTMLUiMenuItemElement>(itemSelector));
}

/**
 * Find a menu item with a specific name
 */
export function findMenuItemWithName(
  el: HTMLElement,
  name: string,
): HTMLUiMenuItemElement {
  if (el === null || name === null) {
    return null;
  }
  return el.querySelector<HTMLUiMenuItemElement>(
    `${selectorBase}-item[name="${name}"]`,
  );
}

/**
 * Find the menu item that is closest to an event target
 */
export function findMenuItemInEvent(
  event: Event,
): HTMLUiMenuItemElement | null {
  return (event.target as HTMLElement).closest<HTMLUiMenuItemElement>(
    `${selectorBase}-item`,
  );
}

/**
 * Find the first menu item that is selected
 */
export function findFirstSelectedMenuItem(
  el: HTMLElement,
): HTMLUiMenuItemElement {
  if (el === null) return null;
  return el.querySelector<HTMLUiMenuItemElement>(
    `${selectorBase}-item[selected]`,
  );
}

/**
 * Returns an array of menu item names from target up to root
 */
export function getMenuItemPathReverse(
  el: HTMLUiMenuItemElement,
  path: string[] = [],
): string[] {
  if (path === null) path = [];
  if (el === null) return path;
  path.push(el.name);
  if (el.parent !== null) {
    getMenuItemPathReverse(el.parent, path);
  }
  return path;
}

/**
 * Returns an array of menu item names from root down to target
 */
export function getMenuItemPath(el: HTMLUiMenuItemElement): string[] {
  return getMenuItemPathReverse(el).reverse();
}

/**
 * Returns `true` if the item has child items
 */
export function getMenuItemHasChildren(
  menuItem: HTMLUiMenuItemElement,
): boolean {
  return (
    menuItem !== null &&
    Array.isArray(menuItem.items) &&
    menuItem.items.length > 0
  );
}

/**
 * Returns `true` if the item is the first child of the parent menu item
 */
export function getIsFirstChildMenuItem(
  menuItem: HTMLUiMenuItemElement,
): boolean {
  return (
    menuItem.parent &&
    getMenuItemHasChildren(menuItem.parent) &&
    menuItem.parent.items[0].name === menuItem.name
  );
}

/**
 * Returns the root menu item in a nested menu
 */
export function getMenuItemRoot(
  el: HTMLUiMenuItemElement,
): HTMLUiMenuItemElement {
  if (el !== null && el.parent !== null) {
    return getMenuItemRoot(el.parent);
  }
  return el;
}
