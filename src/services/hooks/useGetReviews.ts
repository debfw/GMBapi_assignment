import fetch from "@/services/client";
import type {
  GetReviewsMutationRequest,
  GetReviewsMutationResponse,
  GetReviews400,
  GetReviews401,
  GetReviews500,
} from "../types/GetReviews.ts";
import type { RequestConfig, ResponseErrorConfig } from "@/services/client";
import type {
  UseMutationOptions,
  UseMutationResult,
  QueryClient,
} from "@tanstack/react-query";
import { mutationOptions, useMutation } from "@tanstack/react-query";

export const getReviewsMutationKey = () =>
  [{ url: "/external-api/gmb/review/account" }] as const;

export type GetReviewsMutationKey = ReturnType<typeof getReviewsMutationKey>;

/**
 * @description Retrieve reviews with filtering and pagination options
 * @summary Get reviews
 * {@link /external-api/gmb/review/account}
 */
export async function getReviews(
  data?: GetReviewsMutationRequest,
  config: Partial<RequestConfig<GetReviewsMutationRequest>> & {
    client?: typeof fetch;
  } = {}
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    GetReviewsMutationResponse,
    ResponseErrorConfig<GetReviews400 | GetReviews401 | GetReviews500>,
    GetReviewsMutationRequest
  >({
    method: "POST",
    url: `/external-api/gmb/review/account`,
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

export function getReviewsMutationOptions(
  config: Partial<RequestConfig<GetReviewsMutationRequest>> & {
    client?: typeof fetch;
  } = {}
) {
  const mutationKey = getReviewsMutationKey();
  return mutationOptions<
    GetReviewsMutationResponse,
    ResponseErrorConfig<GetReviews400 | GetReviews401 | GetReviews500>,
    { data?: GetReviewsMutationRequest },
    typeof mutationKey
  >({
    mutationKey,
    mutationFn: async ({ data }) => {
      return getReviews(data, config);
    },
  });
}

/**
 * @description Retrieve reviews with filtering and pagination options
 * @summary Get reviews
 * {@link /external-api/gmb/review/account}
 */
export function useGetReviews<TContext>(
  options: {
    mutation?: UseMutationOptions<
      GetReviewsMutationResponse,
      ResponseErrorConfig<GetReviews400 | GetReviews401 | GetReviews500>,
      { data?: GetReviewsMutationRequest },
      TContext
    > & { client?: QueryClient };
    client?: Partial<RequestConfig<GetReviewsMutationRequest>> & {
      client?: typeof fetch;
    };
  } = {}
) {
  const { mutation = {}, client: config = {} } = options ?? {};
  const { client: queryClient, ...mutationOptions } = mutation;
  const mutationKey = mutationOptions.mutationKey ?? getReviewsMutationKey();

  return useMutation(
    {
      ...getReviewsMutationOptions(config),
      mutationKey,
      ...mutationOptions,
    } as unknown as UseMutationOptions,
    queryClient
  ) as unknown as UseMutationResult<
    GetReviewsMutationResponse,
    ResponseErrorConfig<GetReviews400 | GetReviews401 | GetReviews500>,
    { data?: GetReviewsMutationRequest },
    TContext
  >;
}
