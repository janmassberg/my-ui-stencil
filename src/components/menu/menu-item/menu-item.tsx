import {
  Component,
  ComponentInterface,
  Element,
  Host,
  h,
  Prop,
  Watch,
} from "@stencil/core";
import { IMenuItem } from "../types";
import { findMenuItems } from "../utils";

const baseClass = "ui-menu-item";

/**
 * @slot (default) - Custom menu item label content
 */
@Component({
  tag: "ui-menu-item",
  styleUrl: "menu-item.scss",
  shadow: false,
})
export class UiMenuItem implements ComponentInterface {
  @Element() host: HTMLUiMenuItemElement;

  /** Name that must be unique in the menu scope identifies the menu-item */
  @Prop({ reflect: true }) name: string;

  /** Flag that indicates if the menu item is disabled */
  @Prop({ reflect: true }) disabled = false;

  /** The level in a nested menu */
  @Prop({ reflect: true }) level: number = 0;

  /** The `role` attribute of the element */
  @Prop({ reflect: true }) role: "menuitem" | "tab" = "menuitem";

  /** Flag that indicates if the menu item is currently selected or not */
  @Prop({ reflect: true }) selected = false;

  /** Label text use as aria-label attribute and slot fallback */
  @Prop() label?: string;

  /** Name of the icon that should be rendered instead of or before the label */
  @Prop() icon?: string;

  /** Flag that indicates that the menu-item only renders an icon without label */
  @Prop() iconOnly?: boolean;

  /** Name of the icon that should be rendered after the label */
  @Prop() trailingIcon?: string;

  /** Data provider for the menu child elements */
  @Prop() items: IMenuItem[] | null = null;

  /** The parent item element in a nested menu */
  @Prop() parent: HTMLUiMenuItemElement | null = null;

  /** If the item has nested items */
  @Prop() expanded: boolean = false;

  /** Update menu items */
  @Watch("expanded")
  setExpanded() {
    const { expanded, parent, level } = this;
    if (!expanded) {
      findMenuItems(this.host).forEach(el => {
        el.expanded = false;
      });
      return;
    }
    if (parent === null) {
      return;
    }
    findMenuItems(parent, `[level="${level}"]`).forEach(el => {
      if (el !== this.host) {
        el.expanded = false;
      }
    });
  }

  private renderItems() {
    const { items, level } = this;
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }
    return items.map(item => (
      <ui-menu-item
        key={item.name}
        name={item.name}
        icon={item.icon}
        label={item.label}
        level={level + 1}
        items={item.items}
        parent={this.host}
      />
    ));
  }

  render() {
    const {
      disabled,
      expanded,
      icon,
      iconOnly,
      items,
      label,
      level,
      selected,
    } = this;
    const hasChildren = Array.isArray(items) && items.length > 0;
    const expandIcon = level > 0 ? "caret-right" : "caret-down";
    const trailingIcon = hasChildren
      ? this.trailingIcon || expandIcon
      : this.trailingIcon;
    return (
      <Host
        class={{
          [`${baseClass}`]: true,
          [`${baseClass}--disabled`]: disabled,
          [`${baseClass}--selected`]: selected,
          [`${baseClass}--icon-only`]: iconOnly,
        }}
        aria-disabled={disabled}
        aria-selected={selected}
        aria-label={label}
        tabindex="-1"
      >
        <div class={`${baseClass}__item`}>
          {icon && <ui-icon name={icon} />}
          <span class={`${baseClass}__label`}>
            <span class={`${baseClass}__label-slot`}>
              <slot />
            </span>
            <span class={`${baseClass}__label-text`}>{label}</span>
          </span>
          {trailingIcon && <ui-icon name={trailingIcon} />}
        </div>
        {hasChildren && (
          <div
            class={{
              [`${baseClass}__submenu`]: true,
              [`${baseClass}__submenu--vertical`]: level > 0,
              [`${baseClass}__submenu--expanded`]: expanded,
            }}
          >
            {this.renderItems()}
          </div>
        )}
      </Host>
    );
  }
}
