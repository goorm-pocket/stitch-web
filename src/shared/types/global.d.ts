export {};

declare global {
  interface Window {
    //웹-앱 브리지 객체
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    //컨텍스트와 기기 정보
    __STITCH_APP_CONTEXT__?: unknown;
    __STITCH_DEVICE_MOTION__?: unknown;
    __STITCH_PUSH_TOKEN__?: unknown;
  }
  interface DocumentEventMap {
    message: MessageEvent;
  }
}
