import React from "react";
import { Star, User, Clock } from "lucide-react";

const ReviewList = ({ reviews, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-slate-400">Loading reviews...</div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">
          No reviews yet. Be the first to review!
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-slate-50 rounded-xl p-4 border border-slate-100"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                {review.User?.username?.[0] ||
                  review.User?.email?.[0]?.toUpperCase() ||
                  "U"}
              </div>
              <div>
                <p className="font-bold text-slate-800">
                  {review.User?.username || "Anonymous User"}
                </p>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} />
                  {formatDate(review.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={`${
                    star <= review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
          {review.comment && (
            <p className="text-slate-600 text-sm mt-2 ml-13">
              {review.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
