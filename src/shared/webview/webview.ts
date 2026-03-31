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
