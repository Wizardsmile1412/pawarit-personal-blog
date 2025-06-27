import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthenticationContext";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import "@/styles/globals.css";
import { Footer, LoadingScreen } from "../components/websection/PageContainer";
import { Navbar } from "../components/websection/Navbar";
import AuthorSidebar from "@/components/websection/AuthorSidebar";
import { CommentForm } from "@/components/websection/CommentForm";
import CommentList from "@/components/websection/CommentList";
import { formatDate } from "@/utils/dateUtils";
import axiosInstance from "@/api/axiosInstance";

const LoginDialog = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#F9F8F6] bg-opacity-40 backdrop-blur-sm flex w-full items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-4xl font-semibold text-[#26231E] mb-4">
            Create an account to continue
          </h2>
        </div>

        <button
          className="block mx-auto max-w-[207px] bg-[#26231E] text-white py-3 px-6 rounded-full font-medium mb-4 cursor-pointer hover:bg-[#1F201B] transition-colors duration-200"
          onClick={() => {
            navigate("/register");
            onClose();
          }}
        >
          Create account
        </button>

        <div className="text-center text-[#75716B]">
          Already have an account?{" "}
          <span
            onClick={() => {
              navigate("/login");
              onClose();
            }}
            className="text-[#26231E] underline font-medium cursor-pointer hover:text-blue-600"
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};

function ViewPostPage() {
  const [postInfo, setPostInfo] = useState({});
  const { postId } = useParams();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const { state, isAuthenticated } = useAuth();
  const { showError, showSuccess } = useToast();
  const [commentTrigger, setCommentTrigger] = useState(0);

  // Like functionality state
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Check if user has liked the post
  const checkLikeStatus = async () => {
    if (!isAuthenticated || !postId) return;

    try {
      const response = await axiosInstance.get(`/posts/${postId}/like-status`);
      if (response.data.success) {
        setIsLiked(response.data.isLiked);
      }
    } catch (error) {
      console.error("Failed to check like status:", error);
    }
  };

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    if (isLikeLoading) return;

    setIsLikeLoading(true);

    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));

    try {
      const response = await axiosInstance.post(`/posts/${postId}/like`);

      if (response.data.success) {
        // Update with actual values from server
        setIsLiked(response.data.isLiked);
        setLikesCount(response.data.likesCount);

        // Update postInfo to keep it in sync
        setPostInfo((prev) => ({
          ...prev,
          likes_count: response.data.likesCount,
        }));
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);

      console.error("Failed to handle like:", error);
      showError(
        "Failed to process like",
        error.response?.data?.error || "Please try again later"
      );
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleCommentFocus = () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      // Get the current page URL
      const currentUrl = window.location.href;

      // Copy to clipboard
      await navigator.clipboard.writeText(currentUrl);

      showSuccess("Copied!", "This article has been copied to your clipboard.");
    } catch (error) {
      console.error("Failed to copy link to clipboard", error);
      showError("Failed to copy link to clipboard");
    }
  };

  const handleSocialShare = (platform) => {
    const shareUrl = `https://pawarit-personal-blog-server.vercel.app/share/${postId}`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(
      postInfo?.title || "Check out this article"
    );

    let platformUrl;

    switch (platform) {
      case "facebook":
        platformUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        platformUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "twitter":
        platformUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      default:
        return;
    }

    window.open(
      platformUrl,
      "share-dialog",
      "width=626,height=436,top=" +
        (window.screen.height / 2 - 218) +
        ",left=" +
        (window.screen.width / 2 - 313) +
        ",toolbar=0,status=0,scrollbars=1,resizable=1"
    ); 
  };

  const getContents = async (postId) => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}`);
      setPostInfo(response.data);
      setLikesCount(response.data.likes_count || 0);
    } catch (error) {
      console.error("Failed to show content: ", error);
    }
  };

  const handleCommentAdded = () => {
    setCommentTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    getContents(postId);
  }, [postId]);

  useEffect(() => {
    checkLikeStatus();
  }, [isAuthenticated, postId]);

  return (
    <>
      <Navbar />

      <section className="page-container w-full flex flex-col justify-center items-center px-4 sm:px-7 md:px-20">
        {/* Check loading user authentication */}
        {state.getUserLoading && <LoadingScreen />}

        {/* View Post Page Header */}
        <div className="title-image markdown w-full sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px] h-auto sm:h-[400px] md:h-[500px] lg:h-[587px] overflow-hidden rounded-xl">
          <img
            src={postInfo.image}
            alt={postInfo.title}
            className="object-cover object-center w-full h-full"
          />
        </div>

        {/* content-body */}
        <section className="content-body w-full sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px] flex flex-col md:flex-row gap-5 lg:gap-10 m-4 sm:m-6 md:m-8 lg:m-10 items-start">
          <div className="flex flex-col gap-10 lg:gap-20 w-full md:w-3/4 mx-auto p-2 sm:p-4 md:p-6">
            <div className="flex-1">
              {/* Article Header */}
              <div className="mb-6 sm:mb-8 md:mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    {postInfo?.categories?.name}
                  </span>
                  <span className="text-gray-500 text-sm sm:text-base">
                    {formatDate(postInfo?.date)}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
                  {postInfo?.title}
                </h1>
                <p className="text-sm sm:text-base mb-4">
                  {postInfo?.description}
                </p>
              </div>

              {/* Article Content */}
              <div className="markdown text-sm sm:text-base">
                <ReactMarkdown>
                  {postInfo?.content?.replace(/\\n/g, "\n")}
                </ReactMarkdown>
              </div>

              {/* Author Profile - Mobile Only */}
              <div className="md:hidden mt-8 mb-6 bg-[#EFEEEB] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-full overflow-hidden">
                    <img
                      src={postInfo.users?.profile_pic || postInfo.image}
                      alt={postInfo.users?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Author</p>
                    <h3 className="font-semibold text-lg">
                      {postInfo.users?.name || "Author Name"}
                    </h3>
                  </div>
                </div>
                <div className="border-t border-gray-300 my-5"></div>
                <p className="text-gray-500 text-sm">
                  {postInfo.users?.bio ||
                    "I'm a coffee-loving guy who wants to sip coffee every morning and listen to my favorite songs."}
                </p>
              </div>

              {/* Reactions */}
              <div className="w-full bg-[#EFEEEB] rounded-lg flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 my-6 sm:my-8 md:my-10 gap-4">
                <button
                  onClick={handleLikeClick}
                  disabled={isLikeLoading}
                  className={`w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-3 rounded-full transition-all duration-200 ${
                    isLiked
                      ? "bg-red-100 border border-red-300 text-red-600"
                      : "bg-white border border-gray-400 text-gray-700"
                  } ${
                    isLikeLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:cursor-pointer hover:shadow-sm"
                  }`}
                >
                  <Heart
                    size={18}
                    className={`transition-all duration-200 ${
                      isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                  <span className="font-medium">{likesCount}</span>
                  {isLikeLoading && (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  )}
                </button>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-white border border-gray-400 px-7 sm:px-10 py-3 rounded-full hover:cursor-pointer hover:shadow-sm transition-all duration-200"
                  >
                    <span>Copy link</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSocialShare("facebook")}
                      className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-blue-600 transition-colors duration-200"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                          fill="white"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleSocialShare("linkedin")}
                      className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                          fill="white"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleSocialShare("twitter")}
                      className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-gray-800 transition-colors duration-200"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comment Form */}
              <CommentForm
                handleCommentFocus={handleCommentFocus}
                showError={showError}
                showSuccess={showSuccess}
                postId={postId}
                onCommentAdded={handleCommentAdded}
              />

              {/* Comment List */}
              <CommentList postId={postId} commentTrigger={commentTrigger} />
            </div>
          </div>

          {/* Author Profile Sidebar - Desktop Only */}
          <div className="author-profile hidden md:block self-start sticky top-6 h-fit w-1/4">
            <AuthorSidebar author={postInfo.users} />
          </div>
        </section>
      </section>

      {/* Login Dialog */}
      <LoginDialog
        isOpen={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
      />

      <Footer />
    </>
  );
}

export default ViewPostPage;
