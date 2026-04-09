export {};

declare global {
  interface Window {
    __ENV__?: {
      VITE_SERVICE_BASE_URL?: string;
      VITE_OTHER_SERVICE_BASE_URL?: string;
      [key: string]: string | undefined;
    };
  }
}
