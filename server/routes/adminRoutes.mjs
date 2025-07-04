import express from "express";
import { createClient } from "@supabase/supabase-js";
import protectAdmin from "../middlewares/protectAdmin.mjs";
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
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const adminRouter = express.Router();

const uploadToCloudinary = (buffer, folder = "admin_profile_pictures") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folder,
          transformation: [
            { width: 400, height: 400, crop: "fill" }, // Auto-resize to 400x400
            { quality: "auto" }, // Auto-optimize quality
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
};

adminRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return res.status(401).json({
        error: "Your password is incorrect or this email doesn’t exist",
      });
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("id", authData.user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      await supabase.auth.signOut();
      return res.status(403).json({ error: "Admin access required" });
    }

    if (!authData.session?.access_token) {
      return res.status(500).json({ error: "Authentication session error" });
    }

    res.status(200).json({
      message: "Admin login successful",
      access_token: authData.session.access_token,
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.post("/logout", protectAdmin, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.get("/verify", protectAdmin, async (req, res) => {
  try {
    const { data: userData, error } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("id", req.user.id)
      .single();

    if (error) throw error;

    res.status(200).json({
      valid: true,
      user: userData,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.get("/profile", protectAdmin, async (req, res) => {
  try {
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error) throw error;

    res.status(200).json({
      user: userData,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.post(
  "/upload-profile-pic",
  [protectAdmin, upload.single("profilePic")],
  async (req, res) => {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    try {
      const { data: currentUser, error: currentUserError } = await supabase
        .from("users")
        .select("profile_pic_public_id")
        .eq("id", userId)
        .single();

      if (currentUserError) {
        return res
          .status(500)
          .json({ error: "Failed to fetch current user data" });
      }

      if (currentUser?.profile_pic_public_id) {
        const deleteResult = await deleteFromCloudinary(
          currentUser.profile_pic_public_id
        );
        if (!deleteResult) {
          console.warn("Failed to delete old profile picture from Cloudinary");
        }
      }

      const result = await uploadToCloudinary(
        req.file.buffer,
        "admin_profile_pictures"
      );

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
        await deleteFromCloudinary(result.public_id);
        return res
          .status(500)
          .json({ error: "Failed to update profile picture" });
      }

      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePic: result.secure_url,
        profilePicPublicId: result.public_id,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
          name: updatedUser.name,
          role: updatedUser.role,
          profile_pic: updatedUser.profile_pic,
          profile_pic_public_id: updatedUser.profile_pic_public_id,
          bio: updatedUser.bio,
        },
      });
    } catch (error) {
      console.error("Admin profile picture upload error:", error);
      res.status(500).json({ error: "Failed to upload profile picture" });
    }
  }
);

adminRouter.put("/update-profile", protectAdmin, async (req, res) => {
  const userId = req.user.id;
  const { name, username, email, bio } = req.body;

  if (!name || !username || !email) {
    return res.status(400).json({
      error: "Name, username, and email are required",
    });
  }

  if (bio && bio.length > 120) {
    return res.status(400).json({
      error: "Bio must be 120 characters or less",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }

  try {
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

    const { data: existingEmails, error: emailCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .neq("id", userId);

    if (emailCheckError) {
      return res.status(500).json({ error: "Database error occurred" });
    }

    if (existingEmails && existingEmails.length > 0) {
      return res.status(400).json({ error: "This email is already taken" });
    }

    const updateData = {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      bio: bio ? bio.trim() : null,
    };

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Update profile error:", updateError);
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
        profile_pic: updatedUser.profile_pic,
        profile_pic_public_id: updatedUser.profile_pic_public_id,
        bio: updatedUser.bio,
        created_at: updatedUser.created_at,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.put("/reset-password", protectAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: "Current password and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      error: "New password must be at least 6 characters long",
    });
  }

  try {
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: req.user.email,
        password: currentPassword,
      });

    if (loginError) {
      return res.status(400).json({ error: "Invalid current password" });
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      req.user.id,
      { password: newPassword }
    );

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

export default adminRouter;
