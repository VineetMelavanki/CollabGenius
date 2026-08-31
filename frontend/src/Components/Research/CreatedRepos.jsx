import React from "react";
import axios from "axios";
import { useState ,useEffect } from "react";
import { PlusIcon,UserPlus } from "lucide-react";
import githublogo from "../../assets/logos/github.png"
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../AuthContext";
export default function CreatedRepos({TeamId,workId,Leader}){
    const[repolist,setrepolist]=useState([]);
    const {user}=useAuth();
    const[gitinfo,setgetinfo]=useState({
         name:"",
         description:"",
         private:false,
       });
    const userId=user?._id;
    const[githubaccess,setgithubaccess]=useState(false);
    const[allmembers,setallmembers]=useState([]);
    const[opencontributors,setopencontributors]=useState(false);
    const[repooption,setrepooption]=useState(false);
    const [msg, setmsg] = useState("");
    const [error, seterror] = useState("");
    const[currentrepo,setcurrentrepo]=useState(null); 

    useEffect(()=>{
       if(!userId)
      {
        return;
      }
      const verifygithub=async()=>{
        console.log("The userId is : ",userId);
        try{
           const response=await axios.get(`http://localhost:8000/api/User/github/verify-access-token/${userId}`,{
            withCredentials:true,
           });
  
           setgithubaccess(response.data?.hasaccount);
        }catch(error)
        {
            if(error.response)
            {
              alert(error.response?.data?.msg || "Cannot verify github account");
            }
            else
            {
              alert("Internal server error");
            }
        }
      }
      verifygithub();
    },[userId])
    useEffect(()=>{
     const getallRepo=async()=>{
        seterror("");
        setmsg("");
        try{
          const response=await axios.get(`http://localhost:8000/api/User/github/get-repo/${TeamId}/${workId}`,
            {
              withCredentials:true,
            }
          );
          setrepolist(response.data.allrepo);
         
        }catch(error)
        {
           if(error.response)
           {
            seterror(error.response?.data?.msg || "Cannot fetch repositories");
           }
           else
           {
            seterror("Internal server error");
           }
        }
     }
     getallRepo();
  },[workId,TeamId])

 const handleConnectGithub = () => {
  window.location.href ="http://localhost:8000/api/User/github/connect-github";
};
   //ADD contributors
   
   const addcontributors=async(repoOwner,repoName,collaboratorUserName)=>{
    try{
      const response=await axios.post(`http://localhost:8000/api/github/add-contributor/${repoOwner}/${repoName}/${collaboratorUserName}`,{},
        {
          withCredentials:true,
        }
      );
      alert(response?.data?.msg);
    }catch(error)
    {
      if(error.response)
      {
          alert("Cannot send request");
      }
      else
      {
        alert("Internal server error");
      }
    }
   }
   const getallmembers=async()=>{
    try{
        const response=await axios.get(`http://localhost:8000/api/Team/all-members/${TeamId}`,{
          withCredentials:true,
        });
        setallmembers(response.data.members);
     
    }catch(error)
    {
        if(error.response)
        {
          alert("Unable to fetch members");
        }
        else
        {
          alert("Internal server error");
        }
    }
  }
  const handlereposubmit=async(e)=>{
    e.preventDefault();
    seterror("");
    setmsg("");
    try{
        const response=await axios.post(`http://localhost:8000/api/User/github/create-repo/${TeamId}/${workId}`,gitinfo,
          {
            withCredentials:true,
          }
        );
       setrepolist((prev)=>[...prev,response.data.repo]);
       setmsg(response.data?.msg || "Github repository created successfully");
    }catch(error)
    {
        if(error.response)
        {
          seterror(error.response?.data?.msg || "Cannot create github Repo");
        }
    }
  }
    const handlegitinfo=(e)=>{
          setgetinfo((prev)=>({...prev,[e.target.name]:e.target.value}));
        }
    
    return(
        <div className="flex bg-gray-100 flex-col gap-3 w-full h-full rounded-2xl">
          {opencontributors &&  
           <div onClick={()=>setopencontributors(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8" onClick={(e)=>e.stopPropagation()}>
              <div className="flex flex-col gap-3 justify-center items-center ">
                <div className="flex flex-col items-center justify-center font-grotesk w-full">
                    <h1 className="text-lg text-white bg-red-500 rounded-xl p-2 font-bold mb-6">Select contributors</h1>
                     <div className="flex flex-col gap-2 w-full">
                       {allmembers.length > 0 && (
                        <div className="flex flex-col bg-gray-50 border p-2 gap-2 overflow-y-auto">
                          {allmembers.map((member)=>{
                            const repoId=currentrepo;
                            return(
                              <div key={member._id} onClick={()=>addcontributors(repoId?.createdby,repoId?.name,member?.name)}  className="flex bg-blue-100 cursor-pointer flex-row items-center gap-3 rounded-xl p-3 transition hover:bg-blue-200">
                                <img src={member.photo?.url} className="h-8 w-8 rounded-full object-cover" alt={member.name}/>
                                <h1 className="text-lg font-playfair">{member?.name}</h1>
                              </div>
                            );
                          })}
                        </div>
                       )}
                     </div>
                </div>
              </div>
             </div>
            </div>}
            {repooption && githubaccess &&
           <div onClick={()=>setrepooption(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
               onClick={(e) => e.stopPropagation()}>
                 
                <div className="flex flex-col gap-3 justify-center items-center">
                  <div className="flex items-center justify-center font-mono ">
                      <h1 className="text-lg">Create your own github repo</h1>
                  </div>
                  {msg && <p className=" text-green-600 font-mono text-md">{msg}</p>}
            {error && <p className=" text-red-600 font-mono text-md">{error}</p>}
                  <form onSubmit={handlereposubmit} className="flex flex-col gap-3">
                    <input type="text"
                    name="name"
                    value={gitinfo.name}
                    placeholder="Enter repository name"
                    onChange={handlegitinfo}
                    className="text-md font-bold  border-purple-300 border-2 hover:border-purple-600 p-3 rounded-2xl"
                    />
                    <input type="text"
                    name="description"
                    value={gitinfo.description}
                    placeholder="Enter description"
                    onChange={handlegitinfo}
                    className="text-md font-bold  border-purple-300 border-2 hover:border-purple-600 p-3 rounded-2xl"/>
                    <button type="button" onClick={()=>setgetinfo((prev)=>({...prev,private:!prev.private}))}
                      className={`text-white font-bold rounded-2xl p-3 transition-all duration-300 ${gitinfo.private ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
                        {gitinfo.private ? "Change to public": "Change to private"}
                      </button>
                    <button disabled={!gitinfo.name.trim() || !gitinfo.description.trim()} type="submit" className="font-bold text-white bg-red-500 hover:bg-red-600 text-xl rounded-xl p-3">Create</button>
                  </form>
                </div>
              </div>
            </div>}

            {repooption && !githubaccess && (
              <div onClick={()=>setrepooption(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-black rounded-2xl shadow-xl w-full max-w-md p-8"
               onClick={(e) => e.stopPropagation()}>
                   <div className="flex flex-col gap-5 justify-center items-center b text-white ">
                      <h1 className="text-lg p-2 font-grotesk">Connect GitHub to create a repository</h1>
                      <div className="flex flex-1 justify-center items-center gap-2 p-2 w-full">
                         <div className="flex flex-row rounded">
                               <img src={githublogo} alt="github" className="w-12 h-12" />
                               <button onClick={handleConnectGithub} className="bg-white text-black p-3 font-semibold rou ">CONNECT github</button>
                            <div className="flex justify-end items-center mx-8 border px-4">
                                <button>Not now</button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
                  <div className="flex flex-col gap-2 p-3">
                    <div className="flex flex-row gap-3">
                      <h1 className="text-lg p-3 font-mono">GITHUB repositories </h1>
                      <div className="flex flex-1 justify-end">
                      {Leader && 
                        <button onClick={()=>setrepooption(true)} className="text-sm font-bold text-red-500   rounded-2xl p-2 hover:text-red-600">
                          <PlusIcon className="text-red h-6 w-6"/>
                        </button>}  
                      </div>
                    </div>
                    {repolist.length===0 ?(
                    <div className="text-red-200 font-mono text-lg">No respositories created</div>
                  ) :(
                    <div className="grid grid-col-1 gap-3">
                      {repolist.map((repo)=>(
                        <div key={repo._id}  className="flex flex-col  bg-white p-4 rounded-xl shadow hover:-translate-y-1 transition-all duration-200">
                              <div className="flex flex-row  gap-3 ">
                                <h1 className="text-blue-500 font-bold">{repo.name}</h1>
                                  <div className="flex flex-1 justify-end gap-2 ">
                                    <UserPlus onClick={()=>{setopencontributors(true);setcurrentrepo(repo);getallmembers()}} className="w-5 h-5 mx-2 my-1 text-red-500 hover:bg-red-100 rounded-2xl"/>
                                    <a href={repo.repourl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex text-blue-500 hover:bg-blue-50 px-2">
                                      View
                                    </a>
                                  </div>
                              </div>
                              <p className="text-md font-thin">{repo.description}</p>
                        </div>
                      ))}
                    </div>
                  )
                  }
                  </div>     
                 </div>
    )
}