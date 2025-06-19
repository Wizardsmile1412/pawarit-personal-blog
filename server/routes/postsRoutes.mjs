import express from "express";
import { createClient } from "@supabase/supabase-js";
import postValidate from "../middlewares/postValidate.mjs";
import protectAdmin from "../middlewares/protectAdmin.mjs";

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
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from("posts")
      .select(`
        id,
        image,
        category_id,
        title,
        description,
        date,
        content,
        likes_count,
        categories!inner(name)
      `, { count: "exact" })
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

    // Transform the data to match the expected format
    const transformedPosts = (data || []).map(post => ({
      id: post.id,
      image: post.image,
      category: post.categories?.name || "General", 
      title: post.title,
      description: post.description,
      author: "Pawarit S.", 
      date: post.date,
      likes: post.likes_count || 0,
      content: post.content
    }));

    const totalPosts = count || 0;
    const totalPages = Math.ceil(totalPosts / limit);

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
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
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

postsRouter.post("/", [protectAdmin, postValidate], async (req, res) => {
  const { title, image, category_id, description, content, status_id } =
    req.body;
  const date = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          image,
          category_id,
          description,
          content,
          status_id,
          date,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Server could not create post because database connection",
      });
    }

    if (data && data.length > 0) {
      return res.status(201).json({
        message: "Created post sucessfully",
        post: data[0],
      });
    } else {
      return res.status(400).json({
        message: "Question was not created.",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server could not create post because database connection",
    });
  }
});

postsRouter.put("/:postId", [protectAdmin, postValidate], async (req, res) => {
  const { postId } = req.params;
  const { title, image, category_id, description, content, status_id } =
    req.body;
  const date = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from("posts")
      .update({
        title,
        image,
        category_id,
        description,
        content,
        status_id,
        date,
      })
      .eq("id", postId)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Server could not update post because database connection",
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post to update",
      });
    } else {
      return res.status(200).json({
        message: "Updated post sucessfully",
        post: data[0],
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server could not update post because database connection",
    });
  }
});

postsRouter.delete("/:postId", [protectAdmin], async (req, res) => {
  const { postId } = req.params;

  try {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Server could not delete post because database connection",
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post to delete",
      });
    } else {
      return res.status(200).json({
        message: "Deleted post sucessfully",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server could not delete post because database connection",
    });
  }
});

export default postsRouter;
