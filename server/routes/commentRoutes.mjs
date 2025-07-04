import express from "express";
import { createClient } from "@supabase/supabase-js";
import protectUser from "../middlewares/protectUser.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const commentsRouter = express.Router();

commentsRouter.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        error: "Post ID is required",
      });
    }

    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        users!comments_user_id_fkey (
      id,
      name,
      profile_pic
    )
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        error: "Failed to fetch comments",
      });
    }

    res.status(200).json({
      message: "Comments fetched successfully",
      comments: data,
      count: data.length,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

commentsRouter.post("/", [protectUser], async (req, res) => {
  try {
    const { comment, postId } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        error: "Comment is required",
      });
    }

    const userId = req.user.id;

    // Insert comment into database
    const { data, error } = await supabase
      .from("comments")
      .insert({
        comment_text: comment.trim(),
        post_id: postId,
        user_id: userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        error: "Failed to save comment",
      });
    }
    res.status(201).json({
      message: "Comment created successfully",
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default commentsRouter;
