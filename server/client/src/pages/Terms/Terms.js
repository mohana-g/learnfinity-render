import React from 'react';
import './Terms.css';

function Terms() {
  return (
    <div className="terms-container">
      <h1>Terms of Service</h1>
      <p>
        Welcome to Learnfinity! By using our platform, you agree to the following terms and conditions.
        Please read them carefully.
      </p>
      <h2>1. User Responsibilities</h2>
      <p>
        As a user of Learnfinity, you are responsible for ensuring the accuracy of your personal details and 
        maintaining the confidentiality of your account credentials.
      </p>
      <h2>2. Content Ownership</h2>
      <p>
        All content available on Learnfinity is owned by our platform or licensed to us. Unauthorized reproduction 
        or distribution of this content is strictly prohibited.
      </p>
      <h2>3. Privacy Policy</h2>
      <p>
        Your privacy is important to us. For detailed information on how we collect, use, and protect your data, 
        please refer to our <a href="/privacy">Privacy Policy</a>.
      </p>
      <h2>4. Limitation of Liability</h2>
      <p>
        Learnfinity is not responsible for any damages or losses resulting from your use of our platform.
      </p>
      <h2>5. Amendments</h2>
      <p>
        We reserve the right to update these terms at any time. Continued use of our platform constitutes acceptance
        of the updated terms.
      </p>
    </div>
  );
}

export default Terms;
