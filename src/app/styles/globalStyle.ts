import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --app-safe-top: 0px;
    --app-safe-right: 0px;
    --app-safe-bottom: 0px;
    --app-safe-left: 0px;
    --app-height: 100dvh;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  html {
    background-color: ${({ theme }) => theme.colors.background};
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    min-height: 100dvh;
    background-color: ${({ theme }) => theme.colors.background};
    overflow-x: hidden;
  }

  body.app-webview {
    min-height: var(--app-height);
    padding-top: var(--app-safe-top);
    padding-right: var(--app-safe-right);
    padding-bottom: var(--app-safe-bottom);
    padding-left: var(--app-safe-left);
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }
`;
