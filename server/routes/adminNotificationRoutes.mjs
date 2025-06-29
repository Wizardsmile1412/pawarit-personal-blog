import express from "express";
import { createClient } from "@supabase/supabase-js";
import protectAdmin from "../middlewares/protectAdmin.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const adminNotificationRouter = express.Router();

adminNotificationRouter.get("/", protectAdmin, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  // Validate page number
  if (page < 1) {
    return res.status(400).json({
      error: "Page number must be greater than 0",
    });
  }

  // Validate limit (optional: add max limit)
  if (limit < 1 || limit > 100) {
    return res.status(400).json({
      error: "Limit must be between 1 and 100",
    });
  }

  const offset = (page - 1) * limit;

  try {
    // Get total count for pagination metadata
    const { count: totalCount, error: countError } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", userId);

    if (countError) throw countError;

    // Get paginated notifications
    const { data: notifications, error: notifError } = await supabase
      .from("notifications")
      .select("id, message, actor_id, updated_at, post_id, comment_id, type")
      .eq("recipient_id", userId)
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1); 

    if (notifError) throw notifError;

    if (!notifications.length) {
      return res.status(200).json({
        notifications: [],
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      });
    }

    // Get unique IDs for batch queries
    const actorIds = [
      ...new Set(notifications.map((n) => n.actor_id).filter(Boolean)),
    ];
    const postIds = [
      ...new Set(notifications.map((n) => n.post_id).filter(Boolean)),
    ];
    const commentIds = [
      ...new Set(notifications.map((n) => n.comment_id).filter(Boolean)),
    ];

    // Batch queries
    const [usersResult, postsResult, commentsResult] = await Promise.all([
      actorIds.length
        ? supabase
            .from("users")
            .select("id, name, profile_pic")
            .in("id", actorIds)
        : { data: [] },
      postIds.length
        ? supabase.from("posts").select("id, title").in("id", postIds)
        : { data: [] },
      commentIds.length
        ? supabase
            .from("comments")
            .select("id, comment_text")
            .in("id", commentIds)
        : { data: [] },
    ]);

    // Create lookup maps
    const usersMap = new Map(usersResult.data?.map((u) => [u.id, u]) || []);
    const postsMap = new Map(postsResult.data?.map((p) => [p.id, p]) || []);
    const commentsMap = new Map(
      commentsResult.data?.map((c) => [c.id, c]) || []
    );

    // Enrich notifications
    const enrichedNotifications = notifications.map((notif) => ({
      ...notif,
      user: usersMap.get(notif.actor_id) || null,
      post: postsMap.get(notif.post_id) || null,
      comment: commentsMap.get(notif.comment_id) || null,
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      notifications: enrichedNotifications,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch notifications", details: error.message });
  }
});

export default adminNotificationRouter;
