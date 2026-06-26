export type ThemeMode = 'dark' | 'light' | 'system';

export type DunetaWebConfig = {
  app: {
    name: string;
    env: 'development' | 'production' | 'test';
  };
  api: {
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
