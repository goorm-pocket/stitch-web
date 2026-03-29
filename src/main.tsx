import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerPushToken } from "./shared/api/token";

const queryClient = new QueryClient();

const isAppWebView = Boolean(window.ReactNativeWebView) || /stitch-app/i.test(navigator.userAgent);

document.documentElement.classList.toggle("app-webview", isAppWebView);
document.body.classList.toggle("app-webview", isAppWebView);

document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
window.addEventListener("resize", () => {
  document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
});

const applyAppContext = (rawData: unknown) => {
  if (!rawData || typeof rawData !== "object") return;

  const message = rawData as {
    type?: string;
    payload?: {
      safeArea?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
      };
    };
  };

  if (message.type !== "APP_CONTEXT" || !message.payload?.safeArea) return;

  const { top = 0, right = 0, bottom = 0, left = 0 } = message.payload.safeArea;
  const rootStyle = document.documentElement.style;

  rootStyle.setProperty("--app-safe-top", `${top}px`);
  rootStyle.setProperty("--app-safe-right", `${right}px`);
  rootStyle.setProperty("--app-safe-bottom", `${bottom}px`);
  rootStyle.setProperty("--app-safe-left", `${left}px`);
};

const syncPushToken = async (rawData: unknown) => {
  if (!rawData || typeof rawData !== "object") return;

  const message = rawData as {
    type?: string;
    payload?: {
      token?: string;
      platform?: "ANDROID" | "IOS" | "WEB";
      deviceId?: string;
    };
  };

  if (message.type !== "APP_PUSH_TOKEN" || !message.payload?.token || !message.payload.platform) {
    return;
  }

  try {
    await registerPushToken({
      token: message.payload.token,
      platform: message.payload.platform,
      deviceId: message.payload.deviceId,
    });
    console.log("[web] APP_PUSH_TOKEN synced");
  } catch (error) {
    console.error("[web] APP_PUSH_TOKEN sync failed", error);
  }
};

const handleBridgeMessage = (event: MessageEvent) => {
  try {
    const rawData = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    applyAppContext(rawData);
    void syncPushToken(rawData);
  } catch {
    // Ignore non-bridge messages.
  }
};

window.addEventListener("message", handleBridgeMessage);
document.addEventListener("message", handleBridgeMessage as EventListener);
window.addEventListener("stitch:app-context", ((event: Event) => {
  applyAppContext((event as CustomEvent).detail);
}) as EventListener);

applyAppContext(window.__STITCH_APP_CONTEXT__);
void syncPushToken(window.__STITCH_PUSH_TOKEN__);

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>,
);
