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
  @Prop() rootElement: HTMLElement;

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

  /** Find ui-menu elements with same name */
  private findRelatedMenus = (): HTMLUiMenuElement[] => {
    return this.rootElement === null
      ? [this.host]
      : findMenus(this.rootElement, this.name);
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
    this.findRelatedMenus().forEach(el => {
      el.current = current;
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
      >
        <div class={`${baseClass}__inner`}>
          <slot />
          {this.renderItems()}
        </div>
      </Host>
    );
  }
}
