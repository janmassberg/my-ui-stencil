import {
  Component,
  ComponentInterface,
  Element,
  Prop,
  Watch,
  getAssetPath,
} from "@stencil/core";
import { IconName } from "./types";

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
    requestResource(svgUrl)
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

const cachedResources: Record<string, Promise<string>> = {};

async function requestResource(resource: string): Promise<string> {
  if (cachedResources[resource] !== undefined) {
    return cachedResources[resource];
  }
  cachedResources[resource] = new Promise((resolve, reject) => {
    fetch(resource)
      .then(res => {
        if (res.ok) {
          res
            .text()
            .then(text => resolve(text))
            .catch(() => reject());
        } else {
          reject();
        }
      })
      .catch(() => reject());
  });
  return cachedResources[resource];
}
