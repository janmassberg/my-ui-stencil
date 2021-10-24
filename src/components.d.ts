/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
  interface MyUiButton {
    /**
     * Indicates if the button is disabled
     */
    disabled: boolean;
    /**
     * Variant of the button
     */
    kind: "default" | "primary" | "secondary";
    /**
     * Label text of the button
     */
    label: string;
    /**
     * Size of the button
     */
    size: "s" | "m" | "l";
    /**
     * Type attribute of the button
     */
    type: "button" | "submit" | "reset";
  }
}
declare global {
  interface HTMLMyUiButtonElement
    extends Components.MyUiButton,
      HTMLStencilElement {}
  var HTMLMyUiButtonElement: {
    prototype: HTMLMyUiButtonElement;
    new (): HTMLMyUiButtonElement;
  };
  interface HTMLElementTagNameMap {
    "my-ui-button": HTMLMyUiButtonElement;
  }
}
declare namespace LocalJSX {
  interface MyUiButton {
    /**
     * Indicates if the button is disabled
     */
    disabled?: boolean;
    /**
     * Variant of the button
     */
    kind?: "default" | "primary" | "secondary";
    /**
     * Label text of the button
     */
    label?: string;
    /**
     * Size of the button
     */
    size?: "s" | "m" | "l";
    /**
     * Type attribute of the button
     */
    type?: "button" | "submit" | "reset";
  }
  interface IntrinsicElements {
    "my-ui-button": MyUiButton;
  }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      "my-ui-button": LocalJSX.MyUiButton &
        JSXBase.HTMLAttributes<HTMLMyUiButtonElement>;
    }
  }
}
