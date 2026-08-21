import type { JSX as ReactJSX } from "react";

declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
  }
}

declare module "*.png" {
  const src: string;
  export default src;
}
