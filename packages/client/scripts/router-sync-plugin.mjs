import fs from 'node:fs';
import path from 'node:path';
import { syncRouters } from './sync-routers.mjs';

const ROUTE_FILE_NAMES = new Set([
  'layout.tsx',
  'page.tsx',
  'entry.server.tsx',
  'loading.tsx',
  'error.tsx',
]);

function isRouteSourceFile(filePath, routersDir) {
  const relative = path.relative(routersDir, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return false;
  if (!relative.endsWith('.tsx')) return false;

  const baseName = path.basename(relative);
  if (ROUTE_FILE_NAMES.has(baseName)) return true;

  return relative.includes('/');
}

/** Re-syncs `routers/` → `.router-runtime/` when route sources change. */
export function routerSyncPlugin(webRoot, clientRoot, webConfig) {
  let server;
  let timer;

  const routerDirs = [
    path.join(webRoot, 'routers'),
    path.join(clientRoot, 'routers'),
  ].filter((dir) => fs.existsSync(dir));

  const runSync = () => {
    syncRouters(webRoot, clientRoot, webConfig);
    server?.ws.send({ type: 'full-reload' });
  };

  const scheduleSync = (filePath) => {
    const matched = routerDirs.some((dir) => isRouteSourceFile(filePath, dir));
    if (!matched) return;

    clearTimeout(timer);
    timer = setTimeout(runSync, 80);
  };

  return {
    name: 'duneta-router-sync',
    apply: 'serve',
    configureServer(devServer) {
      server = devServer;

      for (const dir of routerDirs) {
        devServer.watcher.add(dir);
      }

      devServer.watcher.on('change', scheduleSync);
      devServer.watcher.on('add', scheduleSync);
      devServer.watcher.on('unlink', scheduleSync);
    },
  };
}
