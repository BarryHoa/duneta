export type TenoraWebConfig = {
  app: {
    name: string;
    port: number;
  };
  api: {
    port: number;
    proxyTarget: string;
    baseUrl: string;
  };
  router: {
    appDirectory: string;
  };
};
