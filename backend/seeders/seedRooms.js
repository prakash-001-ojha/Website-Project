import Room from '../models/Room.js';
import sequelize from '../config/database.js';

const seedRooms = async () => {
  try {
    await sequelize.sync({ force: true });
    
    const rooms = [
      {
        name: "Deluxe Mountain View Room",
        type: "Deluxe",
        description: "Spacious room with breathtaking mountain views, private balcony, and premium amenities. Perfect for experiencing the beauty of Bardiya.",
        price_per_night: 89.99,
        capacity: 3,
        amenities: ["Mountain View", "Private Balcony", "King Bed", "Mini Bar", "Room Service", "Free WiFi"],
        image_url: "/images/room1.jpg",
        is_available: true
      },
      {
        name: "Premium Wildlife Suite",
        type: "Suite",
        description: "Luxurious suite designed for wildlife enthusiasts with large windows overlooking the natural habitat. Experience nature at its finest.",
        price_per_night: 149.99,
        capacity: 4,
        amenities: ["Wildlife View", "Large Windows", "King Bed", "Living Area", "Free WiFi", "Guided Tours"],
        image_url: "/images/room2.jpg",
        is_available: true
      },
      {
        name: "Family Villa",
        type: "Villa",
        description: "Large family villa with multiple bedrooms, kitchen, and garden. Perfect for families seeking adventure in Bardiya.",
        price_per_night: 199.99,
        capacity: 6,
        amenities: ["Multiple Bedrooms", "Kitchen", "Garden", "Mountain View", "Free WiFi", "Parking"],
        image_url: "/images/room3.jpg",
        is_available: true
      },
      {
        name: "Adventure Lodge Room",
        type: "Standard",
        description: "Comfortable room designed for adventure seekers. Close to hiking trails and wildlife viewing areas.",
        price_per_night: 69.99,
        capacity: 2,
        amenities: ["Queen Bed", "Free WiFi", "TV", "Air Conditioning", "Adventure Gear Storage"],
        image_url: "/images/room1.jpg",
        is_available: true
      },
      {
        name: "Garden Cottage",
        type: "Cottage",
        description: "Charming cottage surrounded by beautiful gardens. Perfect for nature lovers seeking tranquility.",
        price_per_night: 79.99,
        capacity: 2,
        amenities: ["Queen Bed", "Garden View", "Free WiFi", "Private Garden", "Air Conditioning"],
        image_url: "/images/room2.jpg",
        is_available: true
      },
      {
        name: "Executive Mountain Suite",
        type: "Suite",
        description: "Luxurious executive suite with business amenities, separate living area, and stunning mountain views.",
        price_per_night: 129.99,
        capacity: 3,
        amenities: ["King Bed", "Living Room", "Work Desk", "Mountain View", "Free WiFi", "Room Service"],
        image_url: "/images/room3.jpg",
        is_available: true
      }
    ];

    await Room.bulkCreate(rooms);
    console.log('Rooms seeded successfully for Nature Nest Tiger!');
  } catch (error) {
    console.error('Error seeding rooms:', error);
  }
};

export default seedRooms; 