import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import { configDotenv } from "dotenv";

import feedbackReportRoutes from "./routes/feedbackReport.js";
import questionRoutes from "./routes/questionRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import testResultRoutes from "./routes/testResultRoutes.js";

configDotenv(); // initialize env(environment variable)

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: allowedOrigins.length > 0,
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

app.use("/api/feedback", feedbackReportRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/test-results", testResultRoutes);

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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`⚡️ Server is running on port ${PORT}`);
});
