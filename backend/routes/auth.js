import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  console.log('Registration request received:', req.body);
  
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({ message: "User with this email already exists" });
    }

    console.log('Creating new user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    console.log('User created successfully:', user.id);

    const token = jwt.sign(
      { id: user.id, email, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user.id, name, email, role: 'user' },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  console.log('Login request received:', { email: req.body.email });
  
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing login credentials');
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    console.log('Finding user with email:', email);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('Checking password...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('Login successful for user:', email);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: 'user' },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

export default router;
