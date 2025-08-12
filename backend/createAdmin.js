import sequelize from './config/database.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized.');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@resort.com' } });
    if (existingAdmin) {
      console.log('✅ Admin user already exists.');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@resort.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully.');
    console.log('Email: admin@resort.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin(); 