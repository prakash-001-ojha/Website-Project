# Nature Nest Tiger Resort - Database Documentation

## 📊 Database Overview
- **Database Name**: `nature3`
- **Engine**: MySQL 8.0+
- **Connection**: Local MySQL server
- **Tables**: 4 (Users, Rooms, Bookings, Contacts)

## 🗄️ Database Schema

### 1. Users Table
```sql
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Purpose**: User authentication and management
**Key Fields**:
- `email`: Unique identifier for login
- `password`: Hashed password using bcrypt
- `role`: User role (user/admin)

### 2. Rooms Table
```sql
CREATE TABLE Rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    capacity INT DEFAULT 2,
    amenities JSON,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Purpose**: Room inventory and pricing
**Key Fields**:
- `type`: Room category (Deluxe, Premium, Villa, etc.)
- `amenities`: JSON array of room features
- `is_available`: Room availability status

### 3. Bookings Table
```sql
CREATE TABLE Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    checkin DATE NOT NULL,
    checkout DATE NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    guests INT DEFAULT 1,
    message TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Purpose**: Reservation management
**Key Fields**:
- `room_type`: References room type
- `status`: Booking status tracking
- `total_price`: Calculated booking cost

### 4. Contacts Table
```sql
CREATE TABLE Contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Purpose**: Customer inquiry management
**Key Fields**:
- `status`: Message status tracking
- `subject`: Inquiry category

## 🚀 Quick Setup

### 1. Database Setup
```bash
cd resort/backend
npm run setup-db
```

### 2. Test Database
```bash
npm run test-db
```

### 3. Start with Sample Data
```bash
npm run simple-dev
```

## 📋 Common Queries

### User Authentication
```sql
-- Find user by email (login)
SELECT id, name, email, password, role FROM Users WHERE email = ?;

-- Create new user (registration)
INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?);

-- Check email exists
SELECT id FROM Users WHERE email = ?;
```

### Room Management
```sql
-- Get all available rooms
SELECT * FROM Rooms WHERE is_available = TRUE ORDER BY price_per_night ASC;

-- Get room by ID
SELECT * FROM Rooms WHERE id = ?;

-- Search rooms by name/description
SELECT * FROM Rooms 
WHERE (name LIKE ? OR description LIKE ?) 
AND is_available = TRUE;
```

### Booking Operations
```sql
-- Create new booking
INSERT INTO Bookings (name, email, checkin, checkout, room_type, guests, message, total_price) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- Check room availability
SELECT COUNT(*) as conflicting_bookings 
FROM Bookings 
WHERE room_type = ? 
AND status IN ('pending', 'confirmed')
AND (checkin <= ? AND checkout >= ?);

-- Get booking statistics
SELECT 
    COUNT(*) as total_bookings,
    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
    SUM(total_price) as total_revenue
FROM Bookings;
```

### Contact Management
```sql
-- Create contact message
INSERT INTO Contacts (name, email, subject, message) VALUES (?, ?, ?, ?);

-- Get unread messages count
SELECT COUNT(*) as unread_count FROM Contacts WHERE status = 'unread';

-- Update message status
UPDATE Contacts SET status = ? WHERE id = ?;
```

## 📊 Analytics Queries

### Dashboard Statistics
```sql
SELECT 
    (SELECT COUNT(*) FROM Users) as total_users,
    (SELECT COUNT(*) FROM Rooms) as total_rooms,
    (SELECT COUNT(*) FROM Bookings WHERE status = 'confirmed') as confirmed_bookings,
    (SELECT COUNT(*) FROM Contacts WHERE status = 'unread') as unread_messages,
    (SELECT SUM(total_price) FROM Bookings WHERE status = 'confirmed') as total_revenue;
```

### Monthly Revenue
```sql
SELECT 
    DATE_FORMAT(createdAt, '%Y-%m') as month,
    SUM(total_price) as revenue,
    COUNT(*) as bookings
FROM Bookings 
WHERE status = 'confirmed'
GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
ORDER BY month DESC;
```

### Popular Room Types
```sql
SELECT 
    room_type,
    COUNT(*) as booking_count,
    AVG(total_price) as avg_price
FROM Bookings 
WHERE status = 'confirmed'
GROUP BY room_type
ORDER BY booking_count DESC;
```

## 🔧 Database Utilities

### Connection Pool
```javascript
import pool from './utils/database.js';

// Test connection
const isConnected = await testConnection();

// Execute custom query
const results = await executeQuery('SELECT * FROM Rooms WHERE type = ?', ['Deluxe']);
```

### Common Functions
```javascript
// User operations
const user = await findUserByEmail('test@example.com');
const userId = await createUser('John Doe', 'john@example.com', hashedPassword);

// Room operations
const rooms = await getAllRooms();
const room = await getRoomById(1);

// Booking operations
const bookingId = await createBooking(bookingData);
const isAvailable = await checkRoomAvailability('Deluxe', '2024-12-25', '2024-12-28');

// Contact operations
const contactId = await createContact(contactData);
const unreadCount = await getUnreadContactsCount();
```

## 📈 Performance Optimization

### Indexes
```sql
-- Performance indexes
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_rooms_type ON Rooms(type);
CREATE INDEX idx_rooms_available ON Rooms(is_available);
CREATE INDEX idx_bookings_email ON Bookings(email);
CREATE INDEX idx_bookings_dates ON Bookings(checkin, checkout);
CREATE INDEX idx_bookings_status ON Bookings(status);
CREATE INDEX idx_contacts_status ON Contacts(status);
CREATE INDEX idx_contacts_created ON Contacts(createdAt);
```

### Views
```sql
-- Available rooms view
CREATE OR REPLACE VIEW available_rooms AS
SELECT id, name, type, description, price_per_night, capacity, amenities, image_url
FROM Rooms 
WHERE is_available = TRUE
ORDER BY price_per_night ASC;

-- Booking summary view
CREATE OR REPLACE VIEW booking_summary AS
SELECT 
    b.id, b.name, b.email, b.checkin, b.checkout, b.room_type, b.guests, b.status, b.total_price,
    DATEDIFF(b.checkout, b.checkin) as nights
FROM Bookings b
ORDER BY b.createdAt DESC;
```

## 🧪 Testing

### Test Database Connection
```bash
npm run test-db
```

### Sample Data Verification
- **Test User**: `test@example.com` / `password123`
- **Sample Rooms**: 5 different room types
- **Sample Bookings**: 4 test bookings
- **Sample Contacts**: 4 test messages

## 🔍 Troubleshooting

### Common Issues
1. **Connection Failed**: Check MySQL service and credentials
2. **Database Not Found**: Run `npm run setup-db`
3. **Tables Missing**: Check if setup script completed successfully
4. **Permission Denied**: Verify MySQL user permissions

### Debug Commands
```bash
# Check MySQL status
mysql -u root -p -e "SHOW DATABASES;"

# Test connection
mysql -u root -p -e "USE nature3; SHOW TABLES;"

# Check sample data
mysql -u root -p -e "USE nature3; SELECT * FROM Users;"
```

## 📝 Sample Data

### Users
- `test@example.com` / `password123` (user)
- `admin@nature3.com` / `password123` (admin)

### Rooms
- Deluxe Mountain View Room ($89.99/night)
- Premium Suite ($149.99/night)
- Family Villa ($199.99/night)
- Wildlife View Suite ($179.99/night)
- Garden Cottage ($129.99/night)

### Bookings
- 4 sample bookings with different statuses
- Various room types and date ranges

### Contacts
- 4 sample contact messages
- Different statuses (unread, read, replied)

## 🎯 Success Indicators
- ✅ Database connection successful
- ✅ All tables created
- ✅ Sample data inserted
- ✅ Test queries working
- ✅ Backend API responding
- ✅ Frontend can login and book 