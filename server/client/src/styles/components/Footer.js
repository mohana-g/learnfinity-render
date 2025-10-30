import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; { new Date().getFullYear() } HILMS | HIROTEC INDIA PRIVATE LIMITED. All Rights Reserved.</p>
        <p>Contact us: <a href="mailto:learn@hirotecindia.com">learn@hirotecindia.com</a> | <a href="tel:+919999999999">+91 9999999999</a></p>
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
