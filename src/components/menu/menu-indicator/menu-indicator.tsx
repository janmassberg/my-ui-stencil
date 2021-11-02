import { Component, Element, Host, h, Prop, Watch } from "@stencil/core";
import { debounce } from "../../../utils/debounce";

@Component({
  tag: "ui-menu-indicator",
  styleUrl: "menu-indicator.scss",
  shadow: false,
})
export class UiMenuIndicator {
  @Element() host: HTMLUiMenuIndicatorElement;

  /** The menu item that is highlichted by the indicator */
  @Prop() target: HTMLElement | null = null;

  /** If set to `true` a vertical indicator is displayed on the left side  */
  @Prop() vertical: boolean = false;

  @Watch("target")
  onTargetChange() {
    this.updateTransform();
    if (this.target !== null) {
      window.addEventListener("resize", this.handleWindowResize);
    } else {
      window.removeEventListener("resize", this.handleWindowResize);
    }
  }

  @Watch("vertical")
  onDirectionChange() {
    this.updateTransform();
  }

  private updateTransform = debounce(() => {
    this.host.style.transform = this.getCurrentTransform();
  }, 20);

  private handleWindowResize = () => {
    this.updateTransform();
  };

  private hasVisibleTarget = (): boolean => {
    return this.target !== null && this.target.offsetWidth > 0;
  };

  private getCurrentTransform = (): string => {
    const { vertical, target } = this;
    if (target === null) return "none";
    return vertical
      ? `translateY(${target.offsetTop}px)`
      : `translateX(${target.offsetLeft}px)`;
  };

  private getCurrentStyle = (): Record<string, string> => {
    const { target, vertical } = this;
    const style: Record<string, string> = {
      display: "none",
      transform: "none",
    };
    if (!this.hasVisibleTarget()) {
      return style;
    }
    if (vertical) {
      style.height = `${target.offsetHeight}px`;
    } else {
      style.width = `${target.offsetWidth - 1}px`;
    }
    style.transform = this.getCurrentTransform();
    style.display = "block";
    return style;
  };

  componentDidLoad() {
    this.onTargetChange();
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  render() {
    return (
      <Host
        class={{
          [`ui-menu-indicator`]: true,
          [`ui-menu-indicator--horizontal`]: this.vertical !== true,
          [`ui-menu-indicator--vertical`]: this.vertical === true,
        }}
        style={this.getCurrentStyle()}
      />
    );
  }
}
