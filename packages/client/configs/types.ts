export type ThemeMode = 'dark' | 'light' | 'system';

export type DunetaWebConfig = {
  app: {
    name: string;
    port: number;
    env: 'development' | 'production' | 'test';
  };
  api: {
    port: number;
    proxyTarget?: string;
    baseUrl: string;
  };
  router: {
    appDirectory: string;
    ssr: {
      streamTimeout: number;
    };
  };
  theme: {
    default: ThemeMode;
  };
};
