import React from 'react';
import '../App.css'; // Assuming global styles are in App.css

function BundleDetailPage() {
  return (
    <div className="bundle-detail-page">
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

      <section className="bundle-hero-section">
        <div className="container">
          <p className="go-back-link">← Go back</p>
          <div className="bundle-info-grid">
            <div className="bundle-main-content">
              <h2>Included in this bundle:</h2>
              <div className="bundle-courses-preview">
                <div className="course-preview-card">
                  <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                  <div className="course-preview-content">
                    <h4>My Journey Into Hardwax</h4>
                    <p>1 hr 30 min - 6 chapters - by Michael Rose</p>
                    <p className="level">Deep</p>
                  </div>
                </div>
                <div className="course-preview-card">
                  <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                  <div className="course-preview-content">
                    <h4>Antiform</h4>
                    <p>1 hr 40 min - 4 chapters - by Dax J</p>
                    <p className="level">Deep</p>
                  </div>
                </div>
                <div className="course-preview-card">
                  <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                  <div className="course-preview-content">
                    <h4>Forge</h4>
                    <p>1 hr 24 min - 6 chapters - by Perc</p>
                    <p className="level">Deep</p>
                  </div>
                </div>
              </div>

              <div className="bundle-details-section">
                <h3>Industry Foundations</h3>
                <p className="bundle-subtitle">2 hr 15 min - 5 chapters - by Perc</p>
                <p>Click here to see more information about the courses included in this bundle.</p>
                <div className="bundle-tabs">
                  <button className="tab-btn active">About</button>
                  <button className="tab-btn">Content</button>
                  <button className="tab-btn">Conversation</button>
                </div>
                <div className="bundle-video-player">
                  {/* Placeholder for video player */}
                  <img src="https://via.placeholder.com/800x450?text=Bundle+Video" alt="Bundle Video" />
                </div>
                <div className="bundle-description">
                  <h3>About this bundle</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <h3>In this bundle you will learn:</h3>
                  <ul className="learning-points">
                    <li>Understand key principles of the electronic music industry</li>
                    <li>Learn career strategies from industry leaders</li>
                    <li>Gain insights on DJing, Production and Music Business</li>
                    <li>Develop a strong mindset for longevity in music</li>
                  </ul>
                </div>
                <div className="bundle-takeaways">
                  <h3>Takeaways</h3>
                  <div className="takeaway-grid">
                    <div className="takeaway-item">
                      <img src="https://via.placeholder.com/50x50?text=Icon" alt="Icon" />
                      <p>Watch on mobile</p>
                    </div>
                    <div className="takeaway-item">
                      <img src="https://via.placeholder.com/50x50?text=Icon" alt="Icon" />
                      <p>95 Classes</p>
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

              <div className="you-might-be-interested">
                <h3>You might be interested in these packages</h3>
                <div className="card-grid">
                  <div className="card">
                    <img src="https://via.placeholder.com/300x200" alt="Package Thumbnail" />
                    <div className="card-content">
                      <h4>Perc Assault Trufan</h4>
                      <p>1 hr 30 min - 6 chapters - by Adrian D.</p>
                      <p className="level">Rookie</p>
                      <button className="watch-now-btn">Watch now</button>
                    </div>
                  </div>
                  <div className="card">
                    <img src="https://via.placeholder.com/300x200" alt="Package Thumbnail" />
                    <div className="card-content">
                      <h4>Dax J - Into Hard Groove</h4>
                      <p>1 hr 40 min - 4 chapters - by Dax J</p>
                      <p className="level">Rookie</p>
                      <button className="watch-now-btn">Watch now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bundle-sidebar">
              <div className="price-box">
                <p className="price-old">89€</p>
                <p className="price-new">149€</p>
                <p className="discount">41% + 50% off - limited availability at this price. Enter <span className="promo-code">SUMMERDJ</span> code at checkout to redeem the offer.</p>
                <button className="buy-now-btn">Buy now</button>
                <button className="get-subscription-btn">Get subscription</button>
                <p className="small-text">Full access to all courses, premium content, samples, charts starting at 50€ off (only 100 available)</p>
              </div>
              <div className="bundle-details-sidebar">
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
              <h4>Is this bundle for me?</h4>
              <p>This bundle is designed for aspiring and professional DJs and producers looking to enhance their skills and careers.</p>
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

export default BundleDetailPage;