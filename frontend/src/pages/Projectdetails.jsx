import React from "react";
import axios from "axios";
import { useState ,useEffect} from "react";
import { useParams,useNavigate } from "react-router-dom";
import {FaTrash} from "react-icons/fa";

export default function Projectdetails()
{
    const {projectId}=useParams();
    const navigate=useNavigate();
     const[error,seterror]=useState("");
     const[message,setmessage]=useState("");
     const[owner,setowner]=useState(null);
     const[ownerId,setownerId]=useState(null);
     const[project,setproject]=useState(null);
     const[members,setmembers]=useState([]);
     const[showaddmodel,setshowaddmodel]=useState(false);
     const[formdata,setformdata]=useState({
        email:"",
     });
    
     const[edit,setedit]=useState(false);
    const token=localStorage.getItem("token");
    const removemember=async(memberId)=>{
        seterror("");
        setmessage("");

        try{
          const response=await axios.delete(`http://localhost:8000/api/Project/remove-member/${projectId}/${memberId}`,
            {
                headers:
                {
                    Authorization:`Bearer ${token}`,
                }
            }
          );
          setmembers(prev =>prev.filter(m=>m._id!==memberId));
          setmessage(response.data.msg || "Member removed successfully");
        }catch(error)
        {
             if(error.response)
             {
                seterror(error.response.data.msg || "cannot remove member");
             }
             else
             {
                seterror("Internal server error");
             }
        }
    }
    const addmembers=async(e)=>{
        e.preventDefault();
        seterror("");
        setmessage("");

        try{
           const response=await axios.post(`http://localhost:8000/api/Project/Add-members/${projectId}`,
            formdata,
            {
                headers:
                {
                    Authorization:`Bearer ${token}`,
                }
            }
           );
           console.log(message);
          setmessage(response?.data?.msg || "Added member successfully");
          if(response.data.success)
          {
            const refreshed=await axios.get(`http://localhost:8000/api/Project/get-project/${projectId}`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                }
            );
            setmembers(refreshed.data.projectdata.members || []);
          }
         
          setformdata({email:""});
        }catch(error)
        {
              if(error.response)
              {
                seterror(error.response.data.msg || "Cannot add member");
              }
              else
              {
                seterror("Internal server error");
              }
        }
    }
    const handlechange=(e)=>{
     setformdata((prev)=>({...prev,[e.target.name]:e.target.value}));
    }
    const deleteproject=async()=>{
            seterror("");
            setmessage("");

            try{
                const response=await axios.delete(`http://localhost:8000/api/Project/delete/${projectId}`,
                    {
                        headers:{
                            Authorization:`Bearer ${token}`,
                        }
                    }
                );
                setmessage(response.data?.msg || "Project deleted successfully");
                navigate("/getallprojects")
            }catch(error)
            {
                if(error.response)
                {
                    seterror(error.response?.data?.msg || "Cannot delete project");
                }else
                {
                    seterror("Internal server error");
                }
            }
        }  
     useEffect(()=>{
        const displayproject=async()=>{
            seterror("");
        setmessage("");
            try{
                const response=await axios.get(`http://localhost:8000/api/Project/get-project/${projectId}`,
                    {
                        headers:{
                            Authorization:`Bearer ${token}`,
                        }
                    }
                );
                const response1=await axios.get("http://localhost:8000/api/Profile/View-Profile",
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );
                const ProfileData=response1.data.Profile;
                const user=ProfileData.userId;
                const projectData=response.data.projectdata;
                setproject(projectData);
                setmessage(response.data.msg || "Project fetched succcessfully");
                
                // Handle members - they are now populated objects with name and email
                const membersList = projectData.members || [];
                setmembers(membersList);
                setownerId(typeof projectData.ownerId === "object"
    ? projectData.ownerId._id
    : projectData.ownerId);
                // Handle owner comparison - ownerId might be populated object or string
                const ownerId = typeof projectData.ownerId === 'object' 
                    ? (projectData.ownerId._id || projectData.ownerId)
                    : projectData.ownerId;
                
                if(ownerId && (ownerId.toString() === user.toString() || ownerId === user))
                {
                    setowner(true);
                }
                else
                {
                    setowner(false);
                }
            }
         catch(error)
        { 
           if(error.response)
           {
            seterror(error.response?.data?.msg || "Cannot fetch project");
           }
           else
           {
            seterror("Internal server error");
           }
        }
        
    }
    
        displayproject();
     },[projectId,token]);
    return(
        <div className="min-h-full">
           
            {error &&<p className="text-red-100 font-mono text-lg">{error}</p>}
            
            {project && <div key={project._id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition px-4">
                 <div className="flex justify-between flex-1 items-center gap-4">
                     <h1 className="font-bold  text-black text-2xl mb-3">
                                     Project Details
                                 </h1>
        {owner &&  <button  onClick={deleteproject} className="text-red-500 font-bold border border-red-500 rounded-lg py-2 p-4">Delete</button>}  
                 </div>
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-medium text-gray-800">
                                   <span className="text-gray-400">Name :</span> {project.title}
                    </h2>
                    <h2 className="text-xl font-medium text-gray-800 mb-2">
                     <span className="text-gray-400">ownerId:</span> {typeof project.ownerId === 'object' ? project.ownerId.name || project.ownerId._id : project.ownerId}
                        </h2>    
                    <h1 className="text-xl font-medium text-gray-800 mb-2">
                      <span className="text-gray-400"> Project Status : </span><span className="text-green-500">{project.status}</span>
                        </h1>
                 
                 <div className="bg-white flex rounded-xl w-full flex-col ">
                  <div className="flex flex-row justify-between gap-3">
                      <h1 className=" text-lg mb-4 mt-5 font-serif text-red-500">
                        TEAM MEMBERS :
                      </h1>
                   <div>
                    <div className="flex-1 items-center justify-center">
                       
                    </div>
                 {owner  && <button className="bg-white text-blue-400 border-blue-500 hover:bg-blue-100 transition border border-blue-300 p-4 py-2 rounded-lg" onClick={()=>setshowaddmodel(true)}>
                        Add
                       </button> }
                      {owner && showaddmodel && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
   <div className="bg-white p-6 rounded-xl shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Add Team Member</h2>
     <form onSubmit={addmembers} className="flex flex-col gap-3">
       <input
          type="text"
          name="email"
          placeholder="Enter user email"
          value={formdata.email}
          onChange={handlechange}
          className="border border-blue-500 rounded-xl w-full p-2"
        />
        <button className="border border-blue-500 rounded w-full p-2 bg-blue-100" type="submit">
          Add
        </button>
       <button
          type="button"
          className="mt-2 text-red-400"
          onClick={() => setshowaddmodel(false)}
        >
         Cancel
        </button>
      </form>
   </div>
  </div>
)}
                       {owner  && <button onClick={()=>setedit(!edit)} className="p-4 mx-4 my-4 rounded-full hover:bg-blue-100 transition">
                         <svg
                           className="w-5 h-5 text-blue-600"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                         >
                           <path
                             strokeLinecap="round"
                             strokeLinejoin="round"
                             strokeWidth={2}
                             d="M15.232 5.232l3.536 3.536M9 11l6.364-6.364a2 2 0 112.828 2.828L11.828 13.828a4 4 0 01-1.414.943L7 16l1.229-3.414A4 4 0 019 11z"
                           />
                         </svg>
                       </button>}
                      
                   </div>
                  </div>
                  
                  {!edit && members.length===0 ? (
                    <h1 className="text-gray-500 text-md">No member found</h1>
                  ):(
                    !edit && (
                        <div className="grid grid-cols-1">
                     {members.map((member,index)=>(
                        <div key={member._id || member || index} className=" bg-gray-50 flex flex-row justify-between gap-2 items-start mb-2 p-4 rounded w-full border border-black">
                            <h1 className="text-black text-lg mb-3">
                                Member Name : {member.name || 'Unknown'}
                            </h1>
                            <button className="text-blue font-serif border border-blue-400 border-2 p-3" onClick={()=>navigate(`/view-profile/${member._id}`)}>View Profile</button>
                        </div>
                     ))
                     }
                    </div>
                    ) 
                  )}
                 </div>
                 {edit && members.length===0 ? (
                    <h1 className="text-gray-500 text-md">No member found</h1>
                  ):(
                    edit && (
                     <div className="grid grid-cols-1">
                     {members.map((member,index)=>(
                        <div key={member._id || member || index} className=" bg-gray-50 flex flex-row justify-between gap-2 items-start  p-4  mb-2 rounded w-full border border-black">
                            <h1 className="text-black text-lg mb-3">
                                Member Name : {member.name || 'Unknown'}
                            </h1>
                        {owner && ownerId!==member._id  &&<button  className="p-2 text-red-500 hover:bg-red-100 rounded-lg" onClick={()=>{removemember(member._id);setedit(!edit)}}><FaTrash/></button> }    
                        </div>
                     ))
                     }
                    </div>
                    )
                    
                  )}
                </div> 
            </div>} 
            </div>
    );
}
