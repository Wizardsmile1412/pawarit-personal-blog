import express from "express";
import { createClient } from "@supabase/supabase-js";
import protectAdmin from "../middlewares/protectAdmin.mjs";
import protectUser from "../middlewares/protectUser.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const postsRouter = express.Router();

postsRouter.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const category = req.query.category?.trim();
  const keyword = req.query.keyword?.trim();
  
  // Validate page number
  if (page < 1) {
    return res.status(400).json({
      error: "Page number must be greater than 0"
    });
  }
  
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from("posts")
      .select(
        `
        id,
        image,
        category_id,
        title,
        description,
        date,
        content,
        likes_count,
        categories!inner(name)
      `,
        { count: "exact" }
      )
      .eq("status_id", 2); // Only published posts

    if (category && category !== "Highlight") {
      query = query.eq("categories.name", category);
    }

    if (keyword) {
      query = query.ilike("title", `%${keyword}%`);
    }

    const { data, error, count } = await query
      .order("id", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Server could not read posts because database connection",
      });
    }

    const totalPosts = count || 0;
    const totalPages = Math.ceil(totalPosts / limit);

    if (page > totalPages && totalPages > 0) {
      return res.status(200).json({
        totalPosts,
        totalPages,
        currentPage: page,
        limit,
        posts: [],
        nextPage: null,
      });
    }

    const transformedPosts = (data || []).map((post) => ({
      id: post.id,
      image: post.image,
      category: post.categories?.name || "General",
      title: post.title,
      description: post.description,
      author: "Pawarit S.",
      date: post.date,
      likes: post.likes_count || 0,
      content: post.content,
    }));

    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
      posts: transformedPosts,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "Server could not read posts because database connection",
    });
  }
});

postsRouter.get("/categories", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        message: "Server could not read category because database connection",
      });
    }

    return res.status(200).json(data || []);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      message: "Server could not read category because database connection",
    });
  }
});

postsRouter.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *, 
        users (
      name,
      profile_pic,
      bio
    ), categories (
    name
    )
      `
      )
      .eq("id", postId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          message: "Server could not find a requested post",
        });
      }
      console.error("Supabase error:", error);
      return res.status(500).json({
        message: "Server could not read post because database connection",
      });
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

postsRouter.post("/:postId/like", protectUser, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    // Call the database function to handle like/unlike
    const { data, error } = await supabase.rpc("handle_post_like", {
      p_post_id: postId,
      p_user_id: userId,
    });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Error handling like:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process like action",
      details: error.message,
    });
  }
});

postsRouter.get("/:postId/like-status", protectUser, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const { data, error } = await supabase.rpc("check_like_status", {
      p_post_id: postId,
      p_user_id: userId,
    });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check like status",
    });
  }
});

export default postsRouter;
