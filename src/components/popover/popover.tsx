import {
  Component,
  h,
  Prop,
  ComponentInterface,
  Element,
  Method,
  Event,
  EventEmitter,
  Host,
  State,
  Watch,
} from "@stencil/core";
import { PopoverPlacementName, PopoverDimensions } from "./types";
import { calculatePopoverDimensions } from "./utils";
import { debounce } from "../../utils/debounce";

/**
 * @slot (default) - Elements in the default slot open the popover when clicked
 * @slot overlay - Content of the popover layer
 */
@Component({
  tag: "ui-popover",
  styleUrl: "./popover.scss",
})
export class Popover implements ComponentInterface {
  @Element() el: HTMLUiPopoverElement;
  @State() overlayDimensions: PopoverDimensions | null = null;
  @State() isOpened: boolean = false;

  private overlayElement: HTMLElement;
  private hostElement: HTMLElement;

  /** Placement of the popover */
  @Prop({ reflect: true }) placement: PopoverPlacementName = "top";
  /** Indicates whether the popover should be open or not */
  @Prop({ reflect: true }) opened: boolean = false;

  @Watch("placement")
  onOptionsChange(): void {
    if (this.opened) {
      this.updateOverlayPlacementDebounced();
    }
  }

  @Watch("opened")
  onOpenedChange(): void {
    if (this.opened) {
      this.addEventListeners();
      this.updateOverlayPlacementDebounced();
    } else {
      this.removeEventListeners();
      this.overlayDimensions = null;
      this.isOpened = false;
    }
  }

  @Watch("overlayDimensions")
  onOverlayDimensionsChange(): void {
    if (!this.opened || this.overlayDimensions === null) {
      this.isOpened = false;
      return;
    }
    transformElement(
      this.overlayElement,
      `${this.overlayDimensions.left}px`,
      `${this.overlayDimensions.top}px`,
    );
    if (!this.isOpened) {
      window.setTimeout(() => {
        if (!this.opened || this.overlayDimensions === null) {
          return;
        }
        this.isOpened = true;
      }, 10);
    }
  }

  /** Fired when the popover opens. */
  @Event() uiShow: EventEmitter;

  /** Fired when the popover closes. */
  @Event() uiHide: EventEmitter;

  /** Open the popover */
  @Method()
  async open() {
    if (!this.opened && this.uiShow.emit().defaultPrevented !== true) {
      this.opened = true;
    }
  }

  /** Close the popover */
  @Method()
  async close() {
    if (this.opened && this.uiHide.emit().defaultPrevented !== true) {
      this.opened = false;
    }
  }

  /** Recalculate the optimal popover placemnt */
  @Method()
  async updatePlacement() {
    if (!this.opened) return;
    this.updateOverlayPlacementDebounced();
  }

  componentDidLoad() {
    this.onOpenedChange();
    this.el
      .querySelectorAll(".ui-popover__trigger [slot='overlay']")
      .forEach((node: HTMLElement) => {
        console.log("remove node", node);
        node.remove();
      });
  }

  connectedCallback() {
    if (this.hostElement === undefined) {
      this.hostElement = this.el;
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  // -------------------------------------
  // Private methods
  // -------------------------------------

  private updateOverlayPlacement = (): void => {
    if (!this.opened) {
      return;
    }

    const { overlayElement, placement } = this;
    const overlayHostRect = this.hostElement.getBoundingClientRect();
    const overlayRect = overlayElement.getBoundingClientRect();
    this.overlayDimensions = calculatePopoverDimensions(
      overlayHostRect,
      overlayRect,
      placement,
    );
  };

  private updateOverlayPlacementDebounced = debounce(
    this.updateOverlayPlacement,
    20,
  );

  private addEventListeners = (): void => {
    this.removeEventListeners();
    window.addEventListener("scroll", this.handleViewportChange);
    window.addEventListener("resize", this.handleViewportChange);
    document.addEventListener("mousedown", this.handleDocumentMouseDown);
    document.addEventListener("keydown", this.handleDocumentKeyDown);
    this.overlayElement.addEventListener(
      "uiClosePopover",
      this.handleClosePopover,
    );
  };

  private removeEventListeners = (): void => {
    window.removeEventListener("scroll", this.handleViewportChange);
    window.removeEventListener("resize", this.handleViewportChange);
    document.removeEventListener("mousedown", this.handleDocumentMouseDown);
    document.removeEventListener("keydown", this.handleDocumentKeyDown);
    this.overlayElement.removeEventListener(
      "uiClosePopover",
      this.handleClosePopover,
    );
  };

  // -------------------------------------
  // Event Handlers
  // -------------------------------------

  private handleViewportChange = () => {
    if (this.opened) {
      this.updateOverlayPlacementDebounced();
    }
  };

  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.close();
      return;
    }

    if (event.key === "Tab") {
      setTimeout(() => {
        if (
          document.activeElement &&
          document.activeElement.closest(this.hostElement.tagName) !==
            this.hostElement
        ) {
          this.close();
          return;
        }
      });
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
    }
  };

  private handleDocumentMouseDown = (event: MouseEvent) => {
    if (!this.hostElement.contains(event.target as HTMLElement)) {
      requestAnimationFrame(() => this.close());
    }
  };

  private handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (!this.opened && ["ArrowDown", "ArrowUp"].includes(event.key)) {
      this.open();
      event.preventDefault();
      event.stopPropagation();
    }
  };

  private handleTriggerClick = () => {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  };

  private handleClosePopover = (event: CustomEvent) => {
    event.stopPropagation();
    this.close();
  };

  render() {
    const { opened, overlayDimensions, isOpened } = this;
    const baseClass = "ui-popover";
    return (
      <Host>
        <div
          class={`${baseClass}__trigger`}
          onClick={this.handleTriggerClick}
          onKeyDown={this.handleTriggerKeyDown}
        >
          <slot />
        </div>
        <div
          class={{
            [`${baseClass}__overlay`]: true,
            [`${baseClass}__overlay--opening`]: opened && !isOpened,
            [`${baseClass}__overlay--opened`]: isOpened,
          }}
          ref={el => (this.overlayElement = el)}
          data-popover-placement={
            overlayDimensions && overlayDimensions.placement
          }
          style={opened ? undefined : { display: "none" }}
        >
          <div class={`${baseClass}__overlay-content`}>
            <slot name="overlay" />
          </div>
        </div>
      </Host>
    );
  }
}

function transformElement(
  el: HTMLElement,
  x: string = "0",
  y: string = "0",
  z: string = "0",
) {
  el.style.transform = `translate3d(${x}, ${y}, ${z})`;
}
