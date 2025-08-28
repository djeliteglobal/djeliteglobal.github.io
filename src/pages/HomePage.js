import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function HomePage() {
  return (
    <div className="homepage">
      {/* Header Section */}
      

      {/* Hero Section - Hard Techno Skills */}
      <section className="hero-section">
        <div className="container">
          <h2>Hard Techno skills</h2>
          <p>Courses, resources and opportunities necessary to accelerate your DJ/producer career.</p>
          <Link to="/courses" className="explore-btn">Explore courses</Link>
        </div>
      </section>

      {/* Summer Promo Section */}
      <section className="summer-promo">
        <div className="container">
          <h3>SUMMER PROMO</h3>
          <p>Up to 50% off</p>
          <div className="promo-details">
            <p>Limited time offer - Enroll in any course and get 50% off!</p>
          </div>
        </div>
      </section>

      {/* Path Start Section */}
      <section className="path-start-section">
        <div className="container">
          <h3>Your path starts from here</h3>
          <p>What best describes you?</p>
          <div className="path-options">
            <label><input type="radio" name="path" value="dj" /> DJ</label>
            <label><input type="radio" name="path" value="producer" /> Producer</label>
            <label><input type="radio" name="path" value="dj-producer" /> DJ & Producer</label>
          </div>
          <p>It will be possible only if you have the right tutors.</p>
        </div>
      </section>

      {/* Most Popular Section - Placeholder */}
      <section className="most-popular-section">
        <div className="container">
          <h3>Most popular</h3>
          <p>Check out our most popular courses and tutors.</p>
        </div>
      </section>

      {/* Upcoming Section - Placeholder */}
      <section className="upcoming-section">
        <div className="container">
          <h3>Upcoming</h3>
          <p>Stay tuned for new courses and events.</p>
        </div>
      </section>

      {/* Open Contests Section - Placeholder */}
      <section className="open-contests-section">
        <div className="container">
          <h3>Open contests</h3>
          <p>Participate in our contests and showcase your skills.</p>
        </div>
      </section>

      {/* Past Winners Section - Placeholder */}
      <section className="past-winners-section">
        <div className="container">
          <h3>Past winners</h3>
          <p>See the talented winners of our previous contests.</p>
        </div>
      </section>

      {/* Partners Section - Placeholder */}
      <section className="partners-section">
        <div className="container">
          <h3>The best partners to support your growth:</h3>
          <p>Our trusted partners in the music industry.</p>
        </div>
      </section>

      {/* Membership Section - Placeholder */}
      <section className="membership-section">
        <div className="container">
          <h3>How much it costs?</h3>
          <p>Flexible pricing plans to suit your needs.</p>
        </div>
      </section>

      {/* User Say Section - Placeholder */}
      <section className="user-say-section">
        <div className="container">
          <h3>Our users say</h3>
          <p>Hear what our students have to say about their experience.</p>
        </div>
      </section>

      {/* FAQ Section - Placeholder */}
      <section className="faq-section">
        <div className="container">
          <h3>FAQ</h3>
          <p>Find answers to commonly asked questions.</p>
        </div>
      </section>

      {/* Footer Section - Placeholder */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Seedj. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;