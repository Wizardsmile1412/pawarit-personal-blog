import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import AdminSidebar from "@/components/websection/AdminSidebar";
import { getRelativeTime } from "@/utils/dateUtils";

export function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchNotifications = async (page = 1) => {
    try {
      const params = {
        page: page,
        limit: limit,
      };

      const response = await axiosInstance.get("/admin/notifications", {
        params,
      });

      if (response.status === 200) {
        setNotifications(response.data.notifications);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchNotifications(page);
  };

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 1) {
      handlePageChange(prevPage);
    }
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      handlePageChange(nextPage);
    }
  };

  const handleViewNotification = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-[var(--color-background)] border-b border-gray-200 py-6 px-20">
          <h1 className="text-2xl font-bold text-gray-800">Notification</h1>
        </header>

        <div className="px-20 py-6">
          {/* Notifications List */}
          {notifications.map((notification) => {
            const time = getRelativeTime(notification.updated_at);
            return (
              <div
                key={notification.id}
                className="border-b border-gray-300 py-6"
              >
                <div className="flex justify-between">
                  <div className="flex">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                      <img
                        src={notification.user.profile_pic}
                        alt={notification.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Notification Content */}
                    <div>
                      <div className="text-[var(--color-brown-500)]">
                        <span className="font-bold">
                          {notification.message.replace(/\.$/, ":")}
                        </span>{" "}
                        <span className="text-text-[var(--color-brown-400)]">
                          {notification.post.title}
                        </span>
                      </div>

                      {/* Comment content if it's a comment notification */}
                      {notification.type === "new_comment" && (
                        <div className="text-[var(--color-brown-500)] mt-1">
                          "{notification.comment.comment_text}"
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="text-[#F2B68C] text-sm mt-1">{time}</div>
                    </div>
                  </div>

                  {/* View Button */}
                  <div>
                    <button
                      className="text-black hover:underline hover:cursor-pointer"
                      onClick={() =>
                        handleViewNotification(notification.post_id)
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No notifications yet
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm border rounded-md ${
                          pageNum === currentPage
                            ? "bg-black text-white border-black"
                            : "border-gray-300 hover:cursor-pointer hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
