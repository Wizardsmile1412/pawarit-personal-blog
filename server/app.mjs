import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import postsRouter from "./routes/postsRoutes.mjs";
import authRouter from "./routes/authRoutes.mjs";
import adminRouter from "./routes/adminRoutes.mjs";
import commentRoutes from "./routes/commentRoutes.mjs"
import categoriesRouter from "./routes/categoriesRoutes.mjs";
import shareRouter from "./routes/shareRoutes.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
app.use(cors({
  origin: [
    'https://pawarit-coffee-blog.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString()
  });
});

// Your API routes
app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/admin", adminRouter);
app.use("/admin/categories", categoriesRouter);
app.use("/comments", commentRoutes);
app.use("/share", shareRouter);

// Simple 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;