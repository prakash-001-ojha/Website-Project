import seedRooms from './seeders/seedRooms.js';
import seedBookings from './seeders/seedBookings.js';

const runSeeds = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Seed rooms first
    await seedRooms();
    
    // Then seed bookings
    await seedBookings();
    
    console.log('All seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

runSeeds(); 