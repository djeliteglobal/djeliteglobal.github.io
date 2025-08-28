import React from 'react';
import '../App.css'; // Assuming global styles are in App.css

function CoursesPage() {
  return (
    <div className="courses-page">
      

      <section className="library-section">
        <div className="container">
          <div className="library-header">
            <h2>Library</h2>
            <div className="filters">
              <select>
                <option>All Courses</option>
              </select>
              <select>
                <option>Type of course</option>
              </select>
              <select>
                <option>Level</option>
              </select>
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          {/* All courses by Mama Snake */}
          <div className="course-category">
            <h3>All courses by Mama Snake</h3>
            <div className="card-grid">
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Booth Presence</h4>
                  <p>1 hr 7 min - 1 class - by Mama Snake</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>The Vinyl Code</h4>
                  <p>1 hr 20 min - 3 chapters - by Yerko</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>4-deck & layering</h4>
                  <p>1 hr 30 min - 6 chapters - by Future.exe</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Bundles */}
          <div className="course-category">
            <h3>Courses Bundles</h3>
            <div className="card-grid">
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Industry Foundations</h4>
                  <p>2 hr 15 min - 5 chapters - by Perc</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Into Hard Groove</h4>
                  <p>1 hr 40 min - 4 chapters - by Dax J</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
            </div>
          </div>

          {/* All courses about CLUB LIFE */}
          <div className="course-category">
            <h3>All courses about CLUB LIFE</h3>
            <div className="card-grid">
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Mixing Recreation</h4>
                  <p>1 hr 30 min - 6 chapters</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Vjing & Visual Arts</h4>
                  <p>1 hr 40 min - 6 chapters</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Nightlife Photography</h4>
                  <p>1 hr 24 min - 6 chapters</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
            </div>
          </div>

          {/* All courses about DUB & REGGAE */}
          <div className="course-category">
            <h3>All courses about DUB & REGGAE</h3>
            <div className="card-grid">
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Sound Design & Modulation</h4>
                  <p>1 hr 30 min - 6 chapters</p>
                  <p className="level">Pro</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Sound Design II</h4>
                  <p>1 hr 40 min - 4 chapters</p>
                  <p className="level">Pro</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>30 Track Breakdown</h4>
                  <p>1 hr 24 min - 6 chapters</p>
                  <p className="level">Pro</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
            </div>
          </div>

          {/* All courses about D&B / DIGITAL JUNGLE */}
          <div className="course-category">
            <h3>All courses about D&B / DIGITAL JUNGLE</h3>
            <div className="card-grid">
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>The Vinyl Code</h4>
                  <p>1 hr 20 min - 3 chapters - by Yerko</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Mixing & Layering</h4>
                  <p>1 hr 30 min - 6 chapters - by Future.exe</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Instinct & Technique</h4>
                  <p>1 hr 24 min - 6 chapters</p>
                  <p className="level">Pro</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
            </div>
          </div>

          {/* All courses about 2011-EDM */}
          <div className="course-category">
            <h3>All courses about 2011-EDM</h3>
            <div className="card-grid">
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Soundscape Sculpting</h4>
                  <p>1 hr 30 min - 6 chapters - by Synapse</p>
                  <p className="level">Pro</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Gritty Tech Grooves</h4>
                  <p>1 hr 40 min - 4 chapters - by Funk_D</p>
                  <p className="level">Pro</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Rhythm Production</h4>
                  <p>1 hr 24 min - 6 chapters</p>
                  <p className="level">Pro</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
            </div>
          </div>

          {/* All courses about MODULAR WORLD */}
          <div className="course-category">
            <h3>All courses about MODULAR WORLD</h3>
            <div className="card-grid">
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Everything Transforms</h4>
                  <p>1 hr 30 min - 6 chapters - by Perc</p>
                  <p className="level">Pro</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Common Mistakes in Production</h4>
                  <p>1 hr 40 min - 4 chapters - by Dax J</p>
                  <p className="level">Pro</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Producing</h4>
                  <p>1 hr 24 min - 6 chapters</p>
                  <p className="level">Pro</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
            </div>
          </div>

          {/* All courses about MIXING */}
          <div className="course-category">
            <h3>All courses about MIXING</h3>
            <div className="card-grid">
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>The Vinyl Code</h4>
                  <p>1 hr 20 min - 3 chapters - by Yerko</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>4-deck & layering</h4>
                  <p>1 hr 30 min - 6 chapters - by Future.exe</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
              <div className="card">
                <img src="https://via.placeholder.com/300x200" alt="Course Thumbnail" />
                <div className="card-content">
                  <h4>Intermixing Mixing</h4>
                  <p>1 hr 24 min - 6 chapters</p>
                  <p className="level">Rookie</p>
                  <button className="watch-now-btn">Watch now</button>
                </div>
              </div>
            </div>
          </div>

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
              <p>&copy; 2025 DJ Elite. All rights reserved.</p>
              <p>Made with ❤️ in the Netherlands | DJ Elite is part of PHASE 2 BV</p>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}

export default CoursesPage;