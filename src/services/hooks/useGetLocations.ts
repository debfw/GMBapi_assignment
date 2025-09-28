import fetch from "@/services/client";
import type {
  GetLocationsQueryResponse,
  GetLocationsQueryParams,
  GetLocations400,
  GetLocations401,
  GetLocations500,
} from "../types/GetLocations.ts";
import type { RequestConfig, ResponseErrorConfig } from "@/services/client";
import type {
  QueryKey,
  QueryClient,
  QueryObserverOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getLocationsQueryKey = (params?: GetLocationsQueryParams) =>
  [{ url: "/external-api/gmb/location" }, ...(params ? [params] : [])] as const;

export type GetLocationsQueryKey = ReturnType<typeof getLocationsQueryKey>;

/**
 * @description List GMB locations for the current account
 * @summary List GMB locations
 * {@link /external-api/gmb/location}
 */
export async function getLocations(
  params?: GetLocationsQueryParams,
  config: Partial<RequestConfig> & { client?: typeof fetch } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  const res = await request<
    GetLocationsQueryResponse,
    ResponseErrorConfig<GetLocations400 | GetLocations401 | GetLocations500>,
    unknown
  >({
    method: "GET",
    url: `/external-api/gmb/location${queryString}`,
    ...requestConfig,
  });
  return res.data;
}

export function getLocationsQueryOptions(
  params?: GetLocationsQueryParams,
  config: Partial<RequestConfig> & { client?: typeof fetch } = {},
) {
  const queryKey = getLocationsQueryKey(params);
  return queryOptions<
    GetLocationsQueryResponse,
    ResponseErrorConfig<GetLocations400 | GetLocations401 | GetLocations500>,
    GetLocationsQueryResponse,
    typeof queryKey
  >({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal;
      return getLocations(params, config);
    },
  });
}

/**
 * @description List GMB locations for the current account
 * @summary List GMB locations
 * {@link /external-api/gmb/location}
 */
export function useGetLocations<
  TData = GetLocationsQueryResponse,
  TQueryData = GetLocationsQueryResponse,
  TQueryKey extends QueryKey = GetLocationsQueryKey,
>(
  params?: GetLocationsQueryParams,
  options: {
    query?: Partial<
      QueryObserverOptions<
        GetLocationsQueryResponse,
        ResponseErrorConfig<
          GetLocations400 | GetLocations401 | GetLocations500
        >,
        TData,
        TQueryData,
        TQueryKey
      >
    > & { client?: QueryClient };
    client?: Partial<RequestConfig> & { client?: typeof fetch };
  } = {},
) {
  const { query: queryConfig = {}, client: config = {} } = options ?? {};
  const { client: queryClient, ...queryOptions } = queryConfig;
  const queryKey = queryOptions?.queryKey ?? getLocationsQueryKey(params);

  const query = useQuery(
    {
      ...getLocationsQueryOptions(params, config),
      queryKey,
      ...queryOptions,
    } as unknown as QueryObserverOptions,
    queryClient,
  ) as UseQueryResult<
    TData,
    ResponseErrorConfig<GetLocations400 | GetLocations401 | GetLocations500>
  > & { queryKey: TQueryKey };

  query.queryKey = queryKey as TQueryKey;

  return query;
}
