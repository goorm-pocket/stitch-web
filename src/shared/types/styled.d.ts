import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      sub: string;

      background: string;
      text_primary: string;
      text_secondary: string;
      text_disable: string;
      border: string;
      hover: string;
    };
  }
}
