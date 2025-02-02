import React, { useEffect, useState } from "react";
import { Link} from "react-router-dom";
import axios from "axios";
import "./header.css";
 
const Header = ({ handleLogout }) => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
 
  // Fetch user profile on mount
  useEffect(() => {
    axios.get("http://localhost:6005/auth/user", { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        setUser(null);
      });
 
    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
 
  // Handle logout and force Google re-authentication
  const logout = () => {
    axios.get("http://localhost:6005/auth/logout", { withCredentials: true })
        .then(() => {
            setUser(null);

            // Remove stored authentication data
            localStorage.removeItem("token");
            sessionStorage.clear(); // Clear session storage
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear cookies
            
            // Redirect to login page
            window.location.href = "http://localhost:3000/";
        })
        .catch(error => {
            console.error("Logout failed:", error);

            // Force logout in case of API failure
            localStorage.removeItem("token");
            sessionStorage.clear();
            window.location.href = "http://localhost:3000/";
        });
};

 
 
  // Format time
  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
 
  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <h1>Invoice Reminder</h1>
        </div>
 
        <div className="nav-right">
          {user ? (
            <>
              {/* Display Current Time */}
              <div className="current-time">{formatTime(currentTime)}</div>
 
              {/* Profile Dropdown */}
              <div className="profile-container">
                <img
                  src={user.image}
                  alt="Profile"
                  className="profile-img"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className="dropdown-menu">
                    <p className="dropdown-item">👤 {user.displayName}</p>
                    <p className="dropdown-item">📧 {user.email}</p>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/" className="login-link">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
};
 
export default Header;
 