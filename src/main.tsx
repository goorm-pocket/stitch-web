import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const isAppWebView = Boolean(window.ReactNativeWebView) || /stitch-app/i.test(navigator.userAgent);

document.documentElement.classList.toggle("app-webview", isAppWebView);
document.body.classList.toggle("app-webview", isAppWebView);

document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
window.addEventListener("resize", () => {
  document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>,
);
