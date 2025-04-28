import express from "express";
import connectionPool from "../utils/db.js";
import postValidate from "../middlewares/postValidate.mjs";
import protectAdmin from "../middlewares/protectAdmin.mjs";


const postsRouter = express.Router();

postsRouter.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const category = req.query.category;
  const keyword = req.query.keyword;
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM posts`;
  let countQuery = `SELECT COUNT(*) FROM posts`;
  let values = [];
  let countValues = [];

  if (category && keyword) {
    query += ` WHERE category_id = $1 AND title ILIKE $2`;
    countQuery += ` WHERE category_id = $1 AND title ILIKE $2`;
    values = [category, `%${keyword}%`, limit, offset];
    countValues = [category, `%${keyword}%`];
  } else if (category) {
    query += ` WHERE category_id = $1`;
    countQuery += ` WHERE category_id = $1`;
    values = [category, limit, offset];
    countValues = [category];
  } else if (keyword) {
    query += ` WHERE title ILIKE $1`;
    countQuery += ` WHERE title ILIKE $1`;
    values = [`%${keyword}%`, limit, offset];
    countValues = [`%${keyword}%`];
  } else {
    values = [limit, offset];
  }

  query += ` ORDER BY date DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

  try {
    const data = await connectionPool.query(query, values);
    const totalRes = await connectionPool.query(countQuery, countValues);
    const totalPosts = parseInt(totalRes.rows[0].count);
    const totalPages = Math.ceil(totalPosts / limit);

    if (data.rowCount === 0) {
      return res.status(404).json({ message: "No posts found." });
    }

    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
      posts: data.rows,
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
  const query = `select * from posts where id = $1`;

  try {
    const response = await connectionPool.query(query, [postId]);
    if (response.rowCount === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    } else {
      return res.status(200).json(response.rows[0]);
    }
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
  const date = new Date();

  const insertQuery = `
      INSERT INTO posts (title, image, category_id, description, content, status_id, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

  const values = [
    title,
    image,
    category_id,
    description,
    content,
    status_id,
    date,
  ];

  try {
    const response = await connectionPool.query(insertQuery, values);

    if (response.rowCount === 1) {
      return res.status(201).json({
        message: "Created post sucessfully",
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
  const date = new Date();

  const updateQuery = `
    update posts
    set title = $1,
        image = $2,
        category_id = $3,
        description = $4,
        content = $5,
        status_id = $6,
        date = $7
    where id = $8
`;

  try {
    const response = await connectionPool.query(updateQuery, [
      title,
      image,
      category_id,
      description,
      content,
      status_id,
      date,
      postId,
    ]);
    if (response.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested post to update" });
    } else if (response.rowCount === 1) {
      return res.status(200).json({ message: "Updated post sucessfully" });
    } else {
      return res.status(400).json({ message: "Post was not updated." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server could not update post because database connection",
    });
  }
});

postsRouter.delete("/:postId",[protectAdmin], async (req, res) => {
  const { postId } = req.params;
  const deleteQuery = `delete from posts where id = $1`;

  try {
    const response = await connectionPool.query(deleteQuery, [postId]);
    if (response.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested post to delete" });
    } else if (response.rowCount === 1) {
      return res.status(200).json({ message: "Deleted post sucessfully" });
    } else {
      return res.status(400).json({ message: "Post was not deleted." });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        error: "Server could not delete post because database connection",
      });
  }
});

export default postsRouter;
