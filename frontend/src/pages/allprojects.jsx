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
    const[formdata,setformdata]=useState({
      title:"",
    });
    const handlechange=async(e)=>{
      e.preventDefault();
      setformdata((prev)=>({...prev, [e.target.name]:e.target.value}));
    }
    const clearformdata=async(e)=>{
      e.preventDefault();
      setformdata({title:""});
    }
    const handleSubmit=async(e)=>{
      e.preventDefault();
      seterror("");
      setmessage("");

      try{
         const response=await axios.get("http://localhost:8000/api/Project/get-project-by-title",
          {
            params:{title:formdata.title},
            withCredentials: true
          }
         );
         console.log("The title is :", console.log(formdata.title));
         setprojects(response.data.projectdata);
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
     const getallprojects= async ()=>{
            setmessage("");
            seterror("");
            try{
                const response=await axios.get("http://localhost:8000/api/Project/getallprojects",
                    {
                        withCredentials: true
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
    useEffect(()=>{
        getallprojects();
    },[]);
    useEffect(()=>{
      if(formdata.title==="")
      {
        getallprojects();
      }
    },[formdata.title]);
  return (
  <div className="min-h-full w-full p-6">

    <div className="flex flex-row gap-3">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        All Projects
      </h1>
      <form className="flex flex-row p-2 gap-4 mb-6" onSubmit={handleSubmit} >
        <input
        type="text"
        value={formdata.title}
        name="title"
        placeholder="Enter project title"
        onChange={handlechange}
        className="flex text-lg p-2 rounded-xl border border-blue-400"
        />
        <button className="text-red p-3 border rounded-xl border-red-300 hover:border-red-500" type="submit">Search</button>
         <button onClick={clearformdata} className="text-lg border text-black border-red-300 hover:border-red-500 rounded-lg px-5 py-2">
        Clear
      </button>
      </form>
     
    </div>
    
    {error && <p className="text-red-500 mb-4 ">{error}</p>}
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
              View Team →
            </button>
          </div>

        ))}

      </div>

    )}

  </div>
);
}