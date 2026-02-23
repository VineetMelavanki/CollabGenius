import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash, FaUserPlus, FaPencilAlt, FaArrowLeft, FaUsers, FaEnvelope, FaCrown } from "react-icons/fa";

export default function Projectdetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [error, seterror] = useState("");
  const [message, setmessage] = useState("");
  const [loading, setloading] = useState(true);
  const [owner, setowner] = useState(null);
  const [ownerId, setownerId] = useState(null);
  const [project, setproject] = useState(null);
  const [members, setmembers] = useState([]);
  const [showaddmodel, setshowaddmodel] = useState(false);
  const [formdata, setformdata] = useState({ email: "" });
  const [edit, setedit] = useState(false);
  const token = localStorage.getItem("token");

  const removemember = async (memberId) => {
    seterror("");
    setmessage("");
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/Project/remove-member/${projectId}/${memberId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setmembers((prev) => prev.filter((m) => (m._id || m).toString() !== memberId.toString()));
      setmessage(response.data.msg || "Member removed successfully");
      setedit(false);
    } catch (err) {
      seterror(err.response?.data?.msg || "Cannot remove member");
    }
  };

  const addmembers = async (e) => {
    e.preventDefault();
    seterror("");
    setmessage("");
    try {
      const response = await axios.post(
        `http://localhost:8000/api/Project/Add-members/${projectId}`,
        formdata,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setmessage(response?.data?.msg || "Added member successfully");
      if (response.data.success) {
        const refreshed = await axios.get(
          `http://localhost:8000/api/Project/get-project/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setmembers(refreshed.data.projectdata.members || []);
      }
      setformdata({ email: "" });
      setshowaddmodel(false);
    } catch (err) {
      seterror(err.response?.data?.msg || "Cannot add member");
    }
  };

  const handlechange = (e) => {
    setformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const deleteproject = async () => {
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    seterror("");
    setmessage("");
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/Project/delete/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setmessage(response.data?.msg || "Project deleted successfully");
      setTimeout(() => navigate("/getallprojects"), 1500);
    } catch (err) {
      seterror(err.response?.data?.msg || "Cannot delete project");
    }
  };

  useEffect(() => {
    const displayproject = async () => {
      setloading(true);
      seterror("");
      setmessage("");
      try {
        const response = await axios.get(
          `http://localhost:8000/api/Project/get-project/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const response1 = await axios.get("http://localhost:8000/api/Profile/View-Profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ProfileData = response1.data.Profile;
        const user = ProfileData.userId;
        const projectData = response.data.projectdata;
        setproject(projectData);
        setmessage(response.data.msg || "Project fetched successfully");
        setmembers(projectData.members || []);
        const oid =
          typeof projectData.ownerId === "object"
            ? projectData.ownerId._id
            : projectData.ownerId;
        setownerId(oid);
        const ownerIdVal =
          typeof projectData.ownerId === "object"
            ? projectData.ownerId._id || projectData.ownerId
            : projectData.ownerId;
        setowner(
          ownerIdVal &&
            (ownerIdVal.toString() === user.toString() || ownerIdVal === user)
        );
      } catch (err) {
        seterror(err.response?.data?.msg || "Cannot fetch project");
      } finally {
        setloading(false);
      }
    };
    displayproject();
  }, [projectId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {project && (
          <div className="space-y-6">
            {/* Project header card */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 pb-6 border-b border-gray-200">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : project.status === "archived"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status?.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <FaUsers className="w-4 h-4" />
                      {members.length} {members.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                </div>
                {owner && (
                  <button
                    onClick={deleteproject}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                  >
                    <FaTrash className="w-4 h-4" />
                    Delete Project
                  </button>
                )}
              </div>

              {/* Project info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm font-medium w-24">Owner</span>
                  <span className="flex items-center gap-1 text-gray-900">
                    <FaCrown className="w-4 h-4 text-amber-500" />
                    {typeof project.ownerId === "object"
                      ? project.ownerId.name || project.ownerId.email || "Owner"
                      : "Owner"}
                  </span>
                </div>
                {project.description && (
                  <div>
                    <span className="text-gray-500 text-sm font-medium block mb-1">Description</span>
                    <p className="text-gray-700">{project.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Team members section */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaUsers className="w-5 h-5 text-blue-600" />
                  Team Members
                </h2>
                <div className="flex items-center gap-2">
                  {owner && (
                    <>
                      <button
                        onClick={() => setshowaddmodel(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                      >
                        <FaUserPlus className="w-4 h-4" />
                        Add Member
                      </button>
                      <button
                        onClick={() => setedit(!edit)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
                          edit
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <FaPencilAlt className="w-4 h-4" />
                        {edit ? "Done" : "Manage"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {edit && owner && (
                <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm">
                  Edit mode: Click the trash icon to remove a member.
                </div>
              )}

              {members.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <FaUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No members yet</p>
                  {owner && (
                    <button
                      onClick={() => setshowaddmodel(true)}
                      className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Add your first member
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((member, index) => (
                    <div
                      key={member._id || member || index}
                      className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-100"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {(member.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {member.name || "Unknown"}
                            {ownerId && (member._id || member).toString() === ownerId.toString() && (
                              <span className="ml-2 text-amber-600 text-xs font-normal">(Owner)</span>
                            )}
                          </p>
                          {member.email && (
                            <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                              <FaEnvelope className="w-3 h-3 shrink-0" />
                              {member.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => navigate(`/view-profile/${member._id}`)}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                        >
                          View Profile
                        </button>
                        {owner && edit && ownerId && (member._id || member).toString() !== ownerId.toString() && (
                          <button
                            onClick={() => removemember(member._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Remove member"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add member modal */}
        {showaddmodel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add Team Member</h2>
              <form onSubmit={addmembers} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter member's email"
                    value={formdata.email}
                    onChange={handlechange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setshowaddmodel(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
