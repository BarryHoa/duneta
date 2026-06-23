import { pathToFileURL } from 'node:url';
import { bootNodeServer, handleWorkerFetch } from './entry.js';

function isNodeCliEntry() {
  if (typeof process === 'undefined' || !process.argv[1]) return false;

  try {
    return pathToFileURL(process.argv[1]).href === import.meta.url;
  } catch {
    return process.argv[1].endsWith('server.ts');
  }
}

if (isNodeCliEntry()) {
  await bootNodeServer();
}

export default {
  fetch: handleWorkerFetch,
};
