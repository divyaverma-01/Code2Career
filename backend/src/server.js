import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import { configDotenv } from "dotenv";

import feedbackReportRoutes from "./routes/feedbackReport.js";

configDotenv(); // initialize env(environment variable)

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// Routes
app.use("/api", feedbackReportRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`⚡️ Server is running on port ${PORT}`);
});
