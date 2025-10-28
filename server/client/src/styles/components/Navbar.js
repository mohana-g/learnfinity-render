// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useMsal } from "@azure/msal-react";
// import MicrosoftLogin from '../../pages/Login/MicrosoftLogin';
// import './Navbar.css';

// function Navbar() {
//   const { instance } = useMsal();
//   const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);
//   const [isMicrosoft, setIsMicrosoft] = useState(localStorage.getItem('isMicrosoftLogin') === 'true');
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     const updateRoleState = () => {
//       setUserRole(localStorage.getItem('role'));
//       setIsMicrosoft(localStorage.getItem('isMicrosoftLogin') === 'true');
//     };

//     updateRoleState();

//     const handleStorage = () => updateRoleState();
//     const interval = setInterval(updateRoleState, 300); // Ensure updates even without event

//     window.addEventListener('storage', handleStorage);
//     return () => {
//       clearInterval(interval);
//       window.removeEventListener('storage', handleStorage);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('role');
//     localStorage.removeItem('adminToken');
//     localStorage.removeItem('trainerToken');
//     localStorage.removeItem('learnerToken');
//     localStorage.removeItem('isMicrosoftLogin');
//     setIsMenuOpen(false);
//     setUserRole(null);

//     if (isMicrosoft) {
//       instance.logoutRedirect({ postLogoutRedirectUri: '/' });
//     } else {
//       window.location.href = '/signin';
//     }
//   };

//   const closeMenu = () => setIsMenuOpen(false);

//   return (
//     <header className="navbar">
//       <div className="navbar-container">
//         <div className="logo">
//           <Link to="/" onClick={closeMenu}>Learnfinity</Link>
//         </div>
//         <button className="hamburger" onClick={() => setIsMenuOpen(prev => !prev)}>☰</button>

//         <nav className={isMenuOpen ? 'nav-open' : ''}>
//           <ul className="nav-links">
//             {userRole === "admin" && (
//               <>
//                 <li><Link to="/admin-dashboard" onClick={closeMenu}>Home</Link></li>
//                 <li><Link to="/admin/courses" onClick={closeMenu}>Courses</Link></li>
//                 <li><Link to="/admin/about" onClick={closeMenu}>About</Link></li>
//                 <li><Link to="/admin/faq" onClick={closeMenu}>FAQ</Link></li>
//                 <li><Link to="/admin/send-mail" onClick={closeMenu}>Send Mail</Link></li>
//               </>
//             )}

//             {userRole === "trainer" && (
//               <>
//                 <li><Link to="/trainer-dashboard" onClick={closeMenu}>Home</Link></li>
//                 <li><Link to="/trainer-dashboard/courses" onClick={closeMenu}>Courses</Link></li>
//                 <li><Link to="/trainer-dashboard/about" onClick={closeMenu}>About</Link></li>
//                 <li><Link to="/trainer-dashboard/faq" onClick={closeMenu}>FAQ</Link></li>
//                 <li><Link to="/trainer-dashboard/profile" onClick={closeMenu}>Profile</Link></li>
//               </>
//             )}

//             {userRole === "learner" && (
//               <>
//                 <li><Link to="/learner-dashboard" onClick={closeMenu}>Home</Link></li>
//                 <li><Link to="/learner-dashboard/courses" onClick={closeMenu}>Courses</Link></li>
//                 <li><Link to="/learner-dashboard/about" onClick={closeMenu}>About</Link></li>
//                 <li><Link to="/learner-dashboard/faq" onClick={closeMenu}>FAQ</Link></li>
//                 <li><Link to="/learner-dashboard/profile" onClick={closeMenu}>Profile</Link></li>
//               </>
//             )}

//             {!userRole && (
//               <>
//                 <li><Link to="/" onClick={closeMenu}>Home</Link></li>
//                 <li><Link to="/courses" onClick={closeMenu}>Courses</Link></li>
//                 <li><Link to="/about" onClick={closeMenu}>About</Link></li>
//                 <li><Link to="/faq" onClick={closeMenu}>FAQ</Link></li>
//                 <li><Link to="/signup" className="signup-link" onClick={closeMenu}>Sign Up</Link></li>
//                 <li><Link to="/signin" onClick={closeMenu}>Sign In</Link></li>
//                 <li><MicrosoftLogin /></li>
//               </>
//             )}

//             {userRole && (
//               <li><button onClick={handleLogout}>Logout</button></li>
//             )}
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// }

// export default Navbar;



// ✅ Updated Navbar.js with active link highlighting and other improvements
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // ✅ use NavLink
import { useMsal } from "@azure/msal-react";
import logo from '../../assets/HTI.png';
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
    const interval = setInterval(updateRoleState, 300);

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

  const getNavLinkClass = ({ isActive }) =>
    isActive ? "active-link" : "";

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <NavLink to="/" end onClick={closeMenu} className="logo-link">
            <img src={logo} alt="Learnfinity Logo" className="logo-img" />
          </NavLink>
        </div>
        <button className="hamburger" onClick={() => setIsMenuOpen(prev => !prev)}>☰</button>

        <nav className={isMenuOpen ? 'nav-open' : ''}>
          <ul className="nav-links">
            {userRole === "admin" && (
              <>
                <li><NavLink to="/admin-dashboard" end onClick={closeMenu} className={getNavLinkClass}>Home</NavLink></li>
                <li><NavLink to="/admin/courses" onClick={closeMenu} className={getNavLinkClass}>Courses</NavLink></li>
                <li><NavLink to="/admin/about" onClick={closeMenu} className={getNavLinkClass}>About</NavLink></li>
                <li><NavLink to="/admin/faq" onClick={closeMenu} className={getNavLinkClass}>FAQ</NavLink></li>
                <li><NavLink to="/admin/send-mail" onClick={closeMenu} className={getNavLinkClass}>Send Mail</NavLink></li>
              </>
            )}

            {userRole === "trainer" && (
              <>
                <li><NavLink to="/trainer-dashboard" end onClick={closeMenu} className={getNavLinkClass}>Home</NavLink></li>
                <li><NavLink to="/trainer-dashboard/courses" onClick={closeMenu} className={getNavLinkClass}>Courses</NavLink></li>
                <li><NavLink to="/trainer-dashboard/about" onClick={closeMenu} className={getNavLinkClass}>About</NavLink></li>
                <li><NavLink to="/trainer-dashboard/faq" onClick={closeMenu} className={getNavLinkClass}>FAQ</NavLink></li>
                <li><NavLink to="/trainer-dashboard/profile" onClick={closeMenu} className={getNavLinkClass}>Profile</NavLink></li>
              </>
            )}

            {userRole === "learner" && (
              <>
                <li><NavLink to="/learner-dashboard" end onClick={closeMenu} className={getNavLinkClass}>Home</NavLink></li>
                <li><NavLink to="/learner-dashboard/courses" onClick={closeMenu} className={getNavLinkClass}>Courses</NavLink></li>
                <li><NavLink to="/learner-dashboard/about" onClick={closeMenu} className={getNavLinkClass}>About</NavLink></li>
                <li><NavLink to="/learner-dashboard/faq" onClick={closeMenu} className={getNavLinkClass}>FAQ</NavLink></li>
                <li><NavLink to="/learner-dashboard/profile" onClick={closeMenu} className={getNavLinkClass}>Profile</NavLink></li>
              </>
            )}

            {!userRole && (
              <>
                <li><NavLink to="/" end onClick={closeMenu} className={getNavLinkClass}>Home</NavLink></li>
                <li><NavLink to="/courses" onClick={closeMenu} className={getNavLinkClass}>Courses</NavLink></li>
                <li><NavLink to="/about" onClick={closeMenu} className={getNavLinkClass}>About</NavLink></li>
                <li><NavLink to="/faq" onClick={closeMenu} className={getNavLinkClass}>FAQ</NavLink></li>
                <li>
                  <NavLink 
                    to="/signup" 
                    onClick={closeMenu} 
                    className={({ isActive }) => isActive ? "active-link signup-link" : "signup-link"}
                  >
                    Sign Up
                  </NavLink>
                </li>
                <li><NavLink to="/signin" onClick={closeMenu} className={getNavLinkClass}>Sign In</NavLink></li>
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
