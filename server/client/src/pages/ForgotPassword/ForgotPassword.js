/*import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';
//import 'emailjs-com';
import emailjs from '@emailjs/browser';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Track loading state


  const SERVICE_ID = 'service_jtatsrq';
  const TEMPLATE_ID = 'template_3hj5rro';
  //e.target = 
  const PUBLIC_KEY = '8TOkSAnsc4yfF81je';
  const PRIVATE_KEY = 'wOIY4BU5Xqm-cSd1ZQwf5';


  const handleOnSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.target, PUBLIC_KEY)
      .then((result) => {
        alert('Message Sent Successfully')
      }, (error) => {
        console.log(error.text);
        alert('Something went wrong!')
      });
    e.target.reset()
  };



  // const handleSubmit = async () => {
  //   const handleOnSubmit = (e) => {
  //   //   e.preventDefault();
  //     emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY,PRIVATE_KEY)
  //       .then((result) => {
  //         console.log(result.text);
  //         alert('Message Sent Successfully')
  //       }, (error) => {
  //         console.log(error.text);
  //         alert('Something went wrong!')
  //       });
  //     e.target.reset()
  //   };
  //   // return (

  //   if (email) {
  //     setLoading(true);  // Start loading when request is made
  //     try {
  //       const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });

  //       if (response.data.message) {

  //         setMessage(response.data.message);
  //         setEmail(''); // Clear email input after submit
  //       }
  //     } catch (err) {
  //       if (err.response) {
  //         setError(err.response.data.message || 'Error from backend');
  //       } else {
  //         setError('An error occurred while sending the reset link. Please try again.');
  //       }
  //       console.error('Error:', err);
  //     }
  //     setLoading(false);  // Stop loading when request finishes
  //   } else {
  //     setError('Please enter a valid email address');
  //   }
  // };
*/


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './ForgotPassword.css';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const SERVICE_ID = 'service_jtatsrq';
  const TEMPLATE_ID = 'template_3hj5rro';
  const PUBLIC_KEY = '8TOkSAnsc4yfF81je';

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const resetLink = `http://localhost:3000/reset-password?token=${btoa(email)}`;


    const emailParams = {
      to_email: email,
      reset_link: resetLink,
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, emailParams, PUBLIC_KEY)
      .then(() => {
        setMessage('Password reset link has been sent to your email.');
      })
      .catch((err) => {
        setError('Failed to send reset link. Please try again.');
        console.error('EmailJS Error:', err);
      })
      .finally(() => {
        setLoading(false);
        setEmail('');
      });
  };


  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        <form onSubmit={handleOnSubmit}>
          <div className="input-container">
            <label htmlFor="email">Enter your email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}> 
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
        </form>
        <div className="back-to-login">
          <Link to="/SignIn">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
