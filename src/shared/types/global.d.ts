export {};

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    __STITCH_DEVICE_MOTION__?: unknown;
  }
}
