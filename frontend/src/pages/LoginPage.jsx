import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({ email: "", password: "" });
  const [message, setmessage] = useState(null);
  const [error, seterror] = useState(null);

  const handlechange = (e) => {
    setformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setmessage(null);
    seterror(null);
    try {
      const response = await fetch("http://localhost:8000/api/User/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();
      if (response.ok) {
        setmessage(data.msg || "Login Successfully");
        localStorage.setItem("token", data.token);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        seterror(data.msg || "Login failed");
      }
    } catch {
      seterror("Network error");
    }
  };

    return (
  <div className="flex min-h-screen items-center justify-center bg-slate-100">

    <div className="bg-white w-80 p-6 rounded-xl drop-shadow-lg">

      <h1 className="text-2xl font-bold text-center mb-4">
        Login
      </h1>

      {error && (
        <p className="bg-red-500 text-white text-sm p-2 rounded mb-2 text-center">
          {error}
        </p>
      )}

      {message && (
        <p className="bg-green-500 text-white text-sm p-2 rounded mb-2 text-center">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input
          className="border p-2 rounded"
          placeholder="Enter your email"
          type="text"
          name="email"
          value={formdata.email}
          onChange={handlechange}
        />

        <input
          className="border p-2 rounded"
          placeholder="Enter your password"
          type="password"
          name="password"
          value={formdata.password}
          onChange={handlechange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

      </form>

    </div>

  </div>
);


}
