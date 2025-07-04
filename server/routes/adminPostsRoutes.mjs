import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@supabase/supabase-js";
import postValidate from "../middlewares/postValidate.mjs";
import protectAdmin from "../middlewares/protectAdmin.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const adminPostsRouter = express.Router();

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "article_pictures",
        public_id: `article_${Date.now()}_${originalname.split(".")[0]}`,
        overwrite: true,
        format: "jpg", // Convert all images to JPG for consistency
        quality: "auto:good",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = `article_pictures/${publicIdWithExtension.split(".")[0]}`;

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

// Route to upload article image
adminPostsRouter.post(
  "/upload-image",
  [protectAdmin, upload.single("image")],
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No image file provided",
        });
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname
      );

      return res.status(200).json({
        message: "Image uploaded successfully",
        image_url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({
        error: "Failed to upload image",
      });
    }
  }
);

// Route to delete article image
adminPostsRouter.delete("/delete-image", protectAdmin, async (req, res) => {
  try {
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({
        error: "Image URL is required",
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(image_url);

    return res.status(200).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      error: "Failed to delete image",
    });
  }
});

// Get all posts with pagination and filtering
adminPostsRouter.get("/", protectAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const category = req.query.category?.trim();
  const keyword = req.query.keyword?.trim();

  // Validate page number
  if (page < 1) {
    return res.status(400).json({
      error: "Page number must be greater than 0",
    });
  }

  const offset = (page - 1) * limit;

  try {
    let query = supabase.from("posts").select(
      `
        id,
        image_url,
        category_id,
        title,
        description,
        date,
        content,
        status_id,
        likes_count,
        categories!inner(name)
      `,
      { count: "exact" }
    );

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
      image_url: post.image_url,
      category: post.categories?.name || "General",
      title: post.title,
      description: post.description,
      status: post.status_id === 2 ? "Published" : "Draft",
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

// Get single post by ID
adminPostsRouter.get("/:postId", protectAdmin, async (req, res) => {
  const { postId } = req.params;

  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        title,
          image_url,
          category_id,
          description,
          content,
          status_id,
          date, 
        categories (
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

// Create new post
adminPostsRouter.post("/", [protectAdmin, postValidate], async (req, res) => {
  const { title, image_url, category_id, description, content, status_id } =
    req.body;
  const date = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          image_url,
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
        message: "Created post successfully",
        post: data[0],
      });
    } else {
      return res.status(400).json({
        message: "Post was not created.",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server could not create post because database connection",
    });
  }
});

// Update existing post
adminPostsRouter.put(
  "/:postId",
  [protectAdmin, postValidate],
  async (req, res) => {
    const { postId } = req.params;
    const { title, image_url, category_id, description, content, status_id } =
      req.body;
    const date = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from("posts")
        .update({
          title,
          image_url,
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
          message: "Updated post successfully",
          post: data[0],
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Server could not update post because database connection",
      });
    }
  }
);

// Delete post
adminPostsRouter.delete("/:postId", [protectAdmin], async (req, res) => {
  const { postId } = req.params;

  try {
    // First, get the post to check if it has an image
    const { data: postData, error: fetchError } = await supabase
      .from("posts")
      .select("image_url")
      .eq("id", postId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Supabase fetch error:", fetchError);
      return res.status(500).json({
        error: "Server could not fetch post because database connection",
      });
    }

    // Delete the post
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
    }

    // If the post had an image, delete it from Cloudinary
    if (postData?.image_url) {
      try {
        await deleteFromCloudinary(postData.image_url);
      } catch (deleteError) {
        console.error("Error deleting image from Cloudinary:", deleteError);
        // Don't fail the request if image deletion fails
      }
    }

    return res.status(200).json({
      message: "Deleted post successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server could not delete post because database connection",
    });
  }
});

export default adminPostsRouter;
