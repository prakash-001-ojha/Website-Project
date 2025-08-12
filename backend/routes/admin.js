import express from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import { Op, fn, col } from 'sequelize';
import sequelize from '../config/database.js';
import authGuard from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Apply authentication and admin middleware to all routes
router.use(authGuard);
router.use(isAdmin);

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalBookings = await Booking.count();
    const totalUsers = await User.count();
    const totalRooms = await Room.count();
    
    const confirmedBookings = await Booking.count({
      where: { status: 'confirmed' }
    });
    
    const totalRevenue = await Booking.sum('total_price', {
      where: { status: 'confirmed' }
    });

    const recentBookings = await Booking.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const mostBookedRoom = await Booking.findAll({
      attributes: [
        'room_type',
        [fn('COUNT', col('room_type')), 'booking_count']
      ],
      group: ['room_type'],
      order: [[fn('COUNT', col('room_type')), 'DESC']],
      limit: 1
    });

    res.json({
      stats: {
        totalBookings,
        totalUsers,
        totalRooms,
        confirmedBookings,
        totalRevenue: totalRevenue || 0,
        mostBookedRoom: mostBookedRoom[0]?.room_type || 'N/A'
      },
      recentBookings
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings for admin
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.patch('/bookings/:id/status', async (req, res) => {
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

// Get all users for admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Booking,
          as: 'bookings',
          attributes: ['id', 'room_type', 'checkin', 'checkout', 'status', 'total_price']
        }
      ]
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all rooms for admin
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new room
router.post('/rooms', async (req, res) => {
  try {
    const { name, description, price, capacity, amenities, image_url } = req.body;
    
    const room = await Room.create({
      name,
      type: 'standard', // Default type
      description,
      price_per_night: price,
      capacity,
      amenities,
      image_url,
      is_available: true
    });
    
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update room
router.put('/rooms/:id', async (req, res) => {
  try {
    const { name, description, price, capacity, amenities, image_url } = req.body;
    const room = await Room.findByPk(req.params.id);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    await room.update({
      name,
      description,
      price_per_night: price,
      capacity,
      amenities,
      image_url
    });
    
    res.json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete room
router.delete('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    await room.destroy();
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 