import React from 'react';
import '../App.css'; // Assuming global styles are in App.css

function CheckoutPage() {
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <div className="checkout-logo">seedj</div>
          <h2>We selected this path for you:</h2>
          <p className="path-title">DJ for PRO</p>
        </div>

        <div className="progress-bar">
          <span className="step active">Profile Creation</span>
          <span className="step active">Path Selection</span>
          <span className="step active">Checkout</span>
        </div>

        <h3 className="payment-choice-title">Choose your preferable cycle of payment:</h3>

        <div className="payment-options-grid">
          <div className="payment-option-card">
            <span className="badge">BEST VALUE</span>
            <h4>YEARLY</h4>
            <p className="price">€16</p>
            <p className="per-month">/ month</p>
            <p className="every-year">every 1 year</p>
            <ul>
              <li>Cancel anytime.</li>
              <li>Flat fee forever, no rising price</li>
              <li>14-day money-back</li>
            </ul>
            <button className="get-offer-btn">Get the offer</button>
          </div>

          <div className="payment-option-card">
            <span className="badge">20% OFF</span>
            <h4>HALF YEARLY</h4>
            <p className="price">€23</p>
            <p className="per-month">/ month</p>
            <p className="every-year">every 6 months</p>
            <ul>
              <li>Cancel anytime.</li>
              <li>Flat fee forever, no rising price</li>
              <li>14-day money-back</li>
            </ul>
            <button className="get-offer-btn">Get the offer</button>
          </div>

          <div className="payment-option-card">
            <span className="badge">10% OFF</span>
            <h4>QUARTERLY</h4>
            <p className="price">€29</p>
            <p className="per-month">/ month</p>
            <p className="every-year">every 3 months</p>
            <ul>
              <li>Cancel anytime.</li>
              <li>Flat fee forever, no rising price</li>
              <li>14-day money-back</li>
            </ul>
            <button className="get-offer-btn">Get the offer</button>
          </div>
        </div>

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
              <span className="label">Sec</span
>
            </div>
          </div>
        </div>

        <div className="included-in-membership">
          <h3>Included in the membership:</h3>
          <div className="features-grid">
            <div className="feature-item">✅ Path Dashboard</div>
            <div className="feature-item">✅ Weekly Charts</div>
            <div className="feature-item">✅ Monthly updates & contests</div>
            <div className="feature-item">✅ Access to all our courses</div>
            <div className="feature-item">✅ Practice time-tracking</div>
            <div className="feature-item">✅ New Chat</div>
            <div className="feature-item">✅ Contests</div>
            <div className="feature-item">✅ Private Community</div>
            <div className="feature-item">✅ Demo Submission</div>
            <div className="feature-item">✅ Samples Library</div>
            <div className="feature-item">✅ Tracks & podcast upload</div>
            <div className="feature-item">✅ Shareable artist profile</div>
          </div>
          <p className="edit-path-link">If you think these plans are not right for you, go back to <a href="#edit-path">edit your goals</a>.</p>
        </div>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <h3>FAQ</h3>
            <div className="faq-items">
              <div className="faq-item">
                <h4>Is Seedj for me?</h4>
                <p>Seedj is designed for aspiring and professional DJs and producers looking to enhance their skills and careers.</p>
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
    </div>
  );
}

export default CheckoutPage;