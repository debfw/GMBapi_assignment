import fetch from "@/services/client";
import type {
  GetAccountKPIsQueryResponse,
  GetAccountKPIs400,
  GetAccountKPIs401,
  GetAccountKPIs500,
} from "../types/GetAccountKPIs.ts";
import type { RequestConfig, ResponseErrorConfig } from "@/services/client";
import type {
  QueryKey,
  QueryClient,
  QueryObserverOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getAccountKPIsQueryKey = () =>
  [{ url: "/external-api/gmb/review/kpi" }] as const;

export type GetAccountKPIsQueryKey = ReturnType<typeof getAccountKPIsQueryKey>;

/**
 * @description Retrieves review KPIs based on Account Id
 * @summary Get Account KPIs
 * {@link /external-api/gmb/review/kpi}
 */
export async function getAccountKPIs(
  config: Partial<RequestConfig> & { client?: typeof fetch } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetAccountKPIsQueryResponse,
    ResponseErrorConfig<
      GetAccountKPIs400 | GetAccountKPIs401 | GetAccountKPIs500
    >,
    unknown
  >({ method: "GET", url: `/external-api/gmb/review/kpi`, ...requestConfig });
  return res.data;
}

export function getAccountKPIsQueryOptions(
  config: Partial<RequestConfig> & { client?: typeof fetch } = {},
) {
  const queryKey = getAccountKPIsQueryKey();
  return queryOptions<
    GetAccountKPIsQueryResponse,
    ResponseErrorConfig<
      GetAccountKPIs400 | GetAccountKPIs401 | GetAccountKPIs500
    >,
    GetAccountKPIsQueryResponse,
    typeof queryKey
  >({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal;
      return getAccountKPIs(config);
    },
  });
}

/**
 * @description Retrieves review KPIs based on Account Id
 * @summary Get Account KPIs
 * {@link /external-api/gmb/review/kpi}
 */
export function useGetAccountKPIs<
  TData = GetAccountKPIsQueryResponse,
  TQueryData = GetAccountKPIsQueryResponse,
  TQueryKey extends QueryKey = GetAccountKPIsQueryKey,
>(
  options: {
    query?: Partial<
      QueryObserverOptions<
        GetAccountKPIsQueryResponse,
        ResponseErrorConfig<
          GetAccountKPIs400 | GetAccountKPIs401 | GetAccountKPIs500
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
  const queryKey = queryOptions?.queryKey ?? getAccountKPIsQueryKey();

  const query = useQuery(
    {
      ...getAccountKPIsQueryOptions(config),
      queryKey,
      ...queryOptions,
    } as unknown as QueryObserverOptions,
    queryClient,
  ) as UseQueryResult<
    TData,
    ResponseErrorConfig<
      GetAccountKPIs400 | GetAccountKPIs401 | GetAccountKPIs500
    >
  > & { queryKey: TQueryKey };

  query.queryKey = queryKey as TQueryKey;

  return query;
}
