import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import API from '../api';
import '../style/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalRooms: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    mostBookedRoom: 'N/A'
  });
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    price: '',
    capacity: '',
    amenities: '',
    image_url: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/dashboard');
      toast.error('Access denied. Admin only.');
      return;
    }
    fetchAdminStats();
    fetchBookings();
    fetchUsers();
    fetchRooms();
  }, [user, navigate]);

  const fetchAdminStats = async () => {
    try {
      const response = await API.get('/admin/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to load admin stats');
    }
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/admin/bookings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await API.get('/admin/rooms', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    }
  };

  // Function to refresh all admin data
  const refreshAdminData = () => {
    fetchAdminStats();
    fetchBookings();
    fetchUsers();
    fetchRooms();
    toast.success('Dashboard refreshed successfully');
  };

  const handleLogout = () => {
    logout();
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await API.patch(`/admin/bookings/${bookingId}/status`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('Booking status updated successfully');
      fetchBookings();
      fetchAdminStats();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/rooms', newRoom, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Room created successfully');
      setNewRoom({
        name: '',
        description: '',
        price: '',
        capacity: '',
        amenities: '',
        image_url: ''
      });
      fetchRooms();
      fetchAdminStats();
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/rooms/${editingRoom.id}`, editingRoom, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Room updated successfully');
      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await API.delete(`/admin/rooms/${roomId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Room deleted successfully');
        fetchRooms();
        fetchAdminStats();
      } catch (error) {
        console.error('Error deleting room:', error);
        toast.error('Failed to delete room');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <div className="header-left">
          <Link to="/" className="site-name">
            <h1>Nature Nest Tiger Resort</h1>
          </Link>
          <nav className="header-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/rooms" className="nav-link">Rooms</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/about" className="nav-link">About</Link>
          </nav>
        </div>
        <div className="header-right">
          <div className="admin-welcome">
            <div className="admin-avatar">
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="admin-info">
              <h2>Admin: {user?.name}</h2>
              <p>Manage resort operations</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-chart-line"></i>
              Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <i className="fas fa-calendar-alt"></i>
              Manage Bookings
            </button>
            <button 
              className={`nav-item ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              <i className="fas fa-bed"></i>
              Manage Rooms
            </button>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-users"></i>
              User Management
            </button>
            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <i className="fas fa-chart-bar"></i>
              Analytics
            </button>
          </nav>
        </div>

        <div className="admin-main-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-header">
                <h2>Dashboard Overview</h2>
                <button className="refresh-btn" onClick={refreshAdminData}>
                  <i className="fas fa-sync-alt"></i>
                  Refresh
                </button>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.totalBookings}</h3>
                    <p>Total Bookings</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.totalUsers}</h3>
                    <p>Total Users</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-bed"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.totalRooms}</h3>
                    <p>Total Rooms</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.confirmedBookings}</h3>
                    <p>Confirmed Bookings</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="stat-info">
                    <h3>${stats.totalRevenue}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.mostBookedRoom}</h3>
                    <p>Most Popular Room</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-tab">
              <h2>Manage Bookings</h2>
              {isLoading ? (
                <div className="loading">Loading bookings...</div>
              ) : (
                <div className="bookings-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Guest</th>
                        <th>Room Type</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <div>
                              <strong>{booking.name}</strong>
                              <br />
                              <small>{booking.email}</small>
                            </div>
                          </td>
                          <td>{booking.room_type}</td>
                          <td>{formatDate(booking.checkin)}</td>
                          <td>{formatDate(booking.checkout)}</td>
                          <td>
                            <span className={`status-badge ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>${booking.total_price}</td>
                          <td>
                            <div className="action-buttons">
                              {booking.status === 'pending' && (
                                <>
                                  <button 
                                    className="btn-success"
                                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                  >
                                    Confirm
                                  </button>
                                  <button 
                                    className="btn-danger"
                                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <button 
                                  className="btn-danger"
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="rooms-tab">
              <h2>Manage Rooms</h2>
              <div className="rooms-content">
                <div className="rooms-list">
                  <h3>Existing Rooms</h3>
                  <div className="rooms-grid">
                    {rooms.map((room) => (
                      <div key={room.id} className="room-card">
                        <img src={room.image_url || '/images/room1.jpg'} alt={room.name} />
                        <div className="room-info">
                          <h4>{room.name}</h4>
                          <p>{room.description}</p>
                          <p><strong>Price:</strong> ${room.price_per_night}/night</p>
                          <p><strong>Capacity:</strong> {room.capacity} guests</p>
                          <div className="room-actions">
                            <button 
                              className="btn-primary"
                              onClick={() => setEditingRoom(room)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn-danger"
                              onClick={() => handleDeleteRoom(room.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="room-form-section">
                  <h3>{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
                  <form onSubmit={editingRoom ? handleUpdateRoom : handleCreateRoom} className="room-form">
                    <div className="form-group">
                      <label>Room Name</label>
                      <input
                        type="text"
                        value={editingRoom ? editingRoom.name : newRoom.name}
                        onChange={(e) => editingRoom 
                          ? setEditingRoom({...editingRoom, name: e.target.value})
                          : setNewRoom({...newRoom, name: e.target.value})
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={editingRoom ? editingRoom.description : newRoom.description}
                        onChange={(e) => editingRoom 
                          ? setEditingRoom({...editingRoom, description: e.target.value})
                          : setNewRoom({...newRoom, description: e.target.value})
                        }
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price per Night</label>
                        <input
                          type="number"
                          value={editingRoom ? editingRoom.price : newRoom.price}
                          onChange={(e) => editingRoom 
                            ? setEditingRoom({...editingRoom, price: e.target.value})
                            : setNewRoom({...newRoom, price: e.target.value})
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Capacity</label>
                        <input
                          type="number"
                          value={editingRoom ? editingRoom.capacity : newRoom.capacity}
                          onChange={(e) => editingRoom 
                            ? setEditingRoom({...editingRoom, capacity: e.target.value})
                            : setNewRoom({...newRoom, capacity: e.target.value})
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Amenities</label>
                      <input
                        type="text"
                        value={editingRoom ? editingRoom.amenities : newRoom.amenities}
                        onChange={(e) => editingRoom 
                          ? setEditingRoom({...editingRoom, amenities: e.target.value})
                          : setNewRoom({...newRoom, amenities: e.target.value})
                        }
                        placeholder="WiFi, AC, TV, etc."
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="url"
                        value={editingRoom ? editingRoom.image_url : newRoom.image_url}
                        onChange={(e) => editingRoom 
                          ? setEditingRoom({...editingRoom, image_url: e.target.value})
                          : setNewRoom({...newRoom, image_url: e.target.value})
                        }
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary">
                        {editingRoom ? 'Update Room' : 'Add Room'}
                      </button>
                      {editingRoom && (
                        <button 
                          type="button" 
                          className="btn-secondary"
                          onClick={() => setEditingRoom(null)}
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-tab">
              <h2>User Management</h2>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Total Bookings</th>
                      <th>Total Spent</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.bookings?.length || 0}</td>
                        <td>
                          ${user.bookings
                            ?.filter(b => b.status === 'confirmed')
                            ?.reduce((sum, b) => sum + parseFloat(b.total_price), 0)
                            ?.toFixed(2) || '0.00'}
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-tab">
              <h2>Analytics & Reports</h2>
              <div className="analytics-content">
                <div className="analytics-card">
                  <h3>Revenue Overview</h3>
                  <div className="analytics-stats">
                    <div className="analytics-stat">
                      <h4>Total Revenue</h4>
                      <p className="stat-value">${stats.totalRevenue}</p>
                    </div>
                    <div className="analytics-stat">
                      <h4>Average Booking Value</h4>
                      <p className="stat-value">
                        ${stats.totalBookings > 0 ? (stats.totalRevenue / stats.totalBookings).toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>Booking Statistics</h3>
                  <div className="analytics-stats">
                    <div className="analytics-stat">
                      <h4>Confirmation Rate</h4>
                      <p className="stat-value">
                        {stats.totalBookings > 0 ? ((stats.confirmedBookings / stats.totalBookings) * 100).toFixed(1) : '0'}%
                      </p>
                    </div>
                    <div className="analytics-stat">
                      <h4>Most Popular Room</h4>
                      <p className="stat-value">{stats.mostBookedRoom}</p>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>User Insights</h3>
                  <div className="analytics-stats">
                    <div className="analytics-stat">
                      <h4>Total Users</h4>
                      <p className="stat-value">{stats.totalUsers}</p>
                    </div>
                    <div className="analytics-stat">
                      <h4>Active Users</h4>
                      <p className="stat-value">
                        {users.filter(u => u.bookings && u.bookings.length > 0).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
