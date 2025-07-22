import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "357a04d9-4f27-4699-8cb3-718977898ac7",
    authority: "https://login.microsoftonline.com/009944cd-196f-414f-a62a-d9ec41f72b20",
    redirectUri: "http://localhost:3000/microsoft-login", // Must match Azure portal setting
    postLogoutRedirectUri: "/",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "localStorage", // or "sessionStorage"
    storeAuthStateInCookie: false, // set to true for IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          default:
            console.log(message);
        }
      },
    },
    allowNativeBroker: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export const silentRequest = {
  scopes: ["openid", "profile", "email"],
};
