import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {LogIn} from "lucide-react"
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
    <div className=" flex min-h-screen items-center justify-center bg-slate-100 ">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <div className="flex justify-center items-center mb-4">
          <LogIn className="w-6 h-6"/>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-2xl text-gray-800 text-center">
             Sign up with email
            </h1>
            <h2 className="font-light text-lg text-gray-500 text-center">
              Sign up to view listed project and collaborate 
            </h2>
            <form onSubmit={submitchange} className="flex flex-col gap-3">
              <input
              type="text"
              name="name"
              placeholder="Name"
              value={formdata.name}
              onChange={handlechange}
               className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
               <input
               type="text"
               placeholder="Email"
               name="email"
               value={formdata.email}
               onChange={handlechange}
               className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
               <input
               type="password"
               placeholder="password"
               name="password"
               value={formdata.password}
               onChange={handlechange}
               className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
               <button type="submit" className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition mb-4">
                Create Account
               </button>
              </form>
              
                {error &&<p className="text-red-500 text-2xl font-bold text-center">{error}</p>}
       {message && <p className="text-green-500  text-2xl font-bold text-center">{message}</p>}
            </div>
        </div>

    </div>
    
  );
}
