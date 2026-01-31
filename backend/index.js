const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true, // Deprecated in Mongoose 6.0
    // useUnifiedTopology: true, // Deprecated in Mongoose 6.0
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).send("Invalid token.");
  }
};

app.use(cors());
app.use(express.json());

// Basic route to test the server
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Register route
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User with that email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during registration.");
  }
});

// Login route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials.");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    ); // Use user._id from MongoDB
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during login.");
  }
});

// Protected route example
app.get("/api/user", verifyToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.email}! This is protected data.`,
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
