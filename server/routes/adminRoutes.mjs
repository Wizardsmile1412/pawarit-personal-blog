import express from "express";
import { createClient } from "@supabase/supabase-js";
import protectAdmin from "../middlewares/protectAdmin.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const adminRouter = express.Router();

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
      return res.status(401).json({ error: "Invalid credentials" });
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

adminRouter.get("/dashboard", protectAdmin, (req, res) => {
  res.status(200).json({
    message: "Welcome to admin dashboard",
    user: req.user,
  });
});

export default adminRouter;
