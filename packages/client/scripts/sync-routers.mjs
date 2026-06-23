#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROUTE_FILES = new Set(['layout.tsx', 'page.tsx', 'entry.server.tsx', 'loading.tsx', 'error.tsx']);

/**
 * Merge app/web/routers (overrides) with packages/client/routers (defaults)
 * into .router-runtime/ for React Router.
 */
export function syncRouters(webRoot, clientRoot) {
  const webRouters = path.join(webRoot, 'routers');
  const clientRouters = path.join(clientRoot, 'routers');
  const outDir = path.join(webRoot, '.router-runtime');

  if (!fs.existsSync(clientRouters)) {
    throw new Error(`Missing default routers at ${clientRouters}`);
  }

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const merged = new Map();

  collectRouteFiles(clientRouters, '', merged, 'client');
  if (fs.existsSync(webRouters)) {
    collectRouteFiles(webRouters, '', merged, 'web');
  }

  for (const [rel, source] of merged) {
    const src =
      source === 'web' ? path.join(webRouters, rel) : path.join(clientRouters, rel);
    const dest = path.join(outDir, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    if (rel.endsWith('layout.tsx')) {
      const content = fs
        .readFileSync(src, 'utf8')
        .replace(
          /@tenora\/client\/themes\/globals\.css/g,
          '~/themes/globals.css',
        );
      fs.writeFileSync(dest, content);
      continue;
    }

    fs.copyFileSync(src, dest);
  }

  const layoutFile = path.join(outDir, 'layout.tsx');
  if (!fs.existsSync(layoutFile)) {
    throw new Error('A root layout.tsx is required in routers/ (packages/client/routers or app/web/routers).');
  }

  fs.copyFileSync(layoutFile, path.join(outDir, 'root.tsx'));

  const routesTs = generateRoutesTs(outDir);
  fs.writeFileSync(path.join(outDir, 'routes.ts'), routesTs);

  return outDir;
}

function collectRouteFiles(baseDir, relDir, merged, source) {
  if (!fs.existsSync(baseDir)) return;

  for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;

    const rel = relDir ? path.posix.join(relDir, entry.name) : entry.name;

    if (entry.isDirectory()) {
      collectRouteFiles(path.join(baseDir, entry.name), rel, merged, source);
      continue;
    }

    if (!ROUTE_FILES.has(entry.name) && !entry.name.endsWith('.tsx')) continue;
    if (!entry.name.endsWith('.tsx')) continue;

    merged.set(rel, source);
  }
}

function buildRouteTree(relDir, outDir) {
  const absDir = path.join(outDir, relDir);
  if (!fs.existsSync(absDir)) return [];

  const routes = [];
  const subdirs = fs
    .readdirSync(absDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name)
    .sort();

  for (const name of subdirs) {
    const childRel = relDir ? `${relDir}/${name}` : name;
    const childDir = path.join(absDir, name);
    const hasLayout = fs.existsSync(path.join(childDir, 'layout.tsx'));
    const hasPage = fs.existsSync(path.join(childDir, 'page.tsx'));

    if (hasLayout) {
      const children = [];
      if (hasPage) {
        children.push({ type: 'index', file: `${childRel}/page.tsx` });
      }
      children.push(...buildRouteTree(childRel, outDir));
      routes.push({ type: 'layout', file: `${childRel}/layout.tsx`, children });
      continue;
    }

    if (hasPage) {
      const nested = buildRouteTree(childRel, outDir);
      if (nested.length === 0) {
        routes.push({ type: 'route', path: name, file: `${childRel}/page.tsx` });
      } else {
        routes.push({ type: 'route', path: name, file: `${childRel}/page.tsx`, children: nested });
      }
      continue;
    }

    const nested = buildRouteTree(childRel, outDir);
    if (nested.length > 0) {
      routes.push({ type: 'prefix', path: name, children: nested });
    }
  }

  return routes;
}

function emitRouteNodes(nodes, indent) {
  const pad = ' '.repeat(indent);
  const lines = [];

  for (const node of nodes) {
    if (node.type === 'index') {
      lines.push(`${pad}index('${node.file}'),`);
      continue;
    }

    if (node.type === 'route') {
      if (node.children?.length) {
        lines.push(`${pad}route('${node.path}', '${node.file}', [`);
        lines.push(...emitRouteNodes(node.children, indent + 2));
        lines.push(`${pad}]),`);
      } else {
        lines.push(`${pad}route('${node.path}', '${node.file}'),`);
      }
      continue;
    }

    if (node.type === 'layout') {
      lines.push(`${pad}layout('${node.file}', [`);
      lines.push(...emitRouteNodes(node.children, indent + 2));
      lines.push(`${pad}]),`);
      continue;
    }

    if (node.type === 'prefix') {
      lines.push(`${pad}...prefix('${node.path}', [`);
      lines.push(...emitRouteNodes(node.children, indent + 2));
      lines.push(`${pad}]),`);
    }
  }

  return lines;
}

function generateRoutesTs(outDir) {
  const routes = [];

  if (fs.existsSync(path.join(outDir, 'page.tsx'))) {
    routes.push({ type: 'index', file: 'page.tsx' });
  }

  routes.push(...buildRouteTree('', outDir));

  const body = emitRouteNodes(routes, 2).join('\n');

  return `import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
${body}
] satisfies RouteConfig;
`;
}

if (import.meta.url === pathToFileURL(path.resolve(process.argv[1] ?? '')).href) {
  const webRoot = process.cwd();
  const clientRoot =
    process.env.TENORA_CLIENT_ROOT ??
    path.resolve(webRoot, 'node_modules/@tenora/client');

  syncRouters(webRoot, clientRoot);
}
