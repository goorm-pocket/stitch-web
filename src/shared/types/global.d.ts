export {};

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    __STITCH_APP_CONTEXT__?: unknown;
    __STITCH_DEVICE_MOTION__?: unknown;
    __STITCH_PUSH_TOKEN__?: unknown;
  }
  interface DocumentEventMap {
    message: MessageEvent;
  }
}
