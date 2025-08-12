import Booking from '../models/Booking.js';
import sequelize from '../config/database.js';

const seedBookings = async () => {
  try {
    // Don't force sync here as we want to keep existing data
    await sequelize.sync();
    
    const bookings = [
      {
        name: "John Smith",
        email: "john.smith@email.com",
        checkin: "2024-02-15",
        checkout: "2024-02-18",
        room_type: "Deluxe",
        guests: 2,
        message: "Looking forward to experiencing the wildlife in Bardiya!",
        status: "confirmed",
        total_price: 269.97
      },
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        checkin: "2024-02-20",
        checkout: "2024-02-25",
        room_type: "Suite",
        guests: 3,
        message: "Family vacation to explore the mountains and wildlife.",
        status: "confirmed",
        total_price: 749.95
      },
      {
        name: "Michael Chen",
        email: "michael.chen@email.com",
        checkin: "2024-03-01",
        checkout: "2024-03-03",
        room_type: "Standard",
        guests: 1,
        message: "Business trip with some adventure on the side.",
        status: "pending",
        total_price: 139.98
      },
      {
        name: "Emma Davis",
        email: "emma.davis@email.com",
        checkin: "2024-03-10",
        checkout: "2024-03-15",
        room_type: "Villa",
        guests: 4,
        message: "Family reunion in the beautiful mountains of Nepal.",
        status: "confirmed",
        total_price: 999.95
      },
      {
        name: "David Wilson",
        email: "david.wilson@email.com",
        checkin: "2024-03-20",
        checkout: "2024-03-22",
        room_type: "Cottage",
        guests: 2,
        message: "Romantic getaway in the peaceful gardens.",
        status: "confirmed",
        total_price: 159.98
      }
    ];

    await Booking.bulkCreate(bookings);
    console.log('Test bookings seeded successfully for Nature Nest Tiger!');
  } catch (error) {
    console.error('Error seeding bookings:', error);
  }
};

export default seedBookings; 