import { showIbaseLoading } from './show-loading';
import type { IbaseLoadingOptions } from './types';
export async function runWithIbaseLoading<T>(task: () => Promise<T>, options?: IbaseLoadingOptions): Promise<T> { const loading = showIbaseLoading(options); try { return await task(); } finally { loading.close(); } }
