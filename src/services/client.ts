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

const BASE_URL = import.meta.env.VITE_GMBAPI_BASE_URL as string | undefined;
const TOKEN = import.meta.env.VITE_GMBAPI_TOKEN as string | undefined;

const defaultHeaders: Record<string, string> = {};
if (TOKEN && TOKEN.trim().length > 0) {
  defaultHeaders["Authorization"] = TOKEN;
}

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
    if (!BASE_URL) {
      throw new Error(
        "Missing VITE_GMBAPI_BASE_URL. Define it in .env.local and restart the dev server."
      );
    }
    const response = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
      signal,
    });

    let responseData: any = null;
    const contentType = response.headers.get("content-type") || "";
    const hasBody = response.status !== 204;
    if (hasBody) {
      if (contentType.includes("application/json")) {
        const text = await response.text();
        responseData = text ? JSON.parse(text) : null;
      } else if (contentType.includes("text/")) {
        responseData = await response.text();
      } else if (contentType.includes("application/octet-stream")) {
        responseData = await response.arrayBuffer();
      } else {
        try {
          const text = await response.text();
          responseData = text;
        } catch (_e) {
          responseData = null;
        }
      }
    }

    if (!response.ok) {
      throw normalizeError<E>(
        response.status,
        response.statusText,
        responseData
      );
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
      throw error as ResponseErrorConfig<E>;
    }

    throw normalizeError<E>(0, "Network error", undefined, error);
  }
}

export default client;

export function normalizeError<E = any>(
  status: number,
  fallbackStatusText: string,
  data?: unknown,
  original?: unknown
): ResponseErrorConfig<E> {
  let message = fallbackStatusText || "Error";

  if (data && typeof data === "object") {
    const obj = data as Record<string, any>;
    if (typeof obj.message === "string" && obj.message.trim().length > 0) {
      message = obj.message;
    }
  }

  if (!message && original instanceof Error) {
    message = original.message;
  }

  return {
    status,
    message,
    data: data as E,
  };
}
