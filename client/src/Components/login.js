import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
 
const Login = () => {
  const navigate = useNavigate();
 
  // Check if user is already logged in
  useEffect(() => {
    fetch("http://localhost:6005/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          navigate("/dashboard");
        }
      })
      .catch(() => {});
  }, [navigate]);
 
  // Google Login Function
  const loginWithGoogle = () => {
    window.open("http://localhost:6005/auth/google/callback", "_self");
  };
 
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Welcome to Invoice Remainder </h1>
        <h1 className="login-title">Login</h1>
        {/* Google Login Button */}
        <div className="google-login-container">
          <button className="google-login-button" onClick={loginWithGoogle}>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default Login;
 