import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // ✅ Same CSS for login & register

export default function Login() {
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });
  const [message, setmessage] = useState(null);
  const [error, seterror] = useState(null);

  const handlechange = (e) => {
    setformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitchange = async (e) => {
    e.preventDefault();
    setmessage(null);
    seterror(null);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/User/login",
        formdata
      );
      setmessage(response.data.msg || "Login Successfully");
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.msg || "Login failed");
      } else {
        seterror("Network error");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Login</h1>
        <p className="subtitle">Welcome back! Please login to continue.</p>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={submitchange}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formdata.email}
            onChange={handlechange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formdata.password}
            onChange={handlechange}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p className="switch">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}
