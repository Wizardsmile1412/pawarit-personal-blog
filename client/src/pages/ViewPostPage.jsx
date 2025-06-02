import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { toast, Toaster } from "sonner";
import "../assets/Global.css";
import { Footer } from "../components/websection/PageContainer";
import { Navbar } from "../components/websection/Navbar";
import AuthorSidebar from "../components/ui/AuthorSidebar";
import CommentList from "../components/ui/CommentList";

const LoginDialog = ({ isOpen, onClose }) => {
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

        <button className="block mx-auto max-w-[207px] bg-[#26231E] text-white py-3 px-6 rounded-full font-medium mb-4">
          Create account
        </button>

        <div className="text-center text-[#75716B]">
          Already have an account?{" "}
          <a href="/login" className="text-[#26231E] underline font-medium">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};

function ViewPostPage() {
  const [postInfo, setPostInfo] = useState({});
  const { postId } = useParams(); // Get "id" from URL
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  // Assume user is not logged in
  const isLoggedIn = false;

  // Handle like button click
  const handleLikeClick = () => {
    if (!isLoggedIn) {
      setLoginDialogOpen(true);
    }
  };

  // Handle comment focus
  const handleCommentFocus = () => {
    if (!isLoggedIn) {
      setLoginDialogOpen(true);
    }
  };

  // Handle comment focus
  const handleCopyLink = async () => {
    try {
      // Get the current page URL
      const currentUrl = window.location.href;

      // Copy to clipboard
      await navigator.clipboard.writeText(currentUrl);

      // Show success toast
      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Copied!</p>
          <p className="text-sm">
            This article has been copied to your clipboard.
          </p>
        </div>,
        {
          duration: 2000,
          style: { backgroundColor: "#10B981", color: "white" },
        }
      );
    } catch (error) {
      // Show error toast if copying fails
      toast.error("Failed to copy link to clipboard", error);
    }
  };

  // HandleSocialShare
  const handleSocialShare = (platform) => {
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);

    let shareUrl;

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/share?url=${encodedUrl}`;
        break;
      default:
        return;
    }

    // Open a new window for sharing
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const getContents = async (postId) => {
    try {
      const response = await axios.get(
        `https://blog-post-project-api.vercel.app/posts/${postId}`
      );

      setPostInfo(response.data);
    } catch (error) {
      console.error("Failed to show content: ", error);
    }
  };

  useEffect(() => {
    getContents(postId);
  }, [postId]);

  const date = new Date(postInfo.date);
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);

  return (
    <>
      <Toaster position="bottom-right" />
      <Navbar />

      <section className="page-container w-full flex flex-col justify-center items-center px-4 sm:px-7 md:px-20">
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
                    {postInfo.category}
                  </span>
                  <span className="text-gray-500 text-sm sm:text-base">
                    {formattedDate}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
                  {postInfo.title}
                </h1>
                <p className="text-sm sm:text-base mb-4">
                  {postInfo.description}
                </p>
              </div>

              {/* Article Content */}
              <div className="markdown text-sm sm:text-base">
                <ReactMarkdown>{postInfo.content}</ReactMarkdown>
              </div>

              {/* Author Profile - Mobile Only */}
              <div className="md:hidden mt-8 mb-6 bg-[#EFEEEB] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-full overflow-hidden">
                    <img
                      src={postInfo.author?.avatar || postInfo.image}
                      alt={postInfo.author?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Author</p>
                    <h3 className="font-semibold text-lg">
                      {postInfo.author?.name || "Author Name"}
                    </h3>
                  </div>
                </div>
                <div className="border-t border-gray-300 my-5"></div>
                <p className="text-gray-500 text-sm">
                  {postInfo.author?.bio ||
                    "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness."}
                </p>
              </div>

              {/* Reactions */}
              <div className="w-full bg-[#EFEEEB] rounded-lg flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 my-6 sm:my-8 md:my-10 gap-4">
                <button
                  onClick={handleLikeClick}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white border border-gray-400 px-10 py-3 rounded-full"
                >
                  <Heart size={18} />
                  <span>{postInfo.likes}</span>
                </button>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-white border border-gray-400 px-7 sm:px-10 py-3 rounded-full"
                  >
                    <span>Copy link</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSocialShare("facebook")}
                      className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white font-bold">f</span>
                    </button>
                    <button
                      onClick={() => handleSocialShare("linkedin")}
                      className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white font-bold">in</span>
                    </button>
                    <button
                      onClick={() => handleSocialShare("twitter")}
                      className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white font-bold">t</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comment Form */}
              <div className="mb-8 sm:mb-12">
                <div className="flex flex-col w-full">
                  <label className="text-gray-600 mb-1 text-sm sm:text-base">
                    Comment
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 mb-2">
                    <textarea
                      className="w-full outline-none text-gray-600 text-sm sm:text-base"
                      placeholder="What are your thoughts?"
                      rows={4}
                      onFocus={handleCommentFocus}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleCommentFocus}
                      className="bg-gray-800 text-white px-8 sm:px-10 py-3 rounded-full text-sm sm:text-base"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Comment List */}
              <CommentList />
            </div>
          </div>

          {/* Author Profile Sidebar - Desktop Only */}
          <div className="author-profile hidden md:block self-start sticky top-6 h-fit w-1/4">
            <AuthorSidebar post={postInfo} />
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
