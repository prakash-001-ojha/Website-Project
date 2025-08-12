import express from 'express';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: { is_available: true },
      order: [['price_per_night', 'ASC']]
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check room availability for specific dates
router.post('/check-availability', async (req, res) => {
  try {
    const { room_id, checkin, checkout } = req.body;
    
    if (!room_id || !checkin || !checkout) {
      return res.status(400).json({ error: 'Room ID, check-in, and check-out dates are required' });
    }

    // Check if room exists
    const room = await Room.findByPk(room_id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check for conflicting bookings
    const conflictingBookings = await Booking.findAll({
      where: {
        room_type: room.type,
        status: ['pending', 'confirmed'],
        [Op.or]: [
          {
            checkin: {
              [Op.lte]: checkout,
              [Op.gte]: checkin
            }
          },
          {
            checkout: {
              [Op.gte]: checkin,
              [Op.lte]: checkout
            }
          },
          {
            checkin: {
              [Op.lte]: checkin
            },
            checkout: {
              [Op.gte]: checkout
            }
          }
        ]
      }
    });

    const isAvailable = conflictingBookings.length === 0;
    
    res.json({ 
      available: isAvailable,
      room_id: room_id,
      checkin: checkin,
      checkout: checkout
    });
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new room (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, type, description, price_per_night, capacity, amenities, image_url } = req.body;
    
    const room = await Room.create({
      name,
      type,
      description,
      price_per_night,
      capacity: capacity || 2,
      amenities: amenities || [],
      image_url
    });
    
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update room
router.put('/:id', async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    await room.update(req.body);
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete room
router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    await room.destroy();
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rooms by type
router.get('/type/:type', async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: {
        type: req.params.type,
        is_available: true
      },
      order: [['price_per_night', 'ASC']]
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 