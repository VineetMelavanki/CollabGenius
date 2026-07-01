import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {LogIn} from "lucide-react"
import {GoogleLogin} from "@react-oauth/google"
import axios from "axios";
import {FaGithub} from "react-icons/fa"
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
        credentials: "include",
        body: JSON.stringify(formdata),
      });
      const data = await response.json();
            if (response.ok) {
        setmessage(data.msg || "Login Successfully");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        seterror(data.msg || "Login failed");
      }
    } catch {
      seterror("Network error");
    }
  };
  const handleGoogleSuccess=async(credentialResponse)=>{
    try{
      const response=await axios.post(
        "http://localhost:8000/api/User/google-login",
        {
           token:credentialResponse.credential
        },
        {
           withCredentials: true
        }
      );
      const data=response.data;
      setmessage("Google Login Successfull");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }catch(error)
    {
      console.log(error);
      seterror("Google login failed");
    }
  };
  const handlegithubLogin=()=>{
    window.location.href="http://localhost:8000/api/User/github/login";
  }

return (
  <div className="flex min-h-screen items-center justify-center bg-slate-100">

    <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

      <div className="flex justify-center items-center mb-4 ">
        <LogIn className="w-6 h-6 "/>
        </div>
      <div className="flex flex-col gap-4 ">

        <h1 className="font-bold text-2xl text-gray-800 text-center">
          Sign in with email
        </h1>
        <h2 className="font-light text-lg text-gray-500 text-center">
         Sign in to access the dashboard
        </h2>

        <form className="flex flex-col gap-3 " onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            value={formdata.email}
            onChange={handlechange}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
          type="password"
          name="password"
          value={formdata.password}
          onChange={handlechange}
          placeholder="Enter your password"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <button type="submit" className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition s">
            Sign in to account
          </button>

        <div className="flex flex-row gap-3">
          <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={()=>{
            seterror("Google login failed");
          }}
          useOneTap={false}
          auto_select={false}/>
            <button onClick={handlegithubLogin} className="flex items-center justify-center gap-2 border rounded-lg p-3 hover:bg-slate-100 transition cursor-pointer">
              <FaGithub size={22} />
              <span className="font-medium text-xs">GitHub</span>
            </button>
          </div>
        </form>
        <h1 className="text-center">Don't have an account?<span onClick={()=>navigate("/register")} className="text-blue-500 hover:underline"> Sign up</span></h1>
       {error &&<p className="text-red-500 text-2xl font-bold text-center">{error}</p>}
       {message && <p className="text-green-500  text-2xl font-bold text-center">{message}</p>}
      </div>

    </div>

  </div>
);
}