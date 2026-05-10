import { useState } from "react";
import axios from "axios";

export default function CreateProfile() {
  const [formdata, setformdata] = useState({
    name: "",
    Bio: "",
    skills: "",
    skillevel: "",
    github_link: "",
  });

  const [file, setfile] = useState(null);
  const [error, seterror] = useState("");
  const [msg, setmsg] = useState("");

  const handlefilechange = (e) => {
    const requiredfile = e.target.files[0];
    setfile(requiredfile);
  };

  const handlechange = (e) => {
    setformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      seterror("");
      setmsg("");

      const token = localStorage.getItem("token");
      if (!token) {
        seterror("Invalid token");
        return;
      }
      if (!file) {
        seterror("Please upload a profile picture");
        return;
      }
      if (!formdata.name || !formdata.Bio || !formdata.skills || !formdata.github_link) {
        seterror("All fields are required");
        return;
      }

      const data = new FormData();
      data.append("name", formdata.name);
      data.append("Bio", formdata.Bio);
      data.append("skills", formdata.skills);
      data.append("skillevel", formdata.skillevel);
      data.append("github_link", formdata.github_link);
      data.append("photo", file);

      const response = await axios.post("http://localhost:8000/api/Profile/Create-Profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setmsg(response.data.msg || "Profile Created Successfully");
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.msg || "Profile cannot be Created");
      } else {
        seterror("Internal server error");
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">Create Profile</h2>

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
            <label className="block text-gray-700 mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formdata.name}
              onChange={handlechange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Bio</label>
            <textarea
              name="Bio"
              value={formdata.Bio}
              onChange={handlechange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
              placeholder="Tell us about yourself"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Skills</label>
            <input
              type="text"
              name="skills"
              value={formdata.skills}
              onChange={handlechange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="e.g., JavaScript, React, Node.js"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Skill Level</label>
            <select
              name="skillevel"
              value={formdata.skillevel}
              onChange={handlechange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white"
            >
              <option value="">Select skill level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">GitHub Link</label>
            <input
              type="url"
              name="github_link"
              value={formdata.github_link}
              onChange={handlechange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlefilechange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 file:cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary-500 text-black font-semibold rounded-lg hover:bg-primary-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg mt-6"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
}
