import express from "express";
import { createClient } from "@supabase/supabase-js";
import protectUser from "../middlewares/protectUser.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const authRouter = express.Router();

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
    });
  } catch (error) {
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
