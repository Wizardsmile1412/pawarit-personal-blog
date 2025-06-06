import express from "express";
import { createClient } from "@supabase/supabase-js";
import protectUser from "../middlewares/protectUser.mjs";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

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
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

const authRouter = express.Router();

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, folder = 'profile_pictures') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: folder,
        transformation: [
          { width: 400, height: 400, crop: 'fill' }, // Auto-resize to 400x400
          { quality: 'auto' }, // Auto-optimize quality
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Helper function to delete from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

authRouter.post("/register", async (req, res) => {
  const { email, password, username, name } = req.body;

  try {
    // Check if username already exists using Supabase
    const { data: existingUsers, error: usernameCheckError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username);

    if (usernameCheckError) {
      return res.status(500).json({ error: "Database error occurred" });
    }

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: "This username is already taken" });
    }

    // Create user in Supabase Auth
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (supabaseError) {
      if (supabaseError.code === "user_already_exists") {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      return res
        .status(400)
        .json({ error: "Failed to create user. Please try again." });
    }

    const supabaseUserId = data.user.id;

    // Insert user data into Supabase database
    const { data: insertedUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: supabaseUserId,
          email: email,
          username: username,
          name: name,
          role: "user",
        },
      ])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: "Failed to save user data" });
    }

    res.status(201).json({
      message: "User created successfully",
      user: insertedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (
        error.code === "invalid_credentials" ||
        error.message.includes("Invalid login credentials")
      ) {
        return res.status(400).json({
          error: "Your password is incorrect or this email doesn't exist",
        });
      }
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Signed in successfully",
      access_token: data.session.access_token,
    });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred during login" });
  }
});

authRouter.get("/get-user", [protectUser], async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: "Unauthorized or token expired" });
    }

    const supabaseUserId = data.user.id;

    // Get user data from Supabase database
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("*")
      .eq("id", supabaseUserId)
      .single();

    if (userDataError) {
      return res.status(500).json({ error: "Failed to fetch user data" });
    }

    res.status(200).json({
      id: data.user.id,
      email: data.user.email,
      username: userData.username,
      name: userData.name,
      role: userData.role,
      profilePic: userData.profile_pic,
      profilePicPublicId: userData.profile_pic_public_id,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Upload profile picture endpoint
authRouter.post("/upload-profile-pic", [protectUser, upload.single('profilePic')], async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const userId = userData.user.id;

    // Get current user data to check for existing profile pic
    const { data: currentUser, error: currentUserError } = await supabase
      .from("users")
      .select("profile_pic_public_id")
      .eq("id", userId)
      .single();

    if (currentUserError) {
      return res.status(500).json({ error: "Failed to fetch current user data" });
    }

    // Delete old profile picture if exists
    if (currentUser.profile_pic_public_id) {
      await deleteFromCloudinary(currentUser.profile_pic_public_id);
    }

    // Upload new image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // Update user profile in database
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({
        profile_pic: result.secure_url,
        profile_pic_public_id: result.public_id,
      })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      // If database update fails, clean up uploaded image
      await deleteFromCloudinary(result.public_id);
      return res.status(500).json({ error: "Failed to update profile picture" });
    }

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePic: result.secure_url,
      profilePicPublicId: result.public_id,
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
});

// Update user profile endpoint
authRouter.put("/update-profile", [protectUser], async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, username } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const userId = userData.user.id;

    // Check if username is already taken (if username is being updated)
    if (username) {
      const { data: existingUsers, error: usernameCheckError } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .neq("id", userId);

      if (usernameCheckError) {
        return res.status(500).json({ error: "Database error occurred" });
      }

      if (existingUsers && existingUsers.length > 0) {
        return res.status(400).json({ error: "This username is already taken" });
      }
    }

    // Update user profile
    const updateData = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: "Failed to update profile" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
        role: updatedUser.role,
        profilePic: updatedUser.profile_pic,
        profilePicPublicId: updatedUser.profile_pic_public_id,
      },
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

authRouter.put("/reset-password", [protectUser], async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { oldPassword, newPassword } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser(
      token
    );

    if (userError) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: oldPassword,
      });

    if (loginError) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: "Password updated successfully",
      user: data.user,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default authRouter;