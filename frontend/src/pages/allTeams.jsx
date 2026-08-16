import React from "react";
import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function AllTeams()
{
  const navigate=useNavigate();
    const[message,setmessage]=useState("");
    const[error,seterror]=useState("");
    const[Teams,setTeams]=useState([]);
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
         const response=await axios.get("http://localhost:8000/api/Team/get-Team-by-title",
          {
            params:{title:formdata.title},
            withCredentials: true
          }
         );
         console.log("The title is :", console.log(formdata.title));
         setTeams(response.data.projectdata);
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
     const getallTeams= async ()=>{
            setmessage("");
            seterror("");
            try{
                const response=await axios.get("http://localhost:8000/api/Team/getallTeams",
                    {
                        withCredentials: true
                    }
                );
                console.log(message);
                 setTeams(response.data.Teams);
                 setmessage(response.data.msg || "All Teams fetched successfully");
            }catch(error)
           {
            if(error.response)
            {
                seterror(error.response?.data?.msg || "Unable to fetch Teams");
            }
            else
            {
                seterror("Internal server error");
            }
           }
        };
    useEffect(()=>{
        getallTeams();
    },[]);
    useEffect(()=>{
      if(formdata.title==="")
      {
        getallTeams();
      }
    },[formdata.title]);
  return (
  <div className="min-h-full bg-purple-100 w-full p-6">

    <div className="flex flex-row sm:max-w-sm md:max-w-lg lg:max-w-full border gap-3">
      <h1 className="text-2xl font-bold mb-6 sm:text-sm md:text-md lg:text-lg text-gray-800 my-4">
        All Teams
      </h1> 
      <form className="flex flex-row p-2 gap-4 mb-6 sm:text-sm" onSubmit={handleSubmit} >
        <input
        type="text"
        value={formdata.title}
        name="title"
        placeholder="Enter project title"
        onChange={handlechange}
        className="flex text-lg p-2 rounded-xl border border-blue-400"
        />
        <button className="text-red p-3 border rounded-xl text-white bg-green-500 hover:bg-green-600 font-bold" type="submit">Search</button>
         <button  onClick={clearformdata} className=" sm:text-sm lg:text-lg text-white bg-red-500 hover:border-red-600 rounded-lg px-5 py-2 font-bold">
        Clear
      </button>
      </form>
     
    </div>
    
    {error && <p className="text-red-500 mb-4 ">{error}</p>}
    {Teams.length === 0 ? (
      <p className="text-gray-500">No Teams found</p>
    ) : (

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3">

        {Teams.map((team) => (
 
          <div
            key={team._id}
            className="bg-white p-6 rounded-xl sm:max-w-sm shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {team.title}
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              {team.description || "No description"}
            </p>

            <button className="mt-4 text-purple-600 font-medium hover:underline"
            onClick={()=>navigate(`/get-Team/${team._id}`)}>
              View Team →
            </button>
          </div>

        ))}

      </div>

    )}

  </div>
);
}