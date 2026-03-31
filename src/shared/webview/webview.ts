//웹에서 실행 중인 코드를 앱 쪽으로 전달
export const sendToApp = (data: unknown) => {
  const message = JSON.stringify(data);

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(message);
  } else {
    console.log("웹 환경:", data);
  }
};

export type HapticStyle =
  | "selection"
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error";

//앱에서는 네이티브 햅틱을, 웹에서는 진동 API를 사용해 동일한 피드백
export const triggerHaptic = (style: HapticStyle = "selection") => {
  if (window.ReactNativeWebView) {
    sendToApp({
      type: "HAPTIC",
      payload: {
        style,
      },
    });
    return;
  }

  navigator.vibrate?.(style === "heavy" ? 32 : style === "medium" ? 22 : 12);
};
