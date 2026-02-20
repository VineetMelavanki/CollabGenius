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
     const[owner,setowner]=useState(null);
     const[project,setproject]=useState(null);
     const[members,setmembers]=useState([]);
     const[formdata,setformdata]=useState({
        email:"",
     });
    const token=localStorage.getItem("token");
    const addmembers=async(e)=>{
        e.preventDefault();
        seterror("");
        setmessage("");

        try{
           const response=await axios.post(`http://localhost:8000/api/Project/Add-members/${id}`,
            formdata,
            {
                headers:
                {
                    Authorization:`Bearer ${token}`,
                }
            }
           );
          setmessage(response?.data?.msg || "Added member successfully");
          const updatedProject=response?.data?.Project;
          setmembers(updatedProject.members || []);
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
                const response=await axios.delete(`http://localhost:8000/api/Project/delete/${id}`,
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
                const response=await axios.get(`http://localhost:8000/api/Project/get-project/${id}`,
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
     },[id,token]);
    return(
        <div className="min-h-full">
           
            {error &&<p className="text-red-100 font-mono text-lg">{error}</p>}
            
            {project && <div key={project._id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition px-4">
                 <div className="flex justify-between items-center gap-4">
                     <h1 className="font-bold text-black text-2xl mb-3">
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
                 <div className="bg-white flex rounded-xl w-full flex-col gap-3">
                    <div className="bg-white">
                       <h1 className="text-lg font-serif text-green-500">ADD MEMBERS</h1>
                    </div>
                   <form className="flex flex-col gap-3 justify-start items-start" onSubmit={addmembers}>
                     <input type="text"
                     name="email"
                     placeholder="Enter user email"
                     value={formdata.email}
                     onChange={handlechange}
                     
                     className="border border-4 border-red-500 w-80"/>
                     <button className="border border-2 w-80 " type="submit">ADD</button>
                   </form>
                 </div>
                 <div className="bg-white flex rounded-xl w-full flex-col gap-3">
                  <h1 className="bg-blue-400 text-lg mb-4">
                    Team members :
                  </h1>
                  {members.length===0 ? (
                    <h1 className="text-gray-500 text-md">No member found</h1>
                  ):(
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                     {members.map((member,index)=>(
                        <div key={member._id || member || index} className="bg-slate-200 flex flex-col gap-2 items-start justify-start p-4 rounded">
                            <h1 className="text-black text-lg mb-3">
                                Member Name : {member.name || 'Unknown'}
                            </h1>
                            <h1 className="text-black text-lg mb-3">
                               Member Email : {member.email || 'No email'}
                            </h1>
                            <h1 className="text-black text-sm mb-3">
                               Member Id : {member._id || member}
                            </h1>
                        </div>
                     ))
                     }
                    </div>
                  )}
                 </div>
                </div> 
            </div>} 
            </div>
    );
}
