/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { IconName, IconSize } from "./components/icon/types";
import { IMenuItem } from "./components/menu/types";
export namespace Components {
  interface UiButton {
    /**
     * Indicates if the button is disabled
     */
    disabled: boolean;
    /**
     * Variant of the button
     */
    kind: "default" | "primary" | "secondary";
    /**
     * Label text of the button
     */
    label: string;
    /**
     * Size of the button
     */
    size: "s" | "m" | "l";
    /**
     * Type attribute of the button
     */
    type: "button" | "submit" | "reset";
  }
  interface UiIcon {
    /**
     * If set to `true` the icon is flipped horizontally if dir is `rtl`
     */
    flipRtl?: boolean;
    /**
     * Name of the icon to use
     */
    name: IconName | string;
    /**
     * Size of the icon
     */
    size?: IconSize;
    /**
     * Path to a SVG file
     */
    src?: string;
  }
  interface UiMenu {
    /**
     * Name of the currently selected menu item
     */
    current?: string;
    /**
     * Data provider for the menu structure
     */
    items: IMenuItem[] | null;
    /**
     * Style variant of the menu
     */
    kind: "primary" | "secondary";
    /**
     * Name that identifies the menu
     */
    name: string;
    /**
     * The `role` attribute of the menu
     */
    role: "menu" | "menubar" | "tablist";
    /**
     * Name that identifies the menu
     */
    rootElement: HTMLElement;
    /**
     * If set to `true` the menu items can be deselected when clicked
     */
    toggle?: boolean;
    /**
     * If set to `true` the menu items are arranged vertically
     */
    vertical: boolean;
  }
  interface UiMenuIndicator {
    /**
     * The menu item that is highlichted by the indicator
     */
    target: HTMLElement | null;
    /**
     * If set to `true` a vertical indicator is displayed on the left side
     */
    vertical: boolean;
  }
  interface UiMenuItem {
    /**
     * Flag that indicates if the menu item is disabled
     */
    disabled: boolean;
    /**
     * If the item has nested items
     */
    expanded: boolean;
    /**
     * Name of the icon that should be rendered instead of or before the label
     */
    icon?: string;
    /**
     * Flag that indicates that the menu-item only renders an icon without label
     */
    iconOnly?: boolean;
    /**
     * Data provider for the menu child elements
     */
    items: IMenuItem[] | null;
    /**
     * Label text use as aria-label attribute and slot fallback
     */
    label?: string;
    /**
     * The level in a nested menu
     */
    level: number;
    /**
     * Name that must be unique in the menu scope identifies the menu-item
     */
    name: string;
    /**
     * The parent item element in a nested menu
     */
    parent: HTMLUiMenuItemElement | null;
    /**
     * The `role` attribute of the element
     */
    role: "menuitem" | "tab";
    /**
     * Flag that indicates if the menu item is currently selected or not
     */
    selected: boolean;
    /**
     * Name of the icon that should be rendered after the label
     */
    trailingIcon?: string;
  }
}
declare global {
  interface HTMLUiButtonElement
    extends Components.UiButton,
      HTMLStencilElement {}
  var HTMLUiButtonElement: {
    prototype: HTMLUiButtonElement;
    new (): HTMLUiButtonElement;
  };
  interface HTMLUiIconElement extends Components.UiIcon, HTMLStencilElement {}
  var HTMLUiIconElement: {
    prototype: HTMLUiIconElement;
    new (): HTMLUiIconElement;
  };
  interface HTMLUiMenuElement extends Components.UiMenu, HTMLStencilElement {}
  var HTMLUiMenuElement: {
    prototype: HTMLUiMenuElement;
    new (): HTMLUiMenuElement;
  };
  interface HTMLUiMenuIndicatorElement
    extends Components.UiMenuIndicator,
      HTMLStencilElement {}
  var HTMLUiMenuIndicatorElement: {
    prototype: HTMLUiMenuIndicatorElement;
    new (): HTMLUiMenuIndicatorElement;
  };
  interface HTMLUiMenuItemElement
    extends Components.UiMenuItem,
      HTMLStencilElement {}
  var HTMLUiMenuItemElement: {
    prototype: HTMLUiMenuItemElement;
    new (): HTMLUiMenuItemElement;
  };
  interface HTMLElementTagNameMap {
    "ui-button": HTMLUiButtonElement;
    "ui-icon": HTMLUiIconElement;
    "ui-menu": HTMLUiMenuElement;
    "ui-menu-indicator": HTMLUiMenuIndicatorElement;
    "ui-menu-item": HTMLUiMenuItemElement;
  }
}
declare namespace LocalJSX {
  interface UiButton {
    /**
     * Indicates if the button is disabled
     */
    disabled?: boolean;
    /**
     * Variant of the button
     */
    kind?: "default" | "primary" | "secondary";
    /**
     * Label text of the button
     */
    label?: string;
    /**
     * Size of the button
     */
    size?: "s" | "m" | "l";
    /**
     * Type attribute of the button
     */
    type?: "button" | "submit" | "reset";
  }
  interface UiIcon {
    /**
     * If set to `true` the icon is flipped horizontally if dir is `rtl`
     */
    flipRtl?: boolean;
    /**
     * Name of the icon to use
     */
    name?: IconName | string;
    /**
     * Size of the icon
     */
    size?: IconSize;
    /**
     * Path to a SVG file
     */
    src?: string;
  }
  interface UiMenu {
    /**
     * Name of the currently selected menu item
     */
    current?: string;
    /**
     * Data provider for the menu structure
     */
    items?: IMenuItem[] | null;
    /**
     * Style variant of the menu
     */
    kind?: "primary" | "secondary";
    /**
     * Name that identifies the menu
     */
    name?: string;
    /**
     * Emitted when a menu item is selected or deselected
     */
    onUiMenuChange?: (
      event: CustomEvent<{
        name: string;
        current: string | null;
      }>,
    ) => void;
    /**
     * The `role` attribute of the menu
     */
    role?: "menu" | "menubar" | "tablist";
    /**
     * Name that identifies the menu
     */
    rootElement?: HTMLElement;
    /**
     * If set to `true` the menu items can be deselected when clicked
     */
    toggle?: boolean;
    /**
     * If set to `true` the menu items are arranged vertically
     */
    vertical?: boolean;
  }
  interface UiMenuIndicator {
    /**
     * The menu item that is highlichted by the indicator
     */
    target?: HTMLElement | null;
    /**
     * If set to `true` a vertical indicator is displayed on the left side
     */
    vertical?: boolean;
  }
  interface UiMenuItem {
    /**
     * Flag that indicates if the menu item is disabled
     */
    disabled?: boolean;
    /**
     * If the item has nested items
     */
    expanded?: boolean;
    /**
     * Name of the icon that should be rendered instead of or before the label
     */
    icon?: string;
    /**
     * Flag that indicates that the menu-item only renders an icon without label
     */
    iconOnly?: boolean;
    /**
     * Data provider for the menu child elements
     */
    items?: IMenuItem[] | null;
    /**
     * Label text use as aria-label attribute and slot fallback
     */
    label?: string;
    /**
     * The level in a nested menu
     */
    level?: number;
    /**
     * Name that must be unique in the menu scope identifies the menu-item
     */
    name?: string;
    /**
     * The parent item element in a nested menu
     */
    parent?: HTMLUiMenuItemElement | null;
    /**
     * The `role` attribute of the element
     */
    role?: "menuitem" | "tab";
    /**
     * Flag that indicates if the menu item is currently selected or not
     */
    selected?: boolean;
    /**
     * Name of the icon that should be rendered after the label
     */
    trailingIcon?: string;
  }
  interface IntrinsicElements {
    "ui-button": UiButton;
    "ui-icon": UiIcon;
    "ui-menu": UiMenu;
    "ui-menu-indicator": UiMenuIndicator;
    "ui-menu-item": UiMenuItem;
  }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      "ui-button": LocalJSX.UiButton &
        JSXBase.HTMLAttributes<HTMLUiButtonElement>;
      "ui-icon": LocalJSX.UiIcon & JSXBase.HTMLAttributes<HTMLUiIconElement>;
      "ui-menu": LocalJSX.UiMenu & JSXBase.HTMLAttributes<HTMLUiMenuElement>;
      "ui-menu-indicator": LocalJSX.UiMenuIndicator &
        JSXBase.HTMLAttributes<HTMLUiMenuIndicatorElement>;
      "ui-menu-item": LocalJSX.UiMenuItem &
        JSXBase.HTMLAttributes<HTMLUiMenuItemElement>;
    }
  }
}
