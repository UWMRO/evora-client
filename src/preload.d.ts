/* eslint-disable @typescript-eslint/no-explicit-any */

declare module './*.js?url' {
  const value: string;
  export = value;
}

declare module '/*.png' {
  const value: any;
  export = value;
}

declare global {
  interface Window {
    JS9: any;
  }
}

export {};
