import express from "express";
import { createClient } from "@supabase/supabase-js";
import protectUser from "../middlewares/protectUser.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const shareRouter = express.Router();

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

shareRouter.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        description,
        image,
        date,
        users (
          name
        ),
        categories (
          name
        )
      `
      )
      .eq("id", postId)
      .single();

    if (error) {
      return res.status(500).send("Error fetching post");
    }

    const postUrl = `https://yourdomain.com/post/${postId}`;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(data.title)}</title>

        <meta name="description" content="${escapeHtml(data.description)}" />
        <meta property="og:title" content="${escapeHtml(data.title)}" />
        <meta property="og:description" content="${escapeHtml(
          data.description
        )}" />
        <meta property="og:image" content="${data.image}" />
        <meta property="og:url" content="${postUrl}" />
        <meta property="og:type" content="article" />
        <meta property="article:author" content="${escapeHtml(
          data.users?.name || ""
        )}" />
        <meta property="article:section" content="${escapeHtml(
          data.categories?.name || ""
        )}" />
        <meta property="article:published_time" content="${data.date}" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${escapeHtml(data.title)}" />
        <meta name="twitter:description" content="${escapeHtml(
          data.description
        )}" />
        <meta name="twitter:image" content="${data.image}" />

        <script>
          window.location.replace("${postUrl}");
        </script>
      </head>
      <body>Redirecting...</body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

export default shareRouter;
