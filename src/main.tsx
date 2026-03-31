import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerPushToken } from "./shared/api/token";

const queryClient = new QueryClient();
const OBSOLETE_STORAGE_KEYS = ["stitch.create-post.draft"];

//앱 WebView 안에서 열렸는지 판별
const isAppWebView = Boolean(window.ReactNativeWebView) || /stitch-app/i.test(navigator.userAgent);

document.documentElement.classList.toggle("app-webview", isAppWebView);
document.body.classList.toggle("app-webview", isAppWebView);

//모바일 WebView에서 실제 보이는 높이를 CSS 변수로 유지
document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
window.addEventListener("resize", () => {
  document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
});

//앱이 내려준 safe-area 정보를 CSS 변수에 반영
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

//앱이 전달한 푸시 토큰을 웹 API와 동기화
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

//React Native WebView 브리지 메시지를 공통 포맷으로 처리
const handleBridgeMessage = (event: MessageEvent) => {
  try {
    const rawData = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    applyAppContext(rawData);
    void syncPushToken(rawData);
  } catch {
    // Ignore non-bridge messages.
  }
};

//앱 메시지를 받기
window.addEventListener("message", handleBridgeMessage);
document.addEventListener("message", handleBridgeMessage as EventListener);
window.addEventListener("stitch:app-context", ((event: Event) => {
  applyAppContext((event as CustomEvent).detail);
}) as EventListener);

OBSOLETE_STORAGE_KEYS.forEach((key) => {
  localStorage.removeItem(key);
});

//앱이 선주입한 초기 컨텍스트도 첫 렌더 전에 반영
applyAppContext(window.__STITCH_APP_CONTEXT__);
void syncPushToken(window.__STITCH_PUSH_TOKEN__);

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>,
);
