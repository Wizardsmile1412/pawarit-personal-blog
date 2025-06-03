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
  const category = req.query.category;
  const keyword = req.query.keyword;
  const offset = (page - 1) * limit;

  try {
    let query = supabase.from('posts').select('*', { count: 'exact' });
    
    // Apply filters
    if (category && keyword) {
      query = query
        .eq('category_id', category)
        .ilike('title', `%${keyword}%`);
    } else if (category) {
      query = query.eq('category_id', category);
    } else if (keyword) {
      query = query.ilike('title', `%${keyword}%`);
    }

    // Apply pagination and ordering
    const { data, error, count } = await query
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        error: "Server could not read posts because database connection",
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No posts found." });
    }

    const totalPosts = count || 0;
    const totalPages = Math.ceil(totalPosts / limit);

    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
      posts: data,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server could not read posts because database connection",
    });
  }
});

postsRouter.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return res.status(404).json({
          message: "Server could not find a requested post",
        });
      }
      console.error('Supabase error:', error);
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
  const { title, image, category_id, description, content, status_id } = req.body;
  const date = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          image,
          category_id,
          description,
          content,
          status_id,
          date
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        error: "Server could not create post because database connection",
      });
    }

    if (data && data.length > 0) {
      return res.status(201).json({
        message: "Created post sucessfully",
        post: data[0]
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
  const { title, image, category_id, description, content, status_id } = req.body;
  const date = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('posts')
      .update({
        title,
        image,
        category_id,
        description,
        content,
        status_id,
        date
      })
      .eq('id', postId)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        error: "Server could not update post because database connection",
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ 
        message: "Server could not find a requested post to update" 
      });
    } else {
      return res.status(200).json({ 
        message: "Updated post sucessfully",
        post: data[0]
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
      .from('posts')
      .delete()
      .eq('id', postId)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        error: "Server could not delete post because database connection",
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ 
        message: "Server could not find a requested post to delete" 
      });
    } else {
      return res.status(200).json({ 
        message: "Deleted post sucessfully" 
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