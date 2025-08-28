import React from 'react';
import '../App.css'; // Assuming global styles are in App.css

function CourseDetailPage() {
  return (
    <div className="course-detail-page">
      <header className="header">
        <div className="container">
          <div className="logo">seedj</div>
          <nav className="nav">
            <ul>
              <li><a href="#shop">Shop</a></li>
              <li><a href="#my-courses">My courses</a></li>
              <li><a href="#community">Community</a></li>
            </ul>
          </nav>
          <div className="user-actions">
            <button className="login-btn">Login</button>
            <button className="signup-btn">Sign up</button>
          </div>
        </div>
      </header>

      <section className="course-hero-section">
        <div className="container">
          <p className="go-back-link">← Go back</p>
          <div className="course-info-grid">
            <div className="course-main-content">
              <h2>Booth Presence</h2>
              <p className="course-subtitle">1 hr 7 min - 1 class - by Mama Snake</p>
              <div className="course-tabs">
                <button className="tab-btn active">About</button>
                <button className="tab-btn">Content</button>
                <button className="tab-btn">Conversation</button>
              </div>
              <div className="course-video-player">
                {/* Placeholder for video player */}
                <img src="https://via.placeholder.com/800x450?text=Course+Video" alt="Course Video" />
              </div>
              <div className="course-description">
                <h3>About this course</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <h3>In this course you will learn:</h3>
                <ul className="learning-points">
                  <li>How to select and structure music to create emotional flow</li>
                  <li>How to manage booth presence and read the energy of a crowd</li>
                  <li>How to use EQing and layering with intention, not excess</li>
                  <li>How to build a sustainable mindset in a fast-moving industry</li>
                </ul>
              </div>
              <div className="course-takeaways">
                <h3>Takeaways</h3>
                <div className="takeaway-grid">
                  <div className="takeaway-item">
                    <img src="https://via.placeholder.com/50x50?text=Icon" alt="Icon" />
                    <p>Watch on mobile</p>
                  </div>
                  <div className="takeaway-item">
                    <img src="https://via.placeholder.com/50x50?text=Icon" alt="Icon" />
                    <p>1-class</p>
                  </div>
                  <div className="takeaway-item">
                    <img src="https://via.placeholder.com/50x50?text=Icon" alt="Icon" />
                    <p>Interactive Content</p>
                  </div>
                  <div className="takeaway-item">
                    <img src="https://via.placeholder.com/50x50?text=Icon" alt="Icon" />
                    <p>Insights Included</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="course-sidebar">
              <div className="price-box">
                <p className="price-old">29€</p>
                <p className="price-new">49€</p>
                <p className="discount">41% + 50% off - limited availability at this price. Enter <span className="promo-code">SUMMERDJ</span> code at checkout to redeem the offer.</p>
                <button className="buy-now-btn">Buy now</button>
                <button className="get-subscription-btn">Get subscription</button>
                <p className="small-text">Full access to all courses, premium content, samples, charts starting at 50€ off (only 100 available)</p>
              </div>
              <div className="course-details-sidebar">
                <h3>Details:</h3>
                <ul>
                  <li>1 hr 7 min access</li>
                  <li>1 hr and 42 mins of video content</li>
                  <li>Access to the private course community</li>
                  <li>Audio in English</li>
                  <li>Subtitles in English, Spanish, French, German, Italian</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h3>FAQ</h3>
          <div className="faq-items">
            <div className="faq-item">
              <h4>Is this course for me?</h4>
              <p>This course is designed for aspiring and professional DJs and producers looking to enhance their skills and careers.</p>
            </div>
            <div className="faq-item">
              <h4>How can I get new contacts with Seedj?</h4>
              <p>Our platform offers various networking opportunities, including community forums, live events, and direct connections with industry professionals.</p>
            </div>
            <div className="faq-item">
              <h4>What will happen after my purchase?</h4>
              <p>Upon purchase, you will gain immediate access to your selected courses and membership benefits. You'll receive an email with all the details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <a href="#terms">T&C's</a> | <a href="#privacy">Privacy Policy</a> | <a href="#cookies">Cookie Policy</a>
          </div>
          <p>&copy; 2025 Seedj. All rights reserved.</p>
          <p>Made with ❤️ in the Netherlands | Seedj is part of PHASE 2 BV</p>
        </div>
      </footer>
    </div>
  );
}

export default CourseDetailPage;