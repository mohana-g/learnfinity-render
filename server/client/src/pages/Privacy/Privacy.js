import React from 'react';
import './Privacy.css';

function Privacy() {
  return (
    <div className="privacy-container">
      <h1>Privacy Policy</h1>
      <p>
        At Learnfinity, we are committed to protecting your privacy. This Privacy Policy explains how we collect,
        use, and protect your personal information when you use our platform.
      </p>
      <h2>1. Information We Collect</h2>
      <p>
        We collect personal information such as your name, email address, and phone number when you register
        on Learnfinity or use our services.
      </p>
      <h2>2. How We Use Your Information</h2>
      <p>
        The information we collect is used to improve your experience on our platform, provide customer support, 
        and communicate with you about updates, promotions, or new features.
      </p>
      <h2>3. Information Sharing</h2>
      <p>
        We do not sell or rent your personal information to third parties. We may share your information with trusted
        partners to perform services on our behalf, such as sending emails or analyzing platform usage.
      </p>
      <h2>4. Data Security</h2>
      <p>
        We implement robust security measures to protect your data from unauthorized access, alteration, or destruction.
      </p>
      <h2>5. Cookies</h2>
      <p>
        Learnfinity uses cookies to enhance your user experience. These cookies help us remember your preferences and 
        provide personalized content.
      </p>
      <h2>6. Your Rights</h2>
      <p>
        You have the right to access, correct, or delete your personal information at any time. To exercise these rights,
        please contact us at <a href="mailto:support@learnfinity.com">support@learnfinity.com</a>.
      </p>
      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we will notify
        you of any significant updates.
      </p>
      <div className="highlight">
        <strong>Important:</strong> By using Learnfinity, you consent to the collection and use of your personal information as outlined in this policy.
      </div>
      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns regarding our Privacy Policy, please feel free to contact us at
        <a href="mailto:support@learnfinity.com">support@learnfinity.com</a>.
      </p>
    </div>
  );
}

export default Privacy;
