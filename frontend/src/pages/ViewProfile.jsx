import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPencilAlt, FaGithub, FaCode } from "react-icons/fa";
import Selectskills from "../Components/Profile/Selectskills";
import SelectDomain from "../Components/Profile/SelectDomain";
export default function ViewProfile() {
  const [error, seterror] = useState("");
  const [user, setuser] = useState(null);
  
  const [formdata, setformdata] = useState({
    name: "",
    Bio: "",
    skills:[],
    skillevel: "",
    github_link: "",
    domains:[],
  });
  const [edit, setedit] = useState(false);
  const[openskills,setopenskills]=useState(false);
  const[opendomains,setopendomains]=useState(false);
  const[selectedskills,setselectedskills]=useState([]);
  const[selecteddomains,setselecteddomains]=useState([]);
  const handlechange = (e) => {
    setformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleedit = async (e) => {
    e.preventDefault();
  
    try {

      const data=new FormData();
      data.append("name", formdata.name);
      data.append("Bio", formdata.Bio);
      data.append("skills", JSON.stringify(selectedskills));
      data.append("skillevel", formdata.skillevel);
      data.append("github_link", formdata.github_link);
      data.append("domains",JSON.stringify(selecteddomains));
      const response = await axios.post("http://localhost:8000/api/Profile/edit-profile", data, {
        withCredentials: true,
      });
      setuser(response.data.newprofile);
      setedit(false);
      alert("profile updated successfully");
    } catch (error) {
      if (error.response){
        console.log(error);
        alert(error.response?.data?.msg || "Cannot edit user profile");
      } else {
        alert("Internal server error");
      }
    }
  };

  useEffect(() => {
    if (user) {
      const skills=user.skills;
      const domains=user.domains;
      setformdata({
        name: user.name || "",
        Bio: user.Bio || "",
        skillevel: user.skillevel || "",
        skills: user.skills,
        github_link: user.github_link || "",
        domains:user.domains || "",
      });
      setselectedskills(skills);
      setselecteddomains(domains);
    }
  }, [user]);

  useEffect(() => {
    const showuser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/Profile/View-Profile", {
          withCredentials: true,
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(233,213,255,0.25),_rgba(255,255,255,0.95)_45%,_rgba(224,242,254,0.35))] px-4 py-8 sm:px-6 lg:px-8">
      {error && (
        <div className="mx-auto mb-6 max-w-6xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {!error && !user && (
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white/80 px-6 py-10 text-center text-lg font-medium text-slate-600 shadow-sm">
          Loading profile...
        </div>
      )}

      {user && (
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1.55fr]">
            <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.28)] backdrop-blur sm:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <img
                    src={user?.photo?.url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User")}
                    alt={user?.name}
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg sm:h-32 sm:w-32"
                  />
                  <div className="absolute bottom-1 right-1 rounded-full border border-white bg-emerald-500 p-1.5 shadow-sm" />
                </div>

                <div className="space-y-2 ">
                  <h2 className="text-2xl p-2 font-semibold text-slate-800">{user?.name}</h2>

                  <p className="text-sm leading-6 text-slate-600">
                    {user?.Bio || "A thoughtful collaborator building polished digital experiences."}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {user.skills.length > 0 ? (
                    user.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-500">
                      Skills coming soon
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.28)] backdrop-blur sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-smibold uppercase tracking-[0.26em] text-slate-500">Profile overview</p>
                  <h3 className="text-xl font-semibold text-slate-800">Professional details</h3>
                </div>
                {!edit ? (
                  <button
                    onClick={() => setedit(true)}
                    className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
                    aria-label="Edit profile"
                  >
                    <FaPencilAlt className="h-4 w-4" />
                  </button>
                ) : (
                  <button onClick={() => setedit(false)} className="text-sm font-semibold text-red-500 transition hover:text-red-600">
                    Cancel
                  </button>
                )}
              </div>

           

              {!edit ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,_rgba(248,250,252,0.95),_rgba(255,255,255,0.9))] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">About</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{user?.Bio || "No bio added yet."}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Experience level</p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">{user?.skillevel || "Not specified"}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">GitHub</p>
                      {user?.github_link ? (
                        <a
                          href={user.github_link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                        >
                          <FaGithub className="h-4 w-4" />
                          Open profile
                        </a>
                      ) : (
                        <p className="mt-2 text-sm text-slate-500">No GitHub link added</p>
                      )}
                    </div>
                  </div>

                  
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-center gap-2">
                      <FaCode className="h-4 w-4 text-purple-600" />
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Skills</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.skills.length > 0 ? (
                        user.skills.map((skill, index) => (
                          <span key={`${skill}-${index}`} className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">No skills listed yet.</span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-center gap-2">
                      <FaCode className="h-4 w-4 text-purple-600" />
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Domains</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.domains.length > 0 ? (
                        user.domains.map((domain, index) => (
                          <span key={`${domain}-${index}`} className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
                            {domain}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">No domains listed yet.</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleedit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formdata.name}
                      onChange={handlechange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Bio</label>
                    <textarea
                      name="Bio"
                      rows="3"
                      value={formdata.Bio}
                      onChange={handlechange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Skill level</label>
                      <select
                        name="skillevel"
                        value={formdata.skillevel}
                        onChange={handlechange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                      >
                        <option value="">Select level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">GitHub link</label>
                      <input
                        type="url"
                        name="github_link"
                        value={formdata.github_link}
                        onChange={handlechange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-row gap-2">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Skills</label>
                      <button type="button" onClick={()=>setopenskills(true)} className="text-lg text-red-500 font-bold">+</button>
                    </div>
                    {openskills && <Selectskills
                    onClose={()=>setopenskills(false)}
                    selectedskills={selectedskills}
                    setselectedskills={setselectedskills}
                    />}
                    <div className="flex flex-wrap gap-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-2">
                      {user.skills.length > 0 ? (
                        user.skills.map((skill, index) => (
                          <span key={`${skill}-${index}`} className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">No skills listed yet.</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-row gap-2">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Domains</label>
                        <button type="button" onClick={()=>setopendomains(true)} className="text-lg text-red-500 font-bold">+</button>     
                    </div>
                    {opendomains && <SelectDomain
                        onClose={()=>setopendomains(false)}
                        selecteddomain={selecteddomains}
                        setselecteddomain={setselecteddomains}/>}
                    <div className="flex flex-wrap gap-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-2">
                      {user.domains.length > 0 ? (
                        user.domains.map((domain, index) => (
                          <span key={`${domain}-${index}`} className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
                            {domain}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">No domains listed yet.</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
                  >
                    Save changes
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
