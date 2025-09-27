import type { Review } from "@/services/types";

export interface RawReview {
  account_id: string;
  comment_en: string;
  comment_native: string;
  created_date: number;
  has_comment: number;
  is_deleted: number;
  location_id: string;
  profilePhotoUrl: string | null;
  rating: number;
  reply: number;
  reply_comment: string;
  reply_date: number | null;
  response_time: number | null;
  review_name: string;
  reviewerName: string;
  update_date: number;
}

export interface RawReviewListResponse {
  metadata: {
    pages: number;
    results_per_page: number;
    current_page: number;
    results: number;
  };
  data: RawReview[];
}

export function transformRawReview(rawReview: RawReview): Review {
  const formatTimestamp = (timestamp: number): string => {
    const convertedMicroseconds = timestamp / 1000000;
    const convertedSeconds = timestamp / 1000000000;
    const convertedNanoseconds = timestamp / 1000;
    const directMilliseconds = timestamp;

    const dateMicroseconds = new Date(convertedMicroseconds);
    const dateSeconds = new Date(convertedSeconds);
    const dateNanoseconds = new Date(convertedNanoseconds);
    const dateDirect = new Date(directMilliseconds);


    let result;
    if (dateDirect.getFullYear() > 2000 && dateDirect.getFullYear() < 2030) {
      result = dateDirect.toISOString();
    } else if (
      dateNanoseconds.getFullYear() > 2000 &&
      dateNanoseconds.getFullYear() < 2030
    ) {
      result = dateNanoseconds.toISOString();
    } else if (
      dateMicroseconds.getFullYear() > 2000 &&
      dateMicroseconds.getFullYear() < 2030
    ) {
      result = dateMicroseconds.toISOString();
    } else {
      result = dateSeconds.toISOString();
    }


    return result;
  };

  const getStatus = (
    reply: number,
    isDeleted: number
  ): "new" | "replied" | "hidden" | "flagged" => {
    if (isDeleted === 1) return "hidden";
    if (reply === 1) return "replied";
    return "new";
  };

  return {
    id: rawReview.review_name,
    customerName: rawReview.reviewerName,
    customerPhoto: rawReview.profilePhotoUrl || undefined,
    rating: rawReview.rating,
    comment: rawReview.comment_en || rawReview.comment_native,
    date: formatTimestamp(rawReview.created_date),
    locationId: rawReview.location_id,
    locationName: `Location ${rawReview.location_id}`,
    status: getStatus(rawReview.reply, rawReview.is_deleted),
    businessReply:
      rawReview.reply === 1 && rawReview.reply_comment
        ? {
            id: `reply-${rawReview.review_name}`,
            text: rawReview.reply_comment,
            date: rawReview.reply_date
              ? formatTimestamp(rawReview.reply_date)
              : formatTimestamp(rawReview.update_date),
            isPublic: true,
          }
        : undefined,
    helpfulVotes: 0,
    photos: [],
  };
}

export function transformReviewListResponse(
  rawResponse: RawReviewListResponse
) {
  const reviews = rawResponse.data.map(transformRawReview);

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  const ratingDistribution = {
    "1": reviews.filter((r) => r.rating === 1).length,
    "2": reviews.filter((r) => r.rating === 2).length,
    "3": reviews.filter((r) => r.rating === 3).length,
    "4": reviews.filter((r) => r.rating === 4).length,
    "5": reviews.filter((r) => r.rating === 5).length,
  };

  const result = {
    reviews,
    pagination: {
      page: rawResponse.metadata.current_page,
      limit: rawResponse.metadata.results_per_page,
      total: rawResponse.metadata.results,
      totalPages: rawResponse.metadata.pages,
      hasNext: rawResponse.metadata.current_page < rawResponse.metadata.pages,
      hasPrev: rawResponse.metadata.current_page > 1,
    },
    summary: {
      total: rawResponse.metadata.results,
      averageRating,
      ratingDistribution,
    },
  };

  return result;
}
