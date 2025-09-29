import fetch from "@/services/client";
import type {
  GetLocationReviewsMutationRequest,
  GetLocationReviewsMutationResponse,
  GetLocationReviews400,
  GetLocationReviews401,
  GetLocationReviews500,
} from "../types/GetLocationReviews.ts";
import type { RequestConfig, ResponseErrorConfig } from "@/services/client";
import type {
  UseMutationOptions,
  UseMutationResult,
  QueryClient,
} from "@tanstack/react-query";
import { mutationOptions, useMutation } from "@tanstack/react-query";

export const getLocationReviewsMutationKey = () =>
  [{ url: "/external-api/gmb/review/location" }] as const;

export type GetLocationReviewsMutationKey = ReturnType<
  typeof getLocationReviewsMutationKey
>;

/**
 * @description Get reviews for a specific location with filtering and pagination options
 * @summary Get Location Reviews
 * {@link /external-api/gmb/review/location}
 */
export async function getLocationReviews(
  data?: GetLocationReviewsMutationRequest,
  config: Partial<RequestConfig<GetLocationReviewsMutationRequest>> & {
    client?: typeof fetch;
  } = {}
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    GetLocationReviewsMutationResponse,
    ResponseErrorConfig<
      GetLocationReviews400 | GetLocationReviews401 | GetLocationReviews500
    >,
    GetLocationReviewsMutationRequest
  >({
    method: "POST",
    url: `/external-api/gmb/review/location`,
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

export function getLocationReviewsMutationOptions(
  config: Partial<RequestConfig<GetLocationReviewsMutationRequest>> & {
    client?: typeof fetch;
  } = {}
) {
  const mutationKey = getLocationReviewsMutationKey();
  return mutationOptions<
    GetLocationReviewsMutationResponse,
    ResponseErrorConfig<
      GetLocationReviews400 | GetLocationReviews401 | GetLocationReviews500
    >,
    { data?: GetLocationReviewsMutationRequest },
    typeof mutationKey
  >({
    mutationKey,
    mutationFn: async ({ data }) => {
      return getLocationReviews(data, config);
    },
  });
}

/**
 * @description Get reviews for a specific location with filtering and pagination options
 * @summary Get Location Reviews
 * {@link /external-api/gmb/review/location}
 */
export function useGetLocationReviews<TContext>(
  options: {
    mutation?: UseMutationOptions<
      GetLocationReviewsMutationResponse,
      ResponseErrorConfig<
        GetLocationReviews400 | GetLocationReviews401 | GetLocationReviews500
      >,
      { data?: GetLocationReviewsMutationRequest },
      TContext
    > & { client?: QueryClient };
    client?: Partial<RequestConfig<GetLocationReviewsMutationRequest>> & {
      client?: typeof fetch;
    };
  } = {}
) {
  const { mutation = {}, client: config = {} } = options ?? {};
  const { client: queryClient, ...mutationOptions } = mutation;
  const mutationKey =
    mutationOptions.mutationKey ?? getLocationReviewsMutationKey();

  return useMutation(
    {
      ...getLocationReviewsMutationOptions(config),
      mutationKey,
      ...mutationOptions,
    } as UseMutationOptions<
      GetLocationReviewsMutationResponse,
      ResponseErrorConfig<
        GetLocationReviews400 | GetLocationReviews401 | GetLocationReviews500
      >,
      { data?: GetLocationReviewsMutationRequest },
      TContext
    >,
    queryClient
  ) as UseMutationResult<
    GetLocationReviewsMutationResponse,
    ResponseErrorConfig<
      GetLocationReviews400 | GetLocationReviews401 | GetLocationReviews500
    >,
    { data?: GetLocationReviewsMutationRequest },
    TContext
  >;
}
