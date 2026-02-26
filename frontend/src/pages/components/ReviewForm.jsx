import React, { useState } from "react";
import { Star, Send } from "lucide-react";
import { toast } from "react-toastify";
import {
  createReview,
  updateReview,
  deleteReview,
  getUserReviewForRestaurant,
} from "../../services/api";

const ReviewForm = ({
  restaurantId,
  existingReview,
  onReviewSubmitted,
  onClose,
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (existingReview) {
        response = await updateReview(existingReview.id, { rating, comment });
        toast.success("Review updated!");
      } else {
        response = await createReview({ rating, comment, restaurantId });
        toast.success("Review submitted!");
      }

      if (response.data.success) {
        onReviewSubmitted?.(response.data.review);
        onClose?.();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;

    if (!window.confirm("Are you sure you want to delete this review?")) return;

    setLoading(true);
    try {
      await deleteReview(existingReview.id);
      toast.success("Review deleted");
      onReviewSubmitted?.(null);
      onClose?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-slate-600 mb-2">
          Your Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={`${
                  star <= (hoverRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-slate-300"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {rating === 1 && "Poor"}
          {rating === 2 && "Fair"}
          {rating === 3 && "Good"}
          {rating === 4 && "Very Good"}
          {rating === 5 && "Excellent"}
          {rating === 0 && "Click to rate"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-600 mb-2">
          Your Review (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
          className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? (
            "..."
          ) : (
            <>
              <Send size={16} />
              {existingReview ? "Update Review" : "Submit Review"}
            </>
          )}
        </button>

        {existingReview && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-3 bg-red-100 text-red-600 rounded-xl font-bold text-sm hover:bg-red-200"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
