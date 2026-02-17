import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ViewProject() {
  const [error, seterror] = useState("");
  const [project, setproject] = useState(null);

  useEffect(() => {
    const projectview = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        seterror("Please log in");
        return;
      }
      try {
        const response = await axios.get("http://localhost:8000/api/Project/View-Project", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setproject(response.data.project);
      } catch (error) {
        if (error.response) {
          seterror(error.response.data.msg || "Cannot fetch project");
        } else {
          seterror("Internal server error");
        }
      }
    };
    projectview();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-4xl mx-auto">
          {error}
        </div>
      )}

      {project && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Project Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{project?.title}</h1>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    project?.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {project?.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Owner</label>
                <p className="text-lg text-gray-800 mt-1">{project.ownerProfile?.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                <p className="text-lg text-gray-800 mt-1 capitalize">{project.status}</p>
              </div>
            </div>
          </div>

          {/* Project Members */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Members</h2>
            {project.members && project.members.length > 0 ? (
              <div className="space-y-3">
                {project.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-500">{member._id}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No members found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
