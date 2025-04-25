import React from "react";
import AdminSidebar from "@/components/AdminSidebar";

export function NotificationPage() {
  // Mock notification data to match the screenshot
  const notifications = [
    {
      id: 1,
      type: "comment",
      user: {
        name: "Jacob Lash",
        avatar: "/api/placeholder/40/40"
      },
      action: "Commented",
      article: "The Fascinating World of Cats: Why We Love Our Furry Friends",
      comment: "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
      time: "4 hours ago"
    },
    {
      id: 2,
      type: "like",
      user: {
        name: "Jacob Lash",
        avatar: "/api/placeholder/40/40"
      },
      action: "liked",
      article: "The Fascinating World of Cats: Why We Love Our Furry Friends",
      time: "4 hours ago"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 py-6 px-20">
          <h1 className="text-2xl font-bold text-gray-800">
            Notification
          </h1>
        </header>

        <div className="px-20 py-6">
          {/* Notifications List */}
          {notifications.map((notification) => (
            <div key={notification.id} className="border-b border-gray-300 py-6">
              <div className="flex justify-between">
                <div className="flex">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                    <img 
                      src={notification.user.avatar} 
                      alt={notification.user.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  {/* Notification Content */}
                  <div>
                    <div className="text-gray-800">
                      <span className="font-medium">{notification.user.name}</span>
                      {" "}
                      <span>{notification.action} on your article: {notification.article}</span>
                    </div>
                    
                    {/* Comment content if it's a comment notification */}
                    {notification.type === "comment" && (
                      <div className="text-gray-600 mt-1">
                        "{notification.comment}"
                      </div>
                    )}
                    
                    {/* Timestamp */}
                    <div className="text-[#F2B68C] text-sm mt-1">
                      {notification.time}
                    </div>
                  </div>
                </div>
                
                {/* View Button */}
                <div>
                  <button className="text-black hover:underline">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {notifications.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No notifications yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}