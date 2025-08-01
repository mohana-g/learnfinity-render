import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; 2025 Learnfinity. All Rights Reserved.</p>
        <p>Contact us: <a href="mailto:support@learnfinity.com">support@learnfinity.com</a> | <a href="tel:+919573569787">+91 9573569787</a></p>
        <ul className="footer-links">
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/faq">FAQ</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
