export {};

declare global {
  interface Window {
    _agl?: {
      push: (...args: any[]) => void;
    };
    gtag?: (...args: any[]) => void;  // Tambahkan ini supaya tidak error saat pakai window.gtag
  }
}
