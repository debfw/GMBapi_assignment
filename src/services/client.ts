export interface RequestConfig<T = any> {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers?: Record<string, string>;
  body?: T;
  data?: T;
  signal?: AbortSignal;
}

export interface ResponseErrorConfig<T = any> {
  status: number;
  message: string;
  data?: T;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

const BASE_URL = import.meta.env.VITE_GMBAPI_BASE_URL;

const defaultHeaders = {
  Authorization: import.meta.env.VITE_GMBAPI_TOKEN,
} as Record<string, string>;

async function client<T = any, E = any, B = any>(
  config: RequestConfig<B>
): Promise<ApiResponse<T>> {
  const { method = "GET", url, headers = {}, body, data, signal } = config;
  const requestBody = body || data;

  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

  const requestHeaders: Record<string, string> = {
    ...defaultHeaders,
    ...headers,
  };

  if (
    requestBody !== undefined &&
    requestHeaders["Content-Type"] === undefined
  ) {
    requestHeaders["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
      signal,
    });

    let responseData: any = null;
    const hasBody =
      response.status !== 204 && response.headers.get("content-length") !== "0";
    if (hasBody) {
      const text = await response.text();
      try {
        responseData = text ? JSON.parse(text) : null;
      } catch (_e) {
        responseData = text;
      }
    }

    if (!response.ok) {
      const error: ResponseErrorConfig<E> = {
        status: response.status,
        message:
          (responseData &&
          typeof responseData === "object" &&
          "message" in responseData
            ? (responseData as any).message
            : undefined) || response.statusText,
        data: responseData,
      };
      throw error;
    }

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }

    const networkError: ResponseErrorConfig<E> = {
      status: 0,
      message: error instanceof Error ? error.message : "Network error",
    };
    throw networkError;
  }
}

export default client;
