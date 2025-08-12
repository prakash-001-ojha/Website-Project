import express from 'express';
import Booking from '../models/Booking.js';
import { Op } from 'sequelize';
import authGuard from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookings
router.get('/user', authGuard, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const bookings = await Booking.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get booking stats for user
router.get('/stats', authGuard, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const bookings = await Booking.findAll({
      where: { user_id: userId }
    });

    const totalBookings = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const totalSpent = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + parseFloat(b.total_price), 0);

    const recentBookings = await Booking.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      stats: {
        totalBookings,
        pending,
        confirmed,
        totalSpent: totalSpent.toFixed(2)
      },
      recentBookings
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new booking (optional authentication)
router.post('/', async (req, res) => {
  try {
    console.log('Received booking request:', req.body);
    
    const { name, email, checkin, checkout, room_type, guests, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !checkin || !checkout || !room_type) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, checkin, checkout, room_type' 
      });
    }
    
    // Calculate total price based on room type
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    
    // Get room price from database or use default
    let basePrice = 150; // Default price
    try {
      const Room = await import('../models/Room.js');
      const room = await Room.default.findOne({ where: { name: room_type } });
      if (room) {
        basePrice = parseFloat(room.price_per_night);
      }
    } catch (error) {
      console.log('Using default price for room type:', room_type);
    }
    
    const total_price = nights * basePrice;
    
    console.log('Creating booking with data:', {
      name, email, checkin, checkout, room_type, guests, message, total_price
    });
    
    // Try to get user_id from token if available
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        userId = decoded.id;
      }
    } catch (error) {
      // Token is optional for booking creation
      console.log('No valid token provided, creating anonymous booking');
    }
    
    const booking = await Booking.create({
      user_id: userId,
      name,
      email,
      checkin,
      checkout,
      room_type,
      guests: guests || 1,
      message: message || '',
      total_price
    });
    
    console.log('Booking created successfully:', booking.id);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    booking.status = status;
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    await booking.destroy();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 