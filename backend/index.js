// backend/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sequelize instance
import sequelize from "./config/database.js";

// Import models to register with Sequelize
import User from "./models/User.js";
import Room from "./models/Room.js";
import Booking from "./models/Booking.js";
import Contact from "./models/Contact.js";

// Import routes
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/booking.js";
import contactRoutes from "./routes/contact.js";
import roomRoutes from "./routes/rooms.js";
import adminRoutes from "./routes/admin.js";

// Connect to DB
sequelize.authenticate()
  .then(async () => {
    console.log("✅ Database connected successfully.");

    try {
      await sequelize.sync({ alter: true });
      console.log("✅ All models synchronized.");
    } catch (error) {
      console.error("❌ Error syncing models:", error.message);
    }
  })
  .catch(err => {
    console.error("❌ Unable to connect to DB:", err.message);
    console.log("Please make sure MySQL is running and database credentials are correct.");
  });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/admin", adminRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Resort API is running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
