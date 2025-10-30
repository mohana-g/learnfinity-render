// import React, { useEffect, useState } from "react";
// import { useMsal } from "@azure/msal-react";
// import { loginRequest } from "../../Config/authConfig";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const MicrosoftLogin = () => {
//   const { instance, accounts } = useMsal();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [loggedIn, setLoggedIn] = useState(false);

//   useEffect(() => {
//   instance.handleRedirectPromise().then(async (response) => {
//     const account = response?.account || instance.getActiveAccount() || accounts[0];

//     if (account) {
//       instance.setActiveAccount(account);
//       setLoggedIn(true);
//       setLoading(true);

//       try {
//         const res = await axios.post("https://hilms.onrender.com/api/auth/check-user-role", {
//           email: account.username,
//         });

//         const role = res.data.role;
//         const token = res.data.token; // <-- Get the token from backend

//         localStorage.setItem("role", role);
//         localStorage.setItem("isMicrosoftLogin", "true");
//         window.dispatchEvent(new Event("storage"));

//         if (role === "admin") {
//           localStorage.setItem("adminToken", token); // <-- Store the JWT token!
//           navigate("/admin-dashboard");
//         } else if (role === "trainer") {
//           localStorage.setItem("trainerToken", token);
//           navigate("/trainer-dashboard");
//         } else if (role === "learner") {
//           localStorage.setItem("learnerToken", token);
//           navigate("/learner-dashboard");
//         } else {
//           navigate("/");
//         }
//       } catch (err) {
//         console.error("Role check failed:", err);
//         navigate("/");
//       } finally {
//         setLoading(false);
//       }
//     }
//   });
// }, [instance, navigate, accounts]);

//   const handleLogin = () => {
//     instance.loginRedirect(loginRequest);
//   };

//   const handleLogout = () => {
//     instance.logoutRedirect();
//   };

//   return (
//     <div>
//       {!loggedIn ? (
//         <button onClick={handleLogin} className="btn-microsoft" disabled={loading}>
//           {loading ? "Logging in..." : "Login with Microsoft"}
//         </button>
//       ) : (
//         <button onClick={handleLogout} className="btn-microsoft">
//           Logout
//         </button>
//       )}
//     </div>
//   );
// };

// export default MicrosoftLogin;

import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../Config/authConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MicrosoftLogin = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    instance.handleRedirectPromise().then(async (response) => {
      const account = response?.account || instance.getActiveAccount() || accounts[0];

      if (account) {
        instance.setActiveAccount(account);
        setLoggedIn(true);
        setLoading(true);

        try {
          // Call backend to get token + role
          const res = await axios.post("https://hilms.onrender.com/api/auth/check-user-role", {
            email: account.username,
          });

          const { role, token } = res.data;

          // ✅ Always store same token key
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          localStorage.setItem("isMicrosoftLogin", "true");
          window.dispatchEvent(new Event("storage"));

          // Navigate to correct dashboard
          if (role === "admin") navigate("/admin-dashboard");
          else if (role === "trainer") navigate("/trainer-dashboard");
          else if (role === "learner") navigate("/learner-dashboard");
          else navigate("/");
        } catch (err) {
          console.error("Role check failed:", err);
          navigate("/");
        } finally {
          setLoading(false);
        }
      }
    });
  }, [instance, navigate, accounts]);

  const handleLogin = () => instance.loginRedirect(loginRequest);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isMicrosoftLogin");
    instance.logoutRedirect();
  };

  return (
    <div>
      {!loggedIn ? (
        <button onClick={handleLogin} className="btn-microsoft" disabled={loading}>
          {loading ? "Logging in..." : "Login with Microsoft"}
        </button>
      ) : (
        <button onClick={handleLogout} className="btn-microsoft">
          Logout
        </button>
      )}
    </div>
  );
};

export default MicrosoftLogin;
