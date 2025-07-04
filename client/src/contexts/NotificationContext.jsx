import React, { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { supabase } from "@/api/supabaseClient";
import { useAuth } from "@/contexts/AuthenticationContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate(); // Add this hook

  // Fetch notifications from database
  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // First, get the notifications
      const { data: notificationsData, error: notError } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (notError) {
        console.error("Error fetching notifications:", notError);
        throw notError;
      }

      if (!notificationsData || notificationsData.length === 0) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      // Get unique actor IDs and post IDs for batch fetching
      const actorIds = [
        ...new Set(
          notificationsData.filter((n) => n.actor_id).map((n) => n.actor_id)
        ),
      ];

      const postIds = [
        ...new Set(
          notificationsData.filter((n) => n.post_id).map((n) => n.post_id)
        ),
      ];

      // Batch fetch actors and posts
      const [actorsResult, postsResult] = await Promise.all([
        // Fetch actors (users)
        actorIds.length > 0
          ? supabase
              .from("users") // Replace with your actual users table name
              .select("id, name, profile_pic")
              .in("id", actorIds)
          : Promise.resolve({ data: [], error: null }),

        // Fetch posts
        postIds.length > 0
          ? supabase
              .from("posts") // Replace with your actual posts table name
              .select("id, title")
              .in("id", postIds)
          : Promise.resolve({ data: [], error: null }),
      ]);

      // Create lookup maps
      const actorsMap = new Map(
        (actorsResult.data || []).map((actor) => [actor.id, actor])
      );
      const postsMap = new Map(
        (postsResult.data || []).map((post) => [post.id, post])
      );

      // Enrich notifications with related data
      const enrichedNotifications = notificationsData.map((notification) => ({
        ...notification,
        actor: notification.actor_id
          ? actorsMap.get(notification.actor_id)
          : null,
        post: notification.post_id ? postsMap.get(notification.post_id) : null,
      }));

      setNotifications(enrichedNotifications);
      setUnreadCount(enrichedNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to enrich a single notification
  const enrichNotification = async (notification) => {
    const enriched = { ...notification };

    try {
      // Fetch actor data if actor_id exists
      if (notification.actor_id) {
        const { data: actorData } = await supabase
          .from("users") // Replace with your actual users table name
          .select("id, name, profile_pic")
          .eq("id", notification.actor_id)
          .single();

        if (actorData) {
          enriched.actor = actorData;
        }
      }

      // Fetch post data if post_id exists
      if (notification.post_id) {
        const { data: postData } = await supabase
          .from("posts") // Replace with your actual posts table name
          .select("id, title")
          .eq("id", notification.post_id)
          .single();

        if (postData) {
          enriched.post = postData;
        }
      }
    } catch (error) {
      console.error("Error enriching notification:", error);
    }

    return enriched;
  };

  // Handle notification click with navigation and refresh logic
  const handleNotificationClick = async (notification) => {
    // Mark notification as read first
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to the post with refresh state
    if (notification.post_id) {
      navigate(`/posts/${notification.post_id}`, { 
        state: { refreshPost: true } 
      });
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .eq("recipient_id", user.id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("recipient_id", user.id)
        .eq("read", false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId)
        .eq("recipient_id", user.id);

      if (error) throw error;

      const notification = notifications.find((n) => n.id === notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Setup real-time subscription
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    fetchNotifications();

    // Subscribe to real-time notifications
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log("New notification received:", payload);

          try {
            // Enrich the new notification with related data
            const enrichedNotification = await enrichNotification(payload.new);

            setNotifications((prev) => [enrichedNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);
          } catch (error) {
            console.error("Error processing real-time notification:", error);
            // Fallback: just add the basic notification
            setNotifications((prev) => [payload.new, ...prev]);
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === payload.new.id ? { ...n, ...payload.new } : n
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user?.id]);

  // Helper function to get notification message with proper formatting
  const getNotificationMessage = (notification) => {
    const actorName = notification.actor?.name || "Someone";

    switch (notification.type) {
      case "new_post":
        return `${actorName} published new article.`;
      case "new_like":
        return notification.message || `${actorName} liked your post.`;
      case "new_comment":
        return notification.message || `${actorName} commented on your post.`;
      default:
        return notification.message || "You have a new notification.";
    }
  };

  // Helper function to get time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleNotificationClick, // Add this to the context value
    getNotificationMessage,
    getTimeAgo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};