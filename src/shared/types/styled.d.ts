import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      sub: string;
      icon: string;
      background: string;
      surface: string;
      surface_alt: string;
      text_primary: string;
      text_secondary: string;
      text_disable: string;
      border: string;
      border2: string;
      border3: string;
      hover: string;
      overlay: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      xxxl: string;
    };
    radii: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      pill: string;
      round: string;
    };
    shadows: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    space: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      xxxl: string;
      section: string;
    };
    motion: {
      fast: string;
      base: string;
      slow: string;
      easing: string;
    };
    layout: {
      contentWidth: string;
      wideWidth: string;
      pagePadding: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  }
}
