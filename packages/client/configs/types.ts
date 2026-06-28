export type ThemeMode = 'dark' | 'light' | 'system';

/** Web image display — `DunetaImage` srcset widths and default quality. */
export type ImageConfig = {
  deviceSizes: number[];
  imageSizes: number[];
  quality: number;
};

export type LocaleConfig = {
  default: string;
  supported: string[];
};

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
    buildDirectory: string;
    ssr: {
      streamTimeout: number;
    };
  };
  theme: {
    default: ThemeMode;
  };
  locale: LocaleConfig;
  image: ImageConfig;
};
