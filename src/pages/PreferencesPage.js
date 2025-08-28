import React from 'react';
import '../App.css'; // Assuming global styles are in App.css

function PreferencesPage() {
  return (
    <div className="preferences-page">
      <div className="preferences-container">
        <div className="preferences-header">
          <div className="preferences-logo">seedj</div>
          <h2>Set up your preferences</h2>
          <p>Enter your details in order to get your personalised content.</p>
        </div>

        <div className="progress-bar">
          <span className="step active">Profile Creation</span>
          <span className="step active">Path Selection</span>
          <span className="step">Checkout</span>
        </div>

        <form className="preferences-form">
          <div className="form-group">
            <label htmlFor="iam">I'm a</label>
            <select id="iam">
              <option value="">Select an option</option>
              <option value="dj">DJ</option>
              <option value="producer">Producer</option>
              <option value="dj-producer">DJ & Producer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="level">My level is</label>
            <select id="level">
              <option value="">Select an option</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="i-want">I want</label>
            <select id="i-want">
              <option value="">Select an option</option>
              <option value="learn-mixing">Learn mixing</option>
              <option value="improve-production">Improve production</option>
              <option value="career-guidance">Career guidance</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="genre">My preferred genre is</label>
            <select id="genre">
              <option value="">Select an option</option>
              <option value="techno">Techno</option>
              <option value="house">House</option>
              <option value="trance">Trance</option>
            </select>
          </div>

          <button type="submit" className="continue-btn">Continue</button>
        </form>

        <div className="promo-code-section">
          <p>Enter <span className="promo-code">SUMMERSEEDJ</span> code at checkout to redeem the offer.</p>
          <div className="countdown">
            <div className="countdown-item">
              <span className="number">18</span>
              <span className="label">Days</span>
            </div>
            <div className="countdown-item">
              <span className="number">2</span>
              <span className="label">Hrs</span>
            </div>
            <div className="countdown-item">
              <span className="number">19</span>
              <span className="label">Mins</span>
            </div>
            <div className="countdown-item">
              <span className="number">15</span>
              <span className="label">Sec</span>
            </div>
          </div>
        </div>

        <div className="footer-logos">
          <img src="https://via.placeholder.com/100x50?text=Trustpilot" alt="Trustpilot" />
          <img src="https://via.placeholder.com/100x50?text=AFEM" alt="AFEM" />
        </div>

        <div className="payment-icons">
          <img src="https://via.placeholder.com/50x30?text=Visa" alt="Visa" />
          <img src="https://via.placeholder.com/50x30?text=Mastercard" alt="Mastercard" />
          <img src="https://via.placeholder.com/50x30?text=Amex" alt="Amex" />
        </div>

        <p className="copyright">Made with ❤️ in the Netherlands | Seedj is part of PHASE 2 BV | All rights reserved. © 2025</p>
        <p className="terms-links">
          <a href="#terms">T&C's</a> | <a href="#privacy">Privacy Policy</a> | <a href="#cookies">Cookie Policy</a>
        </p>
      </div>
    </div>
  );
}

export default PreferencesPage;