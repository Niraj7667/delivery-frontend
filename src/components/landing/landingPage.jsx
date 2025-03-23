import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUtensils, FaMotorcycle, FaQrcode, FaStore } from "react-icons/fa";
import "./page.css"; // Make sure to link to your CSS file

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="landing-page">
      {/* Sticky Header */}
      <header className={`sticky-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div 
            className="restaurant-logo"
            onClick={() => navigate('/')}
          >
            <span className="logo-icon">🍔</span>
            <h1 className="restaurant-name">
              <span className="quick">Quick</span> <span className="bite">Bite</span>
            </h1>
          </div>
          <nav className="header-nav">
            <button 
              className="nav-button" 
              onClick={() => navigate('/user/dashboard')}
            >
              Menu
            </button>
            <button 
              className="nav-button" 
              onClick={() => navigate('/about')}
            >
              About
            </button>
            <button 
              className="nav-button primary-button" 
              onClick={() => navigate('/auth/user/login')}
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <motion.div 
        className="hero-banner"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <h1>Delicious Food <span className="highlight">Delivered</span> Fast</h1>
          <p>From our kitchen to your table in minutes. Experience the taste revolution.</p>
          {/* <div className="hero-buttons">
            <motion.button 
              className="btn-primary"
              onClick={() => navigate('/menu')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Order Now
            </motion.button>
            <motion.button 
              className="btn-secondary"
              onClick={() => navigate('/restaurants')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find Restaurants
            </motion.button>
          </div> */}
        </div>
        <div className="hero-image">
          <img src="https://res.cloudinary.com/dzenijk6q/image/upload/v1737965549/scooter-1027350_1920_bs1njn.jpg" alt="Food Delivery" />
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="section-title">Why Choose <span className="highlight">QuickBite</span>?</h2>
        
        <div className="features">
          <motion.div className="feature" variants={itemVariants}>
            <div className="feature-icon">
              <FaMotorcycle />
            </div>
            <h3>Fast Delivery</h3>
            <p>Our drivers ensure your food arrives hot and fresh within 30 minutes.</p>
          </motion.div>
          
          <motion.div className="feature" variants={itemVariants}>
            <div className="feature-icon">
              <FaUtensils />
            </div>
            <h3>Quality Dining</h3>
            <p>Experience premium dining at our partner restaurants with exclusive deals.</p>
          </motion.div>
          
          <motion.div className="feature" variants={itemVariants}>
            <div className="feature-icon">
              <FaStore />
            </div>
            <h3>Partner With Us</h3>
            <p>Restaurant owners, boost your business with our digital ordering platform.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* QR Menu Section */}
      <motion.section 
        className="qr-menu"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2>Contactless <span className="highlight">QR Menu</span></h2>
        <div className="qr-content">
          <div className="qr-image">
            <FaQrcode className="qr-icon" />
            <img src="https://res.cloudinary.com/dzenijk6q/image/upload/v1737965677/qrcodemenu_cz4pa8.png" alt="QR Code Menu" />
          </div>
          <div className="qr-description">
            <h3>Modern Dining Experience</h3>
            <p>
              Scan, browse, and order from your smartphone. Our QR menu technology 
              provides a seamless and contactless dining experience for your customers.
            </p>
            <motion.button 
              onClick={() => navigate("/user/dashboard")} 
              className="btn-accent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get QR Menu For Your Restaurant
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers and restaurant partners.</p>
          <div className="cta-buttons">
            <motion.button 
              onClick={() => navigate("auth/user/signup")} 
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up as User
            </motion.button>
            <motion.button 
              onClick={() => navigate("auth/restaurant/signup")} 
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register Your Restaurant
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        className="testimonials"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonial-container">
          <motion.div className="testimonial" variants={itemVariants}>
            <div className="testimonial-rating">★★★★★</div>
            <p>"QuickBite delivers my lunch every day. Always on time and delicious!"</p>
            <div className="testimonial-author">— Sarah M.</div>
          </motion.div>
          
          <motion.div className="testimonial" variants={itemVariants}>
            <div className="testimonial-rating">★★★★★</div>
            <p>"As a restaurant owner, our orders increased by 35% after joining QuickBite."</p>
            <div className="testimonial-author">— John D., Restaurant Owner</div>
          </motion.div>
          
          <motion.div className="testimonial" variants={itemVariants}>
            <div className="testimonial-rating">★★★★★</div>
            <p>"The QR menu system revolutionized our dining experience. Our customers love it!"</p>
            <div className="testimonial-author">— Mark T., Café Manager</div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">🍔</span>
            <h2 className="restaurant-name">
              <span className="quick">Quick</span> <span className="bite">Bite</span>
            </h2>
          </div>
          <div className="footer-links">
            <a href="/about">About Us</a>
            <a href="/careers">Careers</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
          <p className="copyright">&copy; {new Date().getFullYear()} QuickBite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;