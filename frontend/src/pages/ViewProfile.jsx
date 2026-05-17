import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ViewProfile() {
  const [error, seterror] = useState("");
  const [user, setuser] = useState(null);
  const[msg,setmsg]=useState("");
  const[error1,seterror1]=useState("");
  const[formdata,setformdata]=useState({
    name:"",
    Bio:"",
    skills:"",
    skillevel:"",
    github_link:"",
  });
  const[edit,setedit]=useState(false);
  const handlechange=async(e)=>{
    setformdata((prev)=>({...prev,[e.target.name]:e.target.value}));
  }
  const handleedit=async(e)=>{
    e.preventDefault();
    seterror1("");
    setmsg("");
    console.log("Sending data : ",formdata);
    try{
     const response=await axios.post("http://localhost:8000/api/Profile/edit-profile",formdata,
      {
        withCredentials: true
      }
     );
     setuser(response.data.newprofile);
     setedit(false);
    }catch(error)
    {
        if(error.response)
        {
          seterror1(error.response?.data?.msg || "Cannot edit user profile");
        }else
        {
          seterror1("Internal server error");
        }
    }
  }
  useEffect(()=>{
     if(user)
        {
          setformdata({
            name:user.name,
            Bio:user.Bio,
            skillevel:user.skillevel,
            skills:user.skills,
            github_link:user.github_link,
          })
        }
  },[user])
  useEffect(() => {
    const showuser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/Profile/View-Profile", {
          withCredentials: true
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
              <div className="flex flex-row justify-between gap-3">
               <h3 className="text-3xl font-bold text-gray-800 mb-6">Profile Details</h3>
            {!edit &&    <button onClick={()=>setedit(!edit)} className="text-red-500 border border-red-500 p-4 px-6 rounded-2xl font-bold hover:bg-red-100">
                Edit
               </button>}
             {edit && <button onClick={()=>setedit(!edit)} className="text-red-500 border border-red-500p-4 px-6 rounded-2xl font-bold hover:bg-red-100">
              Cancel
              </button>}  
              </div>

            {!edit && <div className="space-y-6">
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

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">GitHub </label>
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
              </div>}
              {edit && <div className="space y-6">
                <form onSubmit={handleedit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Name</label>
                  <input type="text"
                  value={formdata.name}
                  name="name"
                  onChange={handlechange}
                  className="text-lg text-gray-800 mt-1 border border-blue-300 rounded-xl "/>
                  
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Bio</label>
                    <input type="text"
                    value={formdata.Bio}
                    name="Bio"
                    onChange={handlechange}
                    className="text-lg text-gray-800 mt-1 border border-blue-300 rounded-xl " />
                  </div>
                  <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Skills</label>
                   <input type="text" name="skills"
                   value={formdata.skills}
                   onChange={handlechange}
                   className="text-lg text-gray-800 mt-1 border border-blue-300 rounded-xl " />
                  </div>
                  <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Skill Level</label>
                   <input type="text"
                   name="skillevel"
                   value={formdata.skillevel}
                   onChange={handlechange}
                   className="text-lg text-gray-800 mt-1 border border-blue-300 rounded-xl "/>
                  </div>
                  <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">GitHub </label>
                   <input type="url"
                     name="github_link"
                     value={formdata.github_link}
                     onChange={handlechange}
                     className="text-lg text-gray-800 mt-1 border border-blue-300 rounded-xl "
                    />
                  </div>
                  <button type="submit" className="text-red-400 border border-red-400 rounded-3xl hover:bg-red-100 mt-10">
                  Apply changes
                  </button>
                </form>
                </div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
