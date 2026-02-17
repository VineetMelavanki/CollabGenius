import React, { useState } from "react";
import axios from "axios";

export default function CreateProject() {
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
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.msg || "Cannot create Project");
      } else {
        seterror("Internal server error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 px-9 py-1-">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">Create Project</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {msg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
          
            <input
              type="text"
              name="title"
              value={formdata.title}
              onChange={handlechange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition mt-4 mb-6"
              placeholder="Enter project name"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary-500 text-black font-semibold rounded-lg hover:bg-primary-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg mt-6"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}
