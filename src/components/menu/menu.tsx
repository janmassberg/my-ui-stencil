import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  h,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import { IMenuItem } from "./types";
import {
  findMenus,
  findMenuItems,
  findMenuItemInEvent,
  findMenuItemWithName,
  findFirstSelectedMenuItem,
  getMenuItemPath,
  getMenuItemHasChildren,
  getIsFirstChildMenuItem,
} from "./utils";

const baseClass = "ui-menu";

/**
 * @slot (default) - the `menu-item` elements belonging to the menu
 */
@Component({
  tag: "ui-menu",
  styleUrl: "menu.scss",
  shadow: false,
})
export class Menu implements ComponentInterface {
  @Element() host: HTMLUiMenuElement;

  /** Name that identifies the menu */
  @Prop() rootElement: HTMLElement = null;

  /** Name that identifies the menu */
  @Prop({ reflect: true }) name: string;

  /** Name of the currently selected menu item */
  @Prop({ reflect: true }) current?: string;

  /** If set to `true` the menu items can be deselected when clicked */
  @Prop() toggle?: boolean;

  /** Data provider for the menu structure */
  @Prop() items: IMenuItem[] | null = null;

  /** Style variant of the menu */
  @Prop() kind: "primary" | "secondary" = "primary";

  /** If set to `true` the menu items are arranged vertically */
  @Prop() vertical: boolean = false;

  /** The `role` attribute of the menu */
  @Prop({ reflect: true }) role: "menu" | "menubar" | "tablist" = "menubar";

  /** Emitted when a menu item is selected or deselected */
  @Event({ eventName: "uiMenuChange", bubbles: true, cancelable: true })
  dispatchMenuChange: EventEmitter<{
    name: string;
    current: string | null;
  }>;

  /** The currently selected menu item */
  @State() selectedItem: HTMLUiMenuItemElement | null = null;

  @Watch("current")
  setCurrent() {
    this.updateSelectedItems(this.current);
  }

  /** Find menus with same name */
  private findRelatedMenus = (): HTMLUiMenuElement[] => {
    console.log("findRelatedMenus", this.rootElement);
    return this.rootElement === null
      ? [this.host]
      : findMenus(this.rootElement, this.name);
  };

  /** Set the focus to the next menu-item on the same level */
  private focusNextItem = (
    current: HTMLUiMenuItemElement,
    dir: number,
  ): void => {
    const scope = current.parent || this.rootElement || this.host;
    const items = findMenuItems(scope, `[level="${current.level}"]`);
    let index = items.indexOf(current) + dir;
    if (index >= items.length) {
      index = 0;
    } else if (index < 0) {
      index = items.length - 1;
    }
    if (items[index] !== undefined) {
      items[index].focus();
    }
  };

  /** Set the focus to the next menu-item on parent or child level */
  private focusNextLevel = (
    current: HTMLUiMenuItemElement,
    dir: number,
  ): void => {
    if (dir > 0) {
      const items = findMenuItems(current, `[level="${current.level + 1}"]`);
      if (items.length > 0) {
        setTimeout(() => {
          items[0].focus();
        });
      }
    } else if (dir < 0 && current.parent !== null) {
      current.parent.focus();
      current.parent.expanded = false;
    }
  };

  /** Internally select or toggle a menu-item */
  private selectItem = (item: HTMLUiMenuItemElement): void => {
    if (!this.toggle && item === this.selectedItem) return;
    const selected = !this.toggle || !item.selected;
    const selectedItem = selected ? item : null;
    const current = selected ? item.name : null;
    if (
      this.dispatchMenuChange.emit({
        name: this.name,
        current: current,
      }).defaultPrevented
    ) {
      return;
    }
    item.selected = selected;
    this.selectedItem = selectedItem;
    console.log("selectedItem", selectedItem, current, selected, item.selected);
    this.findRelatedMenus().forEach(el => {
      //el.current = current;
      console.log("findRelatedMenus", el);
    });
  };

  /** Set the selected property of the menu items */
  private updateSelectedItems = (current: string): void => {
    const selectedItem = findMenuItemWithName(this.host, current);
    const selectedLevel = selectedItem?.level || -1;
    const selectedPath = getMenuItemPath(selectedItem);
    findMenuItems(this.host).forEach(el => {
      el.selected =
        typeof current === "string" &&
        el.level <= selectedLevel &&
        el.name === selectedPath[el.level];
      el.expanded = false;
    });
    this.selectedItem = selectedItem;
  };

  /** Click event handler */
  private handleClick = event => {
    const item = findMenuItemInEvent(event);
    if (item === null) return;
    if (getMenuItemHasChildren(item)) {
      event.preventDefault();
      event.stopPropagation();
      item.expanded = !item.expanded;
      return;
    }
    this.selectItem(item);
  };

  /** Keyboard event handler */
  private handleKeyDown = (event: KeyboardEvent) => {
    const item = findMenuItemInEvent(event);
    if (item === null) return;
    const hasChildren = getMenuItemHasChildren(item);
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (hasChildren) {
          item.expanded = !item.expanded;
        } else {
          this.selectItem(item);
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (!this.vertical && item.level === 0) {
          this.focusNextItem(item, -1);
        } else {
          if (item.expanded) {
            item.expanded = false;
          }
          this.focusNextLevel(item, -1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (this.vertical || item.level > 0) {
          if (item.level === 1 && getIsFirstChildMenuItem(item)) {
            this.focusNextLevel(item, -1);
          } else {
            this.focusNextItem(item, -1);
          }
        } else {
          if (item.expanded) {
            item.expanded = false;
          }
          this.focusNextLevel(item, -1);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (!this.vertical && item.level === 0) {
          this.focusNextItem(item, 1);
        } else if (hasChildren) {
          item.expanded = true;
          this.focusNextLevel(item, 1);
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (this.vertical || item.level > 0) {
          this.focusNextItem(item, 1);
        } else if (hasChildren) {
          item.expanded = true;
          this.focusNextLevel(item, 1);
        }
        break;
      default:
        break;
    }
  };

  componentDidLoad() {
    if (typeof this.current === "string") {
      this.setCurrent();
    } else {
      const selectedItem = findFirstSelectedMenuItem(this.host);
      this.selectedItem = selectedItem;
      this.current = selectedItem !== null ? selectedItem.name : null;
    }
  }

  private renderItems() {
    if (this.items === null || this.items.length === 0) {
      return;
    }
    return this.items.map(item => (
      <ui-menu-item
        key={item.name}
        name={item.name}
        label={item.label}
        icon={item.icon}
        items={item.items}
      />
    ));
  }

  render() {
    const { kind, vertical } = this;
    return (
      <Host
        class={{
          [baseClass]: true,
          [`${baseClass}--${kind}`]: kind !== undefined,
          [`${baseClass}--vertical`]: vertical === true,
        }}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
      >
        <div class={`${baseClass}__inner`}>
          <slot />
          {this.renderItems()}
        </div>
      </Host>
    );
  }
}
