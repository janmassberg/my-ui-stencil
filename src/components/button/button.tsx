import { Component, ComponentInterface, Prop, Host, h } from "@stencil/core";

const baseClass = "ui-button";

@Component({
  tag: "ui-button",
  styleUrl: "button.scss",
  shadow: false,
})
export class UiButton implements ComponentInterface {
  /** Indicates if the button is disabled */
  @Prop() disabled: boolean;

  /** Variant of the button */
  @Prop() kind: "default" | "primary" | "secondary" = "default";

  /** Label text of the button */
  @Prop() label: string;

  /** Size of the button */
  @Prop() size: "s" | "m" | "l" = "m";

  /** Type attribute of the button */
  @Prop() type: "button" | "submit" | "reset" = "button";

  render() {
    return (
      <Host
        class={{
          [baseClass]: true,
          [`${baseClass}--disabled`]: this.disabled,
          [`${baseClass}--${this.kind}`]: [
            "default",
            "primary",
            "secondary",
          ].includes(this.kind),
          [`${baseClass}--size-${this.size}`]: ["s", "m", "l"].includes(
            this.size,
          ),
        }}
      >
        <button
          class={`${baseClass}__button`}
          disabled={this.disabled}
          aria-label={this.label}
        >
          <slot />
        </button>
      </Host>
    );
  }
}
