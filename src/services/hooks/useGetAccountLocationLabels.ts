import fetch from "@/services/client";
import type {
  GetAccountLocationLabelsQueryResponse,
  GetAccountLocationLabels400,
  GetAccountLocationLabels401,
  GetAccountLocationLabels500,
} from "../types/GetAccountLocationLabels.ts";
import type { RequestConfig, ResponseErrorConfig } from "@/services/client";
import type {
  QueryKey,
  QueryClient,
  QueryObserverOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getAccountLocationLabelsQueryKey = () =>
  [{ url: "/external-api/gmb/account_location/labels" }] as const;

export type GetAccountLocationLabelsQueryKey = ReturnType<
  typeof getAccountLocationLabelsQueryKey
>;

/**
 * @description Retrieves all account(location group) labels by {account_id}
 * @summary Get Account Location Labels
 * {@link /external-api/gmb/account_location/labels}
 */
export async function getAccountLocationLabels(
  config: Partial<RequestConfig> & { client?: typeof fetch } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetAccountLocationLabelsQueryResponse,
    ResponseErrorConfig<
      | GetAccountLocationLabels400
      | GetAccountLocationLabels401
      | GetAccountLocationLabels500
    >,
    unknown
  >({
    method: "GET",
    url: `/external-api/gmb/account_location/labels`,
    ...requestConfig,
  });
  return res.data;
}

export function getAccountLocationLabelsQueryOptions(
  config: Partial<RequestConfig> & { client?: typeof fetch } = {},
) {
  const queryKey = getAccountLocationLabelsQueryKey();
  return queryOptions<
    GetAccountLocationLabelsQueryResponse,
    ResponseErrorConfig<
      | GetAccountLocationLabels400
      | GetAccountLocationLabels401
      | GetAccountLocationLabels500
    >,
    GetAccountLocationLabelsQueryResponse,
    typeof queryKey
  >({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal;
      return getAccountLocationLabels(config);
    },
  });
}

/**
 * @description Retrieves all account(location group) labels by {account_id}
 * @summary Get Account Location Labels
 * {@link /external-api/gmb/account_location/labels}
 */
export function useGetAccountLocationLabels<
  TData = GetAccountLocationLabelsQueryResponse,
  TQueryData = GetAccountLocationLabelsQueryResponse,
  TQueryKey extends QueryKey = GetAccountLocationLabelsQueryKey,
>(
  options: {
    query?: Partial<
      QueryObserverOptions<
        GetAccountLocationLabelsQueryResponse,
        ResponseErrorConfig<
          | GetAccountLocationLabels400
          | GetAccountLocationLabels401
          | GetAccountLocationLabels500
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
  const queryKey = queryOptions?.queryKey ?? getAccountLocationLabelsQueryKey();

  const query = useQuery(
    {
      ...getAccountLocationLabelsQueryOptions(config),
      queryKey,
      ...queryOptions,
    } as unknown as QueryObserverOptions,
    queryClient,
  ) as UseQueryResult<
    TData,
    ResponseErrorConfig<
      | GetAccountLocationLabels400
      | GetAccountLocationLabels401
      | GetAccountLocationLabels500
    >
  > & { queryKey: TQueryKey };

  query.queryKey = queryKey as TQueryKey;

  return query;
}
