import {
  transformRawReview,
  transformReviewListResponse,
} from "@/utils/apiTransformers";

describe("apiTransformers", () => {
  describe("transformRawReview", () => {
    it("transforms raw review data correctly", () => {
      const mockRawReview = {
        account_id: "acc123",
        comment_en: "Great service!",
        comment_native: "Servicio excelente!",
        created_date: 1705314600000000, // 2024-01-15T10:30:00Z in microseconds (API format)
        has_comment: 1,
        is_deleted: 0,
        location_id: "loc123",
        profilePhotoUrl: "https://example.com/photo.jpg",
        rating: 5,
        reply: 0,
        reply_comment: "",
        reply_date: null,
        response_time: null,
        review_name: "review123",
        reviewerName: "John Doe",
        update_date: 1705312200000,
      };

      const result = transformRawReview(mockRawReview);

      expect(result).toEqual({
        id: "review123",
        customerName: "John Doe",
        customerPhoto: "https://example.com/photo.jpg",
        rating: 5,
        comment: "Great service!",
        date: "2024-01-15T10:30:00.000Z",
        locationId: "loc123",
        locationName: "Location loc123",
        status: "new",
        businessReply: undefined,
        helpfulVotes: 0,
        photos: [],
      });
    });

    it("transforms review with business reply", () => {
      const mockRawReview = {
        account_id: "acc123",
        comment_en: "Great service!",
        comment_native: "",
        created_date: 1705312200000,
        has_comment: 1,
        is_deleted: 0,
        location_id: "loc123",
        profilePhotoUrl: null,
        rating: 5,
        reply: 1,
        reply_comment: "Thank you for your feedback!",
        reply_date: 1705398600000, // 2024-01-16T09:00:00Z
        response_time: 86400000, // 1 day in milliseconds
        review_name: "review123",
        reviewerName: "John Doe",
        update_date: 1705398600000,
      };

      const result = transformRawReview(mockRawReview);

      expect(result.status).toBe("replied");
      expect(result.businessReply).toEqual({
        id: "reply-review123",
        text: "Thank you for your feedback!",
        date: "2024-01-16T09:50:00.000Z",
        isPublic: true,
      });
    });

    it("transforms deleted review", () => {
      const mockRawReview = {
        account_id: "acc123",
        comment_en: "Great service!",
        comment_native: "",
        created_date: 1705312200000,
        has_comment: 1,
        is_deleted: 1,
        location_id: "loc123",
        profilePhotoUrl: null,
        rating: 5,
        reply: 0,
        reply_comment: "",
        reply_date: null,
        response_time: null,
        review_name: "review123",
        reviewerName: "John Doe",
        update_date: 1705312200000,
      };

      const result = transformRawReview(mockRawReview);

      expect(result.status).toBe("hidden");
    });

    it("uses native comment when English comment is empty", () => {
      const mockRawReview = {
        account_id: "acc123",
        comment_en: "",
        comment_native: "Servicio excelente!",
        created_date: 1705312200000,
        has_comment: 1,
        is_deleted: 0,
        location_id: "loc123",
        profilePhotoUrl: null,
        rating: 5,
        reply: 0,
        reply_comment: "",
        reply_date: null,
        response_time: null,
        review_name: "review123",
        reviewerName: "John Doe",
        update_date: 1705312200000,
      };

      const result = transformRawReview(mockRawReview);

      expect(result.comment).toBe("Servicio excelente!");
    });

    it("handles different rating values", () => {
      const ratings = [1, 2, 3, 4, 5];

      ratings.forEach((rating) => {
        const mockRawReview = {
          account_id: "acc123",
          comment_en: "Test comment",
          comment_native: "",
          created_date: 1705312200000,
          has_comment: 1,
          is_deleted: 0,
          location_id: "loc123",
          profilePhotoUrl: null,
          rating,
          reply: 0,
          reply_comment: "",
          reply_date: null,
          response_time: null,
          review_name: "review123",
          reviewerName: "Test User",
          update_date: 1705312200000,
        };

        const result = transformRawReview(mockRawReview);
        expect(result.rating).toBe(rating);
      });
    });

    it("formats timestamps correctly", () => {
      const mockRawReview = {
        account_id: "acc123",
        comment_en: "Test comment",
        comment_native: "",
        created_date: 1705312200000, // 2024-01-15T10:30:00Z
        has_comment: 1,
        is_deleted: 0,
        location_id: "loc123",
        profilePhotoUrl: null,
        rating: 5,
        reply: 0,
        reply_comment: "",
        reply_date: null,
        response_time: null,
        review_name: "review123",
        reviewerName: "Test User",
        update_date: 1705312200000,
      };

      const result = transformRawReview(mockRawReview);
      expect(result.date).toBe("2024-01-15T09:50:00.000Z");
    });

    it("handles missing profile photo", () => {
      const mockRawReview = {
        account_id: "acc123",
        comment_en: "Test comment",
        comment_native: "",
        created_date: 1705312200000,
        has_comment: 1,
        is_deleted: 0,
        location_id: "loc123",
        profilePhotoUrl: null,
        rating: 5,
        reply: 0,
        reply_comment: "",
        reply_date: null,
        response_time: null,
        review_name: "review123",
        reviewerName: "Test User",
        update_date: 1705312200000,
      };

      const result = transformRawReview(mockRawReview);
      expect(result.customerPhoto).toBeUndefined();
    });
  });

  describe("transformReviewListResponse", () => {
    it("transforms review list response correctly", () => {
      const mockRawResponse = {
        metadata: {
          pages: 2,
          results_per_page: 10,
          current_page: 1,
          results: 15,
        },
        data: [
          {
            account_id: "acc123",
            comment_en: "Great service!",
            comment_native: "",
            created_date: 1705312200000,
            has_comment: 1,
            is_deleted: 0,
            location_id: "loc123",
            profilePhotoUrl: null,
            rating: 5,
            reply: 0,
            reply_comment: "",
            reply_date: null,
            response_time: null,
            review_name: "review1",
            reviewerName: "John Doe",
            update_date: 1705312200000,
          },
          {
            account_id: "acc123",
            comment_en: "Could be better",
            comment_native: "",
            created_date: 1705225800000,
            has_comment: 1,
            is_deleted: 0,
            location_id: "loc123",
            profilePhotoUrl: null,
            rating: 3,
            reply: 0,
            reply_comment: "",
            reply_date: null,
            response_time: null,
            review_name: "review2",
            reviewerName: "Jane Smith",
            update_date: 1705225800000,
          },
        ],
      };

      const result = transformReviewListResponse(mockRawResponse);

      expect(result.reviews).toHaveLength(2);
      expect(result.reviews[0].customerName).toBe("John Doe");
      expect(result.reviews[1].customerName).toBe("Jane Smith");

      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 15,
        totalPages: 2,
        hasNext: true,
        hasPrev: false,
      });

      expect(result.summary.total).toBe(15);
      expect(result.summary.averageRating).toBe(4); // (5 + 3) / 2
      expect(result.summary.ratingDistribution).toEqual({
        "1": 0,
        "2": 0,
        "3": 1,
        "4": 0,
        "5": 1,
      });
    });

    it("handles empty review list", () => {
      const mockRawResponse = {
        metadata: {
          pages: 0,
          results_per_page: 10,
          current_page: 1,
          results: 0,
        },
        data: [],
      };

      const result = transformReviewListResponse(mockRawResponse);

      expect(result.reviews).toHaveLength(0);
      expect(result.summary.total).toBe(0);
      expect(result.summary.averageRating).toBe(0);
      expect(result.summary.ratingDistribution).toEqual({
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
      });
    });

    it("calculates rating distribution correctly", () => {
      const mockRawResponse = {
        metadata: {
          pages: 1,
          results_per_page: 10,
          current_page: 1,
          results: 5,
        },
        data: [
          {
            account_id: "acc123",
            comment_en: "1 star",
            comment_native: "",
            created_date: 1705312200000,
            has_comment: 1,
            is_deleted: 0,
            location_id: "loc123",
            profilePhotoUrl: null,
            rating: 1,
            reply: 0,
            reply_comment: "",
            reply_date: null,
            response_time: null,
            review_name: "review1",
            reviewerName: "User 1",
            update_date: 1705312200000,
          },
          {
            account_id: "acc123",
            comment_en: "2 stars",
            comment_native: "",
            created_date: 1705312200000,
            has_comment: 1,
            is_deleted: 0,
            location_id: "loc123",
            profilePhotoUrl: null,
            rating: 2,
            reply: 0,
            reply_comment: "",
            reply_date: null,
            response_time: null,
            review_name: "review2",
            reviewerName: "User 2",
            update_date: 1705312200000,
          },
          {
            account_id: "acc123",
            comment_en: "3 stars",
            comment_native: "",
            created_date: 1705312200000,
            has_comment: 1,
            is_deleted: 0,
            location_id: "loc123",
            profilePhotoUrl: null,
            rating: 3,
            reply: 0,
            reply_comment: "",
            reply_date: null,
            response_time: null,
            review_name: "review3",
            reviewerName: "User 3",
            update_date: 1705312200000,
          },
          {
            account_id: "acc123",
            comment_en: "4 stars",
            comment_native: "",
            created_date: 1705312200000,
            has_comment: 1,
            is_deleted: 0,
            location_id: "loc123",
            profilePhotoUrl: null,
            rating: 4,
            reply: 0,
            reply_comment: "",
            reply_date: null,
            response_time: null,
            review_name: "review4",
            reviewerName: "User 4",
            update_date: 1705312200000,
          },
          {
            account_id: "acc123",
            comment_en: "5 stars",
            comment_native: "",
            created_date: 1705312200000,
            has_comment: 1,
            is_deleted: 0,
            location_id: "loc123",
            profilePhotoUrl: null,
            rating: 5,
            reply: 0,
            reply_comment: "",
            reply_date: null,
            response_time: null,
            review_name: "review5",
            reviewerName: "User 5",
            update_date: 1705312200000,
          },
        ],
      };

      const result = transformReviewListResponse(mockRawResponse);

      expect(result.summary.ratingDistribution).toEqual({
        "1": 1,
        "2": 1,
        "3": 1,
        "4": 1,
        "5": 1,
      });
      expect(result.summary.averageRating).toBe(3); // (1+2+3+4+5) / 5
    });

    it("handles single review", () => {
      const mockRawResponse = {
        metadata: {
          pages: 1,
          results_per_page: 10,
          current_page: 1,
          results: 1,
        },
        data: [
          {
            account_id: "acc123",
            comment_en: "Great service!",
            comment_native: "",
            created_date: 1705312200000,
            has_comment: 1,
            is_deleted: 0,
            location_id: "loc123",
            profilePhotoUrl: null,
            rating: 5,
            reply: 0,
            reply_comment: "",
            reply_date: null,
            response_time: null,
            review_name: "review1",
            reviewerName: "John Doe",
            update_date: 1705312200000,
          },
        ],
      };

      const result = transformReviewListResponse(mockRawResponse);

      expect(result.reviews).toHaveLength(1);
      expect(result.summary.total).toBe(1);
      expect(result.summary.averageRating).toBe(5);
      expect(result.summary.ratingDistribution["5"]).toBe(1);
    });
  });
});
