import {
  Component,
  ComponentInterface,
  Element,
  Prop,
  Watch,
  getAssetPath,
} from "@stencil/core";
import { IconName } from "./types";
import { loadSvgResource } from "./utils";

@Component({
  tag: "ui-icon",
  styleUrl: "icon.scss",
  assetsDirs: ["assets"],
  shadow: false,
})
export class UiIcon implements ComponentInterface {
  @Element() el: HTMLElement;

  /** Name of the icon to use */
  @Prop() name?: IconName | string;

  /** Path to a SVG file */
  @Prop() src?: string;

  public componentDidLoad(): void {
    if (this.name) {
      this.onNameChange();
    } else if (this.src) {
      this.onSrcChange();
    }
  }

  @Watch("name")
  public onNameChange(): void {
    this.updateSvg(this.getSvgUrlForName());
  }

  @Watch("src")
  public onSrcChange(): void {
    if (this.src && this.src.slice(-4, 4) === ".svg") {
      this.updateSvg(this.src);
    } else {
      this.clearIcon();
    }
  }

  private updateSvg(svgUrl: string): void {
    loadSvgResource(svgUrl)
      .then(svgContent => {
        this.el.innerHTML = svgContent;
      })
      .catch(error => {
        this.clearIcon();
        console.log(error);
      });
  }

  private clearIcon(): void {
    this.el.innerHTML = "";
  }

  private getSvgUrlForName(): string {
    return `${getAssetPath("assets")}/${this.name}.svg`;
  }
}
