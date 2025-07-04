import dotenv from "dotenv";
dotenv.config();
import { createClient } from "@supabase/supabase-js";

// Use anon/public key for Auth
const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Use service role key for DB access
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const protectAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    // Verify the token with Supabase Auth (anon key)
    const { data, error } = await supabaseAuth.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const supabaseUserId = data.user.id;

    // Get user role from Supabase database (service role key)
    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select("role")
      .eq("id", supabaseUserId)
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      if (dbError.code === "PGRST116") {
        // No rows returned
        return res.status(404).json({ error: "User role not found" });
      }
      return res.status(500).json({ error: "Database error occurred" });
    }

    if (!userData) {
      return res.status(404).json({ error: "User role not found" });
    }

    req.user = { ...data.user, role: userData.role };

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have admin access" });
    }

    next();
  } catch (err) {
    console.error("Middleware error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectAdmin;
