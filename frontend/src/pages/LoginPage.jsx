import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; 

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
    <main className="auth-container">
      <section className="auth-box">
        <header>
          <h1>LOGIN</h1>
          <p className="subtitle">Welcome back!! Please login</p>
        </header>
        {error && <p style={{color:"red"}}>{error}</p>}
          {message && <p style={{color:"green"}}>{message}</p>}
        <form onSubmit={submitchange}>
          
          <div>
            <input type="text" name="email"placeholder="Enter your email" value={formdata.email} onChange={handlechange}/>
          </div>
          <div>
            <input type="text" name="password" placeholder="Enter your password" value={formdata.password} onChange={handlechange}/>
          </div>
          <button type="submit">Login</button>
        </form>
        <p className="switch">
          Dont have an account?{" "}
          <span onClick={()=>navigate("/register")}>Register</span>
        </p>
      </section>
    </main>
  );
}
