export const sendToApp = (data: unknown) => {
  const message = JSON.stringify(data);

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(message);
  } else {
    console.log("웹 환경:", data);
  }
};
