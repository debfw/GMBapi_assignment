import { http, HttpResponse } from "msw";

// Mock data matching the actual API response structure
export const mockReviews = [
  {
    account_id: "demo250",
    comment_en: "Excellent service! Highly recommended.",
    comment_native: "Excellent service! Highly recommended.",
    created_date: 1758512460876864,
    has_comment: 1,
    is_deleted: 0,
    location_id: "131",
    profilePhotoUrl:
      "https://ui-avatars.com/api/?name=John Doe&size=128&background=40E0D0",
    rating: 5,
    reply: 0,
    reply_comment: "",
    reply_date: null,
    response_time: null,
    review_name: "834682",
    reviewerName: "John Doe",
    update_date: 1758512460876864,
  },
  {
    account_id: "demo250",
    comment_en: "Good experience overall, but could be better.",
    comment_native: "Good experience overall, but could be better.",
    created_date: 1758505325876864,
    has_comment: 1,
    is_deleted: 0,
    location_id: "48",
    profilePhotoUrl:
      "https://ui-avatars.com/api/?name=Jane Smith&size=128&background=40E0D0",
    rating: 4,
    reply: 1,
    reply_comment: "Thank you for your feedback!",
    reply_date: 1759117260876864,
    response_time: 168,
    review_name: "801372",
    reviewerName: "Jane Smith",
    update_date: 1758505325876864,
  },
];

export const mockReviewListResponse = {
  metadata: {
    pages: 1,
    results_per_page: 10,
    current_page: 1,
    results: 2,
  },
  data: mockReviews,
};

export const mockReviewReplyResponse = {
  id: "reply-1",
  text: "Thank you for your feedback!",
  date: "2024-01-15T11:00:00Z",
  isPublic: true,
};

// MSW handlers
export const handlers = [
  // Get reviews (POST endpoint as per API schema)
  http.post(
    "https://gmbapi-external-api-800414123378.europe-west4.run.app/external-api/gmb/review/account",
    () => {
      return HttpResponse.json(mockReviewListResponse);
    }
  ),

  // Reply to review
  http.post(
    "https://gmbapi-external-api-800414123378.europe-west4.run.app/external-api/gmb/review/:reviewId/reply",
    () => {
      return HttpResponse.json(mockReviewReplyResponse);
    }
  ),

  // Get locations
  http.get(
    "https://gmbapi-external-api-800414123378.europe-west4.run.app/external-api/gmb/locations",
    () => {
      return HttpResponse.json({
        locations: [
          { id: "1", name: "Main Street Location" },
          { id: "2", name: "Downtown Location" },
        ],
      });
    }
  ),
];
