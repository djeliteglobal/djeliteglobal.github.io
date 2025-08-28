import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-logo">
          <NavLink to="/">DJ<span>Elite</span></NavLink>
        </div>
        <nav className="header-nav">
          <ul>
            <li><NavLink to="/courses">Courses</NavLink></li>
            <li><NavLink to="/shop">Shop</NavLink></li>
            <li><NavLink to="/community">Community</NavLink></li>
          </ul>
        </nav>
        <div className="header-actions">
          <NavLink to="/login" className="btn btn-secondary">Login</NavLink>
          <NavLink to="/register" className="btn btn-primary">Sign Up</NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
