const selectorBase = "ui-menu";

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
