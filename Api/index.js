const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const serverless = require("serverless-http");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const aiSuggest = require("../BACKEND/routes/aiSuggest"); // adjust path
const resumeRoutes = require("../BACKEND/routes/resumeRoutes"); // adjust path

app.use("/api/ai-suggest", aiSuggest);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("Resume Builder Backend is Running on Vercel!");
});

// MongoDB connection (optional: use a flag to avoid reconnecting on every function call)
let isConnected = false;
const connectToDB = async () => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB Atlas (serverless)");
  }
};

app.use(async (req, res, next) => {
  await connectToDB();
  next();
});

module.exports = serverless(app);
