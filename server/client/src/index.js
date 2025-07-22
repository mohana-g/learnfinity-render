import React /*, { useEffect }*/ from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, /*useNavigate*/ } from "react-router-dom";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./Config/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));

// function AppWithAuth() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     msalInstance.handleRedirectPromise()
//       .then(async (response) => {
//         const account = response?.account || msalInstance.getActiveAccount();

//         if (account) {
//           msalInstance.setActiveAccount(account);

//           try {
//             const userEmail = account.username;

//             const res = await fetch("http://localhost:5000/api/auth/check-user-role", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ email: userEmail }),
//             });

//             const data = await res.json();

//             if (data.role === "Learner") {
//               navigate("/Learner-dashboard");
//             } else if (data.role === "Trainer") {
//               navigate("/Trainer-dashboard");
//             } else if (data.role === "admin") {
//               navigate("/admin-dashboard");
//             } else {
//               console.error("Unknown role:", data.role);
//               navigate("/");
//             }
//           } catch (err) {
//             console.error("Error during role fetch:", err);
//             navigate("/");
//           }
//         }
//       })
//       .catch((err) => {
//         console.error("MSAL redirect error:", err);
//       });
//   }, [navigate]);

//   return <App />;
// }

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const authResult = event.payload;
    msalInstance.setActiveAccount(authResult.account);
  }
});

msalInstance.enableAccountStorageEvents();

// Async function to initialize MSAL first, then render app
async function startApp() {
  try {
    await msalInstance.initialize();

    // Set active account if none set yet
    if (!msalInstance.getActiveAccount()) {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }
    }

    root.render(
      <BrowserRouter>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </BrowserRouter>
    );
  } catch (error) {
    console.error("MSAL initialization error:", error);
  }
}

startApp();
