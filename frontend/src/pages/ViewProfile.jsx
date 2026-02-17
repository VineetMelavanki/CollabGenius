import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ViewProfile() {
  const [error, seterror] = useState("");
  const [user, setuser] = useState(null);

  useEffect(() => {
    const showuser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          seterror("Please log in");
          return;
        }
        const response = await axios.get("http://localhost:8000/api/Profile/View-Profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        setuser(response.data.Profile);
      } catch (error) {
        if (error.response) {
          seterror(error.response.data.msg || "Cannot view Profile");
        } else {
          seterror("Internal server error");
        }
      }
    };
    showuser();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-4xl mx-auto">
          {error}
        </div>
      )}

      {!error && !user && (
        <div className="text-center text-primary-600 text-xl">Loading...</div>
      )}

      {user && (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <img
                  src={user?.photo?.url}
                  alt={user?.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-100"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.name}</h2>
              <p className="text-gray-600 mb-4 border p-2 rounded">User ID: {user?.userId}</p>
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium">
                {user?.skillevel}
              </div>
            </div>

            {/* Details Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Profile Details</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Name</label>
                  <p className="text-lg text-gray-800 mt-1">{user?.name}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Bio</label>
                  <p className="text-lg text-gray-800 mt-1">{user?.Bio}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Skills</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.skills?.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Skill Level</label>
                  <p className="text-lg text-gray-800 mt-1">{user?.skillevel}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">GitHub</label>
                  <a
                    href={user?.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-primary-600 hover:text-primary-700 mt-1 inline-flex items-center gap-2"
                  >
                    {user?.github_link}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
