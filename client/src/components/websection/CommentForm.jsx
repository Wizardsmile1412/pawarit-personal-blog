import { useState } from "react";
import axiosInstance from "@/api/axiosInstance";

export const CommentForm = ({
  handleCommentFocus,
  showError,
  showSuccess,
  postId,
  onCommentAdded,
}) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      showError("Please enter a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/comments", {
        comment: comment.trim(),
        postId,
      });

      console.log("Comment submitted successfully:", response.data);
      setComment("");
      showSuccess("Comment submitted successfully!");
      onCommentAdded();
    } catch (error) {
      console.error("Error submitting comment:", error);
      showError("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex flex-col w-full">
        <label className="text-gray-600 mb-1 text-sm sm:text-base">
          Comment
        </label>
        <div className="border border-gray-300 rounded-lg p-3 mb-2">
          <textarea
            className="w-full outline-none text-[var(--color-brown-400)] text-sm sm:text-base placeholder:text-[var(--color-brown-300)]"
            placeholder="What are your thoughts?"
            rows={4}
            value={comment}
            onChange={handleCommentChange}
            onFocus={handleCommentFocus}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !comment.trim()}
            className="bg-black text-white px-8 sm:px-10 py-3 rounded-full text-sm sm:text-base hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};
