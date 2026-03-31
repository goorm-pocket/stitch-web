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
    scroll-behavior: smooth;
    scrollbar-gutter: stable;
  }

  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    min-height: 100dvh;
    background-color: ${({ theme }) => theme.colors.background};
    overflow-x: hidden;
    overflow-y: auto;
    color: ${({ theme }) => theme.colors.text_primary};
    font-family:
      Inter,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    line-height: 1.5;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.border3} transparent;
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border3};
    border: 2px solid transparent;
    border-radius: ${({ theme }) => theme.radii.pill};
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text_disable};
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  /* safe-area 여백을 body에 적용 */
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

  img,
  svg {
    display: block;
  }

  button,
  a,
  input,
  textarea,
  select {
    transition:
      color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
      background-color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
      border-color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
      box-shadow ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
      transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
      opacity ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
