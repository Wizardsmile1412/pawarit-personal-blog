import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import axiosInstance from "@/api/axiosInstance";
import { formatDate } from "@/utils/dateUtils"
import { LoadingScreen } from "@/components/websection/PageContainer";

const CommentList = ({ postId, commentTrigger }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getComments = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.get(`/comments/${postId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getComments();
  }, [commentTrigger]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
      {isLoading && <LoadingScreen />}

      {comments.map((comment) => (
        <div key={comment.id} className="flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <img
              src={comment.users.profile_pic || logo}
              alt={comment.users.name}
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-[#43403B] font-semibold text-lg sm:text-xl">
                {comment.users.name}
              </span>
              <span className="text-[#75716B] font-medium text-xs sm:text-sm">
                {formatDate(comment.created_at)}
              </span>
            </div>
          </div>
          <p className="text-[#75716B] font-medium text-sm sm:text-base leading-6 sm:leading-7">
            {comment.comment_text}
          </p>
          <div className="border-t border-[#DAD6D1]"></div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
