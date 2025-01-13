import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="header">
        <h1>Foodie's Paradise</h1>
        <p>Delightful dining experiences, delivered online or offline.</p>
      </header>

      <section className="features">
        <div className="feature">
          <img src="/images/online-delivery.png" alt="Online Delivery" />
          <h2>Online Delivery</h2>
          <p>Order your favorite meals and get them delivered fast and fresh.</p>
        </div>
        <div className="feature">
          <img src="/images/offline-dining.png" alt="Offline Dining" />
          <h2>Offline Dining</h2>
          <p>Reserve tables or visit partner restaurants near you.</p>
        </div>
        <div className="feature">
          <img src="/images/restaurant-management.png" alt="Restaurant Management" />
          <h2>Restaurant Signup</h2>
          <p>Empower your restaurant with online ordering and management tools.</p>
        </div>
      </section>

      <section className="qr-menu">
        <h2>QR Code Menu</h2>
        <div className="qr-content">
          <img src="/images/qr-code.png" alt="QR Code Menu" />
          <div className="qr-description">
            <p>
              Revolutionize dining with our **QR Code Menu**! Allow customers to scan, browse, and
              order directly from their smartphones for a seamless and contactless experience.
            </p>
            <button onClick={() => navigate("/restaurant/signup")} className="button primary">
              Get Started with QR Menu
            </button>
          </div>
        </div>
      </section>

      <section className="cta-buttons">
        <h2>Join Us Today!</h2>
        <div className="buttons">
          <button onClick={() => navigate("auth/user/login")} className="button primary">
            User Login
          </button>
          <button onClick={() => navigate("auth/user/signup")} className="button secondary">
            User Signup
          </button>
          <button onClick={() => navigate("auth/restaurant/login")} className="button primary">
            Restaurant Login
          </button>
          <button onClick={() => navigate("auth/restaurant/signup")} className="button secondary">
            Restaurant Signup
          </button>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Foodie's Paradise. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
