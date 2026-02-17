import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      localStorage.setItem('token', response.data.token);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.msg || "Registration failed");
      } else {
        seterror("Network error");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
       <div className="bg-white w-80 p-6 rounded-xl drop-shadow-lg">
        <h1 className="font-bold text-2xl mb-4 text-center">
          Register
        </h1>
        {error && <p className="bg-red-500 text-white text-sm p-2 rounded mb-2 text-center">{error}</p>}
        {message &&<p className="bg-green-500 text-white text-sm p-2 rounded mb-2 text-center">{message}</p>}

        <form onSubmit={submitchange} className="flex flex-col gap-4">
         <input
         className="border p-2 rounded"
         placeholder="Enter your name"
         value={formdata.name}
         type="text"
         name="name"
         onChange={handlechange}/>
         <input
         className="border p-2 rounded"
         placeholder="Enter your email"
         type="email"
         value={formdata.email}
         name="email"
         onChange={handlechange}/>
         <input
         className="border p-2 rounded"
         placeholder="Enter your password"
         type="text"
         name="password"
         value={formdata.password}
         onChange={handlechange}/>
         <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition text-white text-center text-sm">Register</button>
        </form>
        
        </div>
    </div>
  );
}
