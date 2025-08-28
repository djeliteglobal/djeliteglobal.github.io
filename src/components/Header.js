import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Cierra el menú cada vez que cambia la ruta
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-logo">
          <NavLink to="/">DJ<span>Elite</span></NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav-desktop">
          <ul>
            <li><NavLink to="/courses">Courses</NavLink></li>
            <li><NavLink to="/shop">Shop</NavLink></li>
            <li><NavLink to="/community">Community</NavLink></li>
          </ul>
        </nav>

        <div className="header-actions-desktop">
          <NavLink to="/login" className="btn btn-secondary">Login</NavLink>
          <NavLink to="/register" className="btn btn-primary">Sign Up</NavLink>
        </div>

        {/* Mobile Hamburger Button */}
        <button className={`hamburger-btn ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          <nav>
            <ul>
              <li><NavLink to="/courses">Courses</NavLink></li>
              <li><NavLink to="/shop">Shop</NavLink></li>
              <li><NavLink to="/community">Community</NavLink></li>
              <li className="mobile-actions">
                <NavLink to="/login" className="btn btn-secondary">Login</NavLink>
                <NavLink to="/register" className="btn btn-primary">Sign Up</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;