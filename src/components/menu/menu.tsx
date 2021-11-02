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
  getMenuItemRoot,
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
  @Element() el: HTMLUiMenuElement;

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
  onCurrentChange() {
    this.updateSelectedItemsRecursive(this.current);
  }

  /** Set the focus to the next menu-item on the same level */
  private focusNextItem = (
    current: HTMLUiMenuItemElement,
    dir: number,
  ): void => {
    const scope = current.parent || this.rootElement || this.el;
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

  private findRelatedMenus = (): HTMLUiMenuElement[] => {
    return this.rootElement === null
      ? [this.el]
      : findMenus(this.rootElement, this.name);
  };

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
    this.findRelatedMenus().forEach(el => {
      el.current = current;
    });
  };

  private updateSelectedItemsRecursive = (current: string): void => {
    const selectedItem = findMenuItemWithName(this.el, current);
    const selectedLevel = selectedItem?.level || 0;
    const selectedPath = getMenuItemPath(selectedItem);
    findMenuItems(this.el).forEach(el => {
      el.selected =
        typeof current === "string" &&
        el.level <= selectedLevel &&
        el.name === selectedPath[el.level];
      el.expanded = false;
    });
    this.selectedItem = selectedItem;
  };

  private collapsOtherItemsIfExpanded = (
    expandedItem: HTMLUiMenuItemElement,
  ) => {
    if (expandedItem === null || !expandedItem.expanded) {
      return;
    }
    findMenus(document.body).forEach(menu => {
      if (menu !== this.el) {
        findMenuItems(menu, `[level="0"]`).forEach(item => {
          item.expanded = false;
        });
      }
    });
    findMenuItems(this.el, `[level="${expandedItem.level}"]`).forEach(item => {
      if (item !== expandedItem) {
        item.expanded = false;
      }
    });
  };

  private handleClick = (event: MouseEvent | TouchEvent) => {
    const item = findMenuItemInEvent(event);
    if (item === null) return;
    if (getMenuItemHasChildren(item)) {
      event.preventDefault();
      event.stopPropagation();
      item.expanded = !item.expanded;
      this.collapsOtherItemsIfExpanded(item);
    } else {
      this.selectItem(item);
    }
  };

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
          this.collapsOtherItemsIfExpanded(item);
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
      this.onCurrentChange();
    } else {
      const selectedItem = findFirstSelectedMenuItem(this.el);
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
    const { kind, vertical, selectedItem } = this;
    const selectedRootItem = getMenuItemRoot(selectedItem);
    return (
      <Host
        class={{
          [baseClass]: true,
          [`${baseClass}--${kind}`]: kind !== undefined,
          [`${baseClass}--horizontal`]: vertical !== true,
          [`${baseClass}--vertical`]: vertical === true,
        }}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
      >
        <div class={`${baseClass}__inner`}>
          <slot />
          {this.renderItems()}
        </div>
        {selectedRootItem !== null && (
          <ui-menu-indicator target={selectedRootItem} vertical={vertical} />
        )}
      </Host>
    );
  }
}
