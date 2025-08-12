import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import API from '../api';
import '../style/UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    totalSpent: '0.00'
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserBookings();
    fetchBookingStats();
  }, [user, navigate]);

  const fetchUserBookings = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/bookings/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookingStats = async () => {
    try {
      const response = await API.get('/bookings/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data.stats);
      setRecentBookings(response.data.recentBookings);
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    }
  };

  const refreshDashboard = () => {
    fetchUserBookings();
    fetchBookingStats();
  };

  const handleLogout = () => {
    logout();
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <Link to="/" className="site-name">
            <h1>Nature Nest Tiger Resort</h1>
          </Link>
        </div>
        <div className="header-right">
          <div className="user-welcome">
            <div className="user-avatar">
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="user-info">
              <h2>Welcome back, {user?.name}!</h2>
              <p>Manage your bookings and profile</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <nav className="dashboard-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-home"></i>
              Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <i className="fas fa-calendar-alt"></i>
              My Bookings
            </button>
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user"></i>
              Profile
            </button>
            <button 
              className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <i className="fas fa-heart"></i>
              Favorites
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog"></i>
              Settings
            </button>
          </nav>
        </div>

        <div className="main-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-header">
                <h2>Dashboard Overview</h2>
                <button className="refresh-btn" onClick={refreshDashboard}>
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
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.pending}</h3>
                    <p>Pending</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.confirmed}</h3>
                    <p>Confirmed</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="stat-info">
                    <h3>${stats.totalSpent}</h3>
                    <p>Total Spent</p>
                  </div>
                </div>
              </div>

              <div className="recent-bookings">
                <h2>Recent Bookings</h2>
                {recentBookings.length > 0 ? (
                  <div className="bookings-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Room Name</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td>{booking.room_type}</td>
                            <td>{formatDate(booking.checkin)} - {formatDate(booking.checkout)}</td>
                            <td>
                              <span className={`status-badge ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td>${booking.total_price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="no-bookings">No recent bookings found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-tab">
              <h2>My Bookings</h2>
              {isLoading ? (
                <div className="loading">Loading bookings...</div>
              ) : bookings.length > 0 ? (
                <div className="bookings-grid">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-header">
                        <h3>{booking.room_type}</h3>
                        <span className={`status-badge ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="booking-details">
                        <p><strong>Check-in:</strong> {formatDate(booking.checkin)}</p>
                        <p><strong>Check-out:</strong> {formatDate(booking.checkout)}</p>
                        <p><strong>Guests:</strong> {booking.guests}</p>
                        <p><strong>Total:</strong> ${booking.total_price}</p>
                      </div>
                      {booking.message && (
                        <div className="booking-message">
                          <p><strong>Message:</strong> {booking.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-bookings">
                  <p>No bookings available.</p>
                  <Link to="/rooms" className="btn-primary">Book a Room</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-tab">
              <h2>Profile Settings</h2>
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn-primary">Update Profile</button>
              </form>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="favorites-tab">
              <h2>My Favorites</h2>
              <div className="favorites-grid">
                <div className="favorite-card">
                  <img src="/images/room1.jpg" alt="Deluxe Room" />
                  <div className="favorite-info">
                    <h3>Deluxe Mountain View Room</h3>
                    <p>Your favorite room type</p>
                    <button className="btn-primary">Book Now</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <h2>Account Settings</h2>
              <div className="settings-section">
                <h3>Notifications</h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Email notifications
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Booking confirmations
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    Promotional emails
                  </label>
                </div>
              </div>
              <div className="settings-section">
                <h3>Privacy</h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Profile visibility
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
