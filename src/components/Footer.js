import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-column about">
          <h4>DJ<span>Elite</span></h4>
          <p>The ultimate learning platform for the next generation of DJs and music producers.</p>
        </div>
        <div className="footer-column links">
          <h5>Navigate</h5>
          <ul>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
        <div className="footer-column links">
          <h5>Legal</h5>
          <ul>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer-column subscribe">
          <h5>Subscribe</h5>
          <p>Get the latest news and special offers.</p>
          <div className="subscribe-form">
            <input type="email" placeholder="Enter your email" className="form-input" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DJ Elite. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
