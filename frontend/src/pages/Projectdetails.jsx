import React from "react";
import axios from "axios";
import { useState ,useEffect} from "react";
import { useParams,useNavigate } from "react-router-dom";
export default function Projectdetails()
{
    const {id}=useParams();
    const navigate=useNavigate();
     const[error,seterror]=useState("");
     const[message,setmessage]=useState("");
     const[project,setproject]=useState(null);
    const token=localStorage.getItem("token");
    const deleteproject=async()=>{
            seterror("");
            setmessage("");

            try{
                const response1=await axios.delete(`http://localhost:8000/api/project/delete/${id}`,
                    {
                        headers:{
                            Authorization:`Bearer ${token}`,
                        }
                    }
                );
                setmessage(response1.data?.msg || "Project deleted successfully");
                navigate("/getallprojects")
            }catch(error)
            {
                if(error.response1)
                {
                    seterror(error.response1?.data?.msg || "Cannot delete project");
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
                const response=await axios.get(`http://localhost:8000/api/Project/get-project/${id}`,
                    {
                        headers:{
                            Authorization:`Bearer ${token}`,
                        }
                    }
                );
                console.log("Required data is : ",response.data);
                setproject(response.data.projectdata);
                setmessage(response.data.msg || "Project fetched succcessfully");
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
     },[id,token]);
    return(
        <div className="min-h-full">
           
            {error &&<p className="text-red-100 font-mono text-lg">{error}</p>}
            {message&&<p className="text-green-500 font-mono text-lg">{message}</p>}
            {project && <div key={project._id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition px-4">
                 <div className="flex justify-between items-center gap-4">
                     <h1 className="font-bold text-black text-2xl mb-3">
                                     Project Details
                                 </h1>
                     <button onClick={deleteproject} className="text-red-500 font-bold border border-red-500 rounded-lg py-2 p-4">Delete</button>
                 </div>
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-medium text-gray-800">
                                   <span className="text-gray-400">Name :</span> {project.title}
                    </h2>
                    <h2 className="text-xl font-medium text-gray-800 mb-2">
                     <span className="text-gray-400">ownerId:</span> {project.ownerId}
                        </h2>    
                    <h1 className="text-xl font-medium text-gray-800 mb-2">
                      <span className="text-gray-400"> Project Status : </span><span className="text-green-500">{project.status}</span>
                        </h1>
                </div> 
            </div>} 
            </div>
    );
}