import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectionPool from "./utils/db.js";
import postValidate from "./middlewares/postValidate.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/profiles", (req, res) => {
  return res.status(200).json({
    data: {
      name: "john",
      age: 20,
    },
  });
});

app.post("/posts", [postValidate], async (req, res) => {
  const { title, image, category_id, description, content, status_id } = req.body;
  const date = new Date();

  const insertQuery = `
    INSERT INTO posts (title, image, category_id, description, content, status_id, date)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  const values = [title, image, category_id, description, content, status_id, date];

  try{
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
    return res.status(500).json({ error: "Server could not create post because database connection" });
  }
})  

app.listen(PORT, () => {
    console.log(`Server is running on at ${PORT}`);
})
