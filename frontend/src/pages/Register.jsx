import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // ✅ same CSS file used for Login

export default function Register() {
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    name: "",
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
        "http://localhost:8000/api/User/register",
        formdata
      );
      setmessage(response.data.msg || "Registered Successfully");
      setTimeout(() => navigate("/login"), 1500); // redirect after success
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.msg || "Registration failed");
      } else {
        seterror("Network error");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Register</h1>
        <p className="subtitle">Create an account to get started!</p>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={submitchange}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formdata.name}
            onChange={handlechange}
            required
          />
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
          <button type="submit">Register</button>
        </form>

        <p className="switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
