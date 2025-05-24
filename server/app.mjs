import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import postsRouter from "./routes/postsRoutes.mjs";
import authRouter from "./routes/auth.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/posts", postsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on at ${PORT}`);
})
