import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Prop,
  Watch,
  getAssetPath,
} from "@stencil/core";
import { IconName, IconSize } from "./types";
import { loadSvgResource } from "./utils";

@Component({
  tag: "ui-icon",
  styleUrl: "icon.scss",
  assetsDirs: ["assets"],
  shadow: false,
})
export class UiIcon implements ComponentInterface {
  @Element() el: HTMLUiIconElement;

  /** Name of the icon to use */
  @Prop() name: IconName | string;

  /** Size of the icon */
  @Prop() size?: IconSize;

  /** Path to a SVG file */
  @Prop() src?: string;

  /** If set to `true` the icon is flipped horizontally if dir is `rtl` */
  @Prop() flipRtl?: boolean;

  @Watch("name")
  onNameChange(): void {
    this.updateSvg(this.getSvgPathName());
  }

  @Watch("src")
  onSrcChange(): void {
    if (this.src && this.src.slice(-4, 4) === ".svg") {
      this.updateSvg(this.src);
    } else {
      this.clearIcon();
    }
  }

  componentDidLoad() {
    if (this.name !== null) {
      this.onNameChange();
    } else if (typeof this.src === "string") {
      this.onSrcChange();
    }
  }

  private clearIcon = (): void => {
    this.el.innerHTML = "";
  };

  private updateSvg = (svgUrl: string): void => {
    loadSvgResource(svgUrl)
      .then(svgContent => {
        this.el.innerHTML = svgContent;
      })
      .catch(error => {
        this.clearIcon();
        console.log(error);
      });
  };

  private getSvgPathName = (): string => {
    return `${getAssetPath("assets")}/${this.name}.svg`;
  };

  render() {
    return (
      <Host
        class={{
          [`ui-icon--size-${this.size}`]: typeof this.size === "string",
          [`ui-icon--flip-rtl`]: this.flipRtl,
        }}
      />
    );
  }
}
