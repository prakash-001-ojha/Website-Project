import sequelize from './config/database.js';
import Room from './models/Room.js';

const sampleRooms = [
  {
    name: 'Deluxe Mountain View',
    type: 'deluxe',
    description: 'Spacious room with breathtaking mountain views, featuring a king-size bed and modern amenities.',
    price_per_night: 200.00,
    capacity: 2,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Mountain View', 'Balcony'],
    image_url: '/images/room1.jpg',
    is_available: true
  },
  {
    name: 'Premium Suite',
    type: 'suite',
    description: 'Luxurious suite with separate living area, perfect for families or extended stays.',
    price_per_night: 350.00,
    capacity: 4,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Living Room', 'Kitchen', 'Jacuzzi'],
    image_url: '/images/room2.jpg',
    is_available: true
  },
  {
    name: 'Standard Room',
    type: 'standard',
    description: 'Comfortable room with all essential amenities for a pleasant stay.',
    price_per_night: 150.00,
    capacity: 2,
    amenities: ['WiFi', 'AC', 'TV', 'Private Bathroom'],
    image_url: '/images/room3.jpg',
    is_available: true
  },
  {
    name: 'Family Room',
    type: 'family',
    description: 'Large room with multiple beds, perfect for families with children.',
    price_per_night: 250.00,
    capacity: 6,
    amenities: ['WiFi', 'AC', 'TV', 'Multiple Beds', 'Play Area', 'Kitchen'],
    image_url: '/images/room1.jpg',
    is_available: true
  },
  {
    name: 'Honeymoon Suite',
    type: 'suite',
    description: 'Romantic suite with special amenities for newlyweds and couples.',
    price_per_night: 400.00,
    capacity: 2,
    amenities: ['WiFi', 'AC', 'TV', 'King Bed', 'Romantic Decor', 'Private Balcony', 'Champagne Service'],
    image_url: '/images/room2.jpg',
    is_available: true
  }
];

const seedRooms = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized.');

    // Clear existing rooms
    await Room.destroy({ where: {} });
    console.log('✅ Existing rooms cleared.');

    // Insert sample rooms
    const createdRooms = await Room.bulkCreate(sampleRooms);
    console.log(`✅ ${createdRooms.length} rooms created successfully.`);

    console.log('Sample rooms:');
    createdRooms.forEach(room => {
      console.log(`- ${room.name}: $${room.price_per_night}/night`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding rooms:', error);
    process.exit(1);
  }
};

seedRooms(); 