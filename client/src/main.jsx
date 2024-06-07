import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-ty3gqrptzwayw4xv.us.auth0.com"
      clientId="jR2OPW8S2KvbHWKImMLHuERVEBqZb7i2"
      authorizationParams={{
        redirect_uri: "https://homzy-rouge.vercel.app/"
      }}
      audience="https://homzy-phi.vercel.app/"
      scope="openid profile email"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
