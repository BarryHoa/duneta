import {
  useQuery,
  useSuspenseQuery,
  type UseQueryOptions,
  type UseQueryResult,
  type UseSuspenseQueryOptions,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query';
import { http } from '../http/http-service.js';
import type { BaseHttpService } from '../http/base-http-service.js';
import type { HttpRequestOptions } from '../http/types.js';
import { createHttpQueryDefinition } from './http-query-definition.js';
import { DUNETA_SSR_QUERY_META } from './ssr-state.js';
import type { httpQueryKey } from './client.js';

type HttpQueryKey = ReturnType<typeof httpQueryKey>;

type SharedHttpQueryOptions<T> = {
  client?: BaseHttpService;
  request?: Omit<HttpRequestOptions, 'path' | 'responseType'>;
  /** Prefetch on the server during SSR and hydrate on the client (requires `<Suspense>`). */
  ssr?: boolean;
};

export type UseHttpQueryOptions<T> = SharedHttpQueryOptions<T> &
  Omit<UseQueryOptions<T, Error, T, HttpQueryKey>, 'queryKey' | 'queryFn'>;

export type UseHttpSuspenseQueryOptions<T> = SharedHttpQueryOptions<T> &
  Omit<UseSuspenseQueryOptions<T, Error, T, HttpQueryKey>, 'queryKey' | 'queryFn'>;

export function useHttpQuery<T = unknown>(
  path: string,
  options: UseHttpQueryOptions<T> & { ssr?: false },
): UseQueryResult<T, Error>;

export function useHttpQuery<T = unknown>(
  path: string,
  options: UseHttpSuspenseQueryOptions<T> & { ssr: true },
): UseSuspenseQueryResult<T, Error>;

export function useHttpQuery<T = unknown>(
  path: string,
  options: UseHttpQueryOptions<T> | UseHttpSuspenseQueryOptions<T> = {},
) {
  const { client = http, request, ssr = false, ...queryOptions } = options;
  const definition = createHttpQueryDefinition<T>(path, { client, request });

  if (ssr) {
    return useSuspenseQuery({
      ...queryOptions,
      ...definition,
      meta: { [DUNETA_SSR_QUERY_META]: true, ...queryOptions.meta },
    });
  }

  return useQuery({
    ...queryOptions,
    ...definition,
  });
}
