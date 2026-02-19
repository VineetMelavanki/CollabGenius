import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function CreateProject() {
  const navigate=useNavigate();
  const [msg, setmsg] = useState("");
  const [error, seterror] = useState("");
  const [formdata, setformdata] = useState({
    title: "",
  });

  const handlechange = (e) => {
    setformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    seterror("");
    setmsg("");
    const token = localStorage.getItem("token");
    if (!token) {
      seterror("Please log in again");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/Project/Create-Project",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setmsg(response.data.msg || "Project Created Successfully");
      setTimeout(()=>{
          navigate("/getallprojects");
      },2000)
      
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.msg || "Cannot create Project");
      } else {
        seterror("Internal server error");
      }
    }
  };

  return (
     <div className=" flex min-h-full items-center justify-center bg-slate-100">
      <div className="bg-white p-10  rounded-3xl shadow-xl w-full max-w-md">
        <div className="flex flex-col gap-3">
          <h1 className="text-gray-800 text-center font-bold text-2xl">
            Create Project
            </h1>
            <h2 className="font-light text-lg text-gray-500 text-center">
              Creating project helps you recruit team-mates
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                type="text"
                name="title"
                placeholder="Project name"
                value={formdata.title}
                onChange={handlechange}
               className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
               <button type="submit" className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition mb-4">
                Create Project
                </button>
                </form>
                {error &&<p className="text-red-500 text-2xl font-thin text-center">{error}</p>}
       {msg && <p className="text-green-500  text-2xl font-thin text-center">{msg}</p>}
          </div>
        </div>
      </div>
  );
}
