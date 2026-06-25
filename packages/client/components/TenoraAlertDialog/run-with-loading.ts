import { showTenoraLoading } from './show-loading';
import type { TenoraLoadingOptions } from './types';
export async function runWithTenoraLoading<T>(task: () => Promise<T>, options?: TenoraLoadingOptions): Promise<T> { const loading = showTenoraLoading(options); try { return await task(); } finally { loading.close(); } }
