import { createDefaultRequestHeaders } from './default-headers.js';
import { HttpError } from './errors.js';
import { mergeHeaders, setHeaderIfMissing } from './merge-headers.js';
import { inferResponseType, parseContentDisposition, parseResponseBody } from './parse-response.js';
import { resolveUrl } from './resolve-url.js';
import type {
  HttpDownloadResult,
  HttpRequestOptions,
  HttpResponseType,
  HttpServiceOptions,
  HttpUploadOptions,
} from './types.js';

export abstract class BaseHttpService {
  constructor(protected readonly options: HttpServiceOptions = {}) {}

  protected abstract getBaseUrl(): string;

  protected getDefaultHeaders(): HeadersInit {
    return createDefaultRequestHeaders();
  }

  protected resolveUrl(
    path: string,
    params?: Record<string, string | number | boolean | null | undefined>,
  ): string {
    return resolveUrl(this.getBaseUrl(), path, params);
  }

  protected async onRequest(url: string, init: RequestInit): Promise<RequestInit> {
    return init;
  }

  protected async onError(response: Response): Promise<never> {
    throw await HttpError.fromResponse(response);
  }

  protected getFetcher(): typeof fetch {
    return this.options.fetch ?? fetch;
  }

  protected buildRequestInit(options: HttpRequestOptions): RequestInit {
    const { path: _path, params: _params, responseType: _responseType, json, timeout, headers, body, ...init } =
      options;

    const mergedHeaders = mergeHeaders(this.getDefaultHeaders(), this.options.defaultHeaders, headers);
    let requestBody = body ?? null;

    if (json !== undefined) {
      requestBody = JSON.stringify(json);
      setHeaderIfMissing(mergedHeaders, 'Content-Type', 'application/json');
    } else if (requestBody instanceof FormData) {
      mergedHeaders.delete('Content-Type');
    }

    let signal = init.signal;

    if (timeout !== undefined && signal === undefined) {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), timeout);
      signal = controller.signal;
    }

    return {
      ...init,
      body: requestBody,
      credentials: init.credentials ?? this.options.credentials ?? 'same-origin',
      headers: mergedHeaders,
      signal,
    };
  }

  async fetchResponse(options: HttpRequestOptions): Promise<Response> {
    const url = this.resolveUrl(options.path, options.params);
    const init = await this.onRequest(url, this.buildRequestInit(options));
    return this.getFetcher()(url, init);
  }

  async request<T = unknown>(options: HttpRequestOptions): Promise<T> {
    const response = await this.fetchResponse(options);

    if (!response.ok) {
      await this.onError(response);
    }

    const responseType: HttpResponseType =
      options.responseType === 'auto' || options.responseType === undefined
        ? inferResponseType(response)
        : options.responseType;

    return parseResponseBody<T>(response, responseType);
  }

  get<T = unknown>(path: string, options: Omit<HttpRequestOptions, 'path' | 'method'> = {}) {
    return this.request<T>({ ...options, path, method: 'GET' });
  }

  post<T = unknown>(path: string, options: Omit<HttpRequestOptions, 'path' | 'method'> = {}) {
    return this.request<T>({ ...options, path, method: 'POST' });
  }

  put<T = unknown>(path: string, options: Omit<HttpRequestOptions, 'path' | 'method'> = {}) {
    return this.request<T>({ ...options, path, method: 'PUT' });
  }

  patch<T = unknown>(path: string, options: Omit<HttpRequestOptions, 'path' | 'method'> = {}) {
    return this.request<T>({ ...options, path, method: 'PATCH' });
  }

  delete<T = unknown>(path: string, options: Omit<HttpRequestOptions, 'path' | 'method'> = {}) {
    return this.request<T>({ ...options, path, method: 'DELETE' });
  }

  json<T = unknown>(path: string, options: Omit<HttpRequestOptions, 'path' | 'responseType'> = {}) {
    return this.request<T>({ ...options, path, responseType: 'json' });
  }

  text(path: string, options: Omit<HttpRequestOptions, 'path' | 'responseType'> = {}) {
    return this.request<string>({ ...options, path, responseType: 'text' });
  }

  blob(path: string, options: Omit<HttpRequestOptions, 'path' | 'responseType'> = {}) {
    return this.request<Blob>({ ...options, path, responseType: 'blob' });
  }

  async stream(
    path: string,
    options: Omit<HttpRequestOptions, 'path' | 'responseType'> = {},
  ): Promise<ReadableStream<Uint8Array>> {
    return this.request<ReadableStream<Uint8Array>>({
      ...options,
      path,
      responseType: 'stream',
    });
  }

  upload<T = unknown>(path: string, options: HttpUploadOptions): Promise<T> {
    const { file, fieldName = 'file', filename, data, ...requestOptions } = options;
    const form = new FormData();

    form.append(fieldName, file, filename);
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        form.append(key, String(value));
      }
    }

    return this.request<T>({
      ...requestOptions,
      path,
      method: 'POST',
      body: form,
      responseType: requestOptions.responseType ?? 'json',
    });
  }

  async download(
    path: string,
    options: Omit<HttpRequestOptions, 'path' | 'responseType'> = {},
  ): Promise<HttpDownloadResult> {
    const response = await this.fetchResponse({ ...options, path, method: options.method ?? 'GET' });

    if (!response.ok) {
      await this.onError(response);
    }

    return {
      blob: await response.blob(),
      filename: parseContentDisposition(response.headers.get('content-disposition')),
      response,
    };
  }
}
