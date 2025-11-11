import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";
import MicrosoftLogin from '../../pages/Login/MicrosoftLogin';
import './Navbar.css';

function Navbar() {
  const { instance } = useMsal();
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);
  const [isMicrosoft, setIsMicrosoft] = useState(localStorage.getItem('isMicrosoftLogin') === 'true');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateRoleState = () => {
      setUserRole(localStorage.getItem('role'));
      setIsMicrosoft(localStorage.getItem('isMicrosoftLogin') === 'true');
    };

    updateRoleState();

    const handleStorage = () => updateRoleState();
    const interval = setInterval(updateRoleState, 300); // Ensure updates even without event

    window.addEventListener('storage', handleStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('trainerToken');
    localStorage.removeItem('learnerToken');
    localStorage.removeItem('isMicrosoftLogin');
    setIsMenuOpen(false);
    setUserRole(null);

    if (isMicrosoft) {
      instance.logoutRedirect({ postLogoutRedirectUri: '/' });
    } else {
      window.location.href = '/signin';
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>Learnfinity</Link>
        </div>
        <button className="hamburger" onClick={() => setIsMenuOpen(prev => !prev)}>☰</button>

        <nav className={isMenuOpen ? 'nav-open' : ''}>
          <ul className="nav-links">
            {userRole === "admin" && (
              <>
                <li><Link to="/admin-dashboard" onClick={closeMenu}>Home</Link></li>
                <li><Link to="/admin/courses" onClick={closeMenu}>Courses</Link></li>
                <li><Link to="/admin/about" onClick={closeMenu}>About</Link></li>
                <li><Link to="/admin/faq" onClick={closeMenu}>FAQ</Link></li>
                <li><Link to="/admin/send-mail" onClick={closeMenu}>Send Mail</Link></li>
              </>
            )}

            {userRole === "trainer" && (
              <>
                <li><Link to="/trainer-dashboard" onClick={closeMenu}>Home</Link></li>
                <li><Link to="/trainer-dashboard/courses" onClick={closeMenu}>Courses</Link></li>
                <li><Link to="/trainer-dashboard/about" onClick={closeMenu}>About</Link></li>
                <li><Link to="/trainer-dashboard/faq" onClick={closeMenu}>FAQ</Link></li>
                <li><Link to="/trainer-dashboard/profile" onClick={closeMenu}>Profile</Link></li>
              </>
            )}

            {userRole === "learner" && (
              <>
                <li><Link to="/learner-dashboard" onClick={closeMenu}>Home</Link></li>
                <li><Link to="/learner-dashboard/courses" onClick={closeMenu}>Courses</Link></li>
                <li><Link to="/learner-dashboard/about" onClick={closeMenu}>About</Link></li>
                <li><Link to="/learner-dashboard/faq" onClick={closeMenu}>FAQ</Link></li>
                <li><Link to="/learner-dashboard/profile" onClick={closeMenu}>Profile</Link></li>
              </>
            )}

            {!userRole && (
              <>
                <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                <li><Link to="/courses" onClick={closeMenu}>Courses</Link></li>
                <li><Link to="/about" onClick={closeMenu}>About</Link></li>
                <li><Link to="/faq" onClick={closeMenu}>FAQ</Link></li>
                <li><Link to="/signup" className="signup-link" onClick={closeMenu}>Sign Up</Link></li>
                <li><Link to="/signin" onClick={closeMenu}>Sign In</Link></li>
                <li><MicrosoftLogin /></li>
              </>
            )}

            {userRole && (
              <li><button onClick={handleLogout}>Logout</button></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
