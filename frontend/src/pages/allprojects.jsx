import React from "react";
import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Allprojects()
{
  const navigate=useNavigate();
    const[message,setmessage]=useState("");
    const[error,seterror]=useState("");
    const[projects,setprojects]=useState([]);
    const[exclproject,setexclproject]=useState(false);
    const token=localStorage.getItem("token");
    const[formdata,setformdata]=useState({
      title:"",
    });
    const handlechange=async(e)=>{
      setformdata((prev)=>({...prev, [e.target.name]:e.target.value}));
    }
    const handleSubmit=async(e)=>{
      e.preventDefault();
      seterror("");
      setmessage("");
      
      try{
         const response=await axios.get("http://localhost:8000/api/Project/get-project-by-title",
          {
            params:formdata,
            headers:
            {
              Authorization:`Bearer ${token}`,
            }
          }
         );
         setprojects(response.data.ProjectData);
         setexclproject(true);
         setmessage(response.data.msg || "Project fetched successfully");
      }catch(error)
      {
           if(error.response)
           {
            seterror(error.response.data.msg || "Project cannot be fetched");
           }
           else
           {
            seterror("Internal server error");
           }
      }
    }
    useEffect(()=>{
        const getallprojects= async ()=>{
            
            setmessage("");
            seterror("");
            if(!token)
    {
        seterror("Please log in again");
    }
            try{
                const response=await axios.get("http://localhost:8000/api/Project/getallprojects",
                    {
                        headers:{
                            Authorization:`Bearer ${token}`,
                        }
                    }
                );
                console.log(message);
                 setprojects(response.data.projects);
                 setmessage(response.data.msg || "All projects fetched successfully");
            }catch(error)
           {
            if(error.response)
            {
                seterror(error.response?.data?.msg || "Unable to fetch projects");
            }
            else
            {
                seterror("Internal server error");
            }
           }
        };
        getallprojects();
    },[token]);

  return (
  <div className="min-h-full bg-slate-100 p-6">

    <div className="flex flex-row gap-3">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        All Projects
      </h1>
      <form className="flex flex-row p-2 gap-4" onSubmit={handleSubmit} >
        <input
        type="text"
        name="title"
        placeholder="Enter project title"
        value={formdata.title}
        onChange={handlechange}
        />
        <button type="submit">Search</button>
      </form>
    </div>

    {error && <p className="text-red-500 ">{error}</p>}
     {exclproject && projects.length === 0 ? (
      <p className="text-gray-500">No projects found</p>
    ) : (

      exclproject &&(<div className="grid gap-6 grid-cols-1 md:grid-cols-2  lg:grid-cols-3">

        {projects.map((project) => (

          <div
            key={project._id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {project.title}
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              {project.description || "No description"}
            </p>

            <button className="mt-4 text-purple-600 font-medium hover:underline"
            onClick={()=>navigate(`/get-project/${project._id}`)}>
              View Project →
            </button>
          </div>

        ))}

      </div>
      )
    )}
    {projects.length === 0 ? (
      <p className="text-gray-500">No projects found</p>
    ) : (

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2  lg:grid-cols-3">

        {projects.map((project) => (

          <div
            key={project._id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {project.title}
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              {project.description || "No description"}
            </p>

            <button className="mt-4 text-purple-600 font-medium hover:underline"
            onClick={()=>navigate(`/get-project/${project._id}`)}>
              View Project →
            </button>
          </div>

        ))}

      </div>

    )}

  </div>
);

}