import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">DJ Elite</Link>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/dashboard">My Dashboard</Link></li>
          </ul>
        </nav>
        <div className="user-actions">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="signup-btn">Sign up</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
