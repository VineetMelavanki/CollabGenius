import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
export default function Research() {
  const { workId, projectId } = useParams();
  const [projectName, setprojectName] = useState(null);
  const [msg, setmsg] = useState("");
  const [error, seterror] = useState("");
  const[results,setresults]=useState([]);
  const[formdata,setformdata]=useState({
    topic:"",
  });
  const[repolist,setrepolist]=useState([]);
  const[gitinfo,setgetinfo]=useState({
    name:"",
    description:"",
    private:false,
  });
  const handlegitinfo=(e)=>{
    setgetinfo((prev)=>({...prev,[e.target.name]:e.target.value}));
  }
  
  useEffect(()=>{
     const getallRepo=async()=>{
        seterror("");
        setmsg("");
        try{
          const response=await axios.get(`http://localhost:8000/api/User/github/get-repo/${projectId}/${workId}`,
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
  },[workId,projectId])
  const handlereposubmit=async(e)=>{
    e.preventDefault();
    seterror("");
    setmsg("");
    try{
        const response=await axios.post(`http://localhost:8000/api/User/github/create-repo/${projectId}/${workId}`,gitinfo,
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
  const[repooption,setrepooption]=useState(false);
  const[researchhub,setresearchhub]=useState(false);
  useEffect(() => {
    
    const getproject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/Work/get-WORK/${workId}`,
          {
            withCredentials: true
          }
        );
        setprojectName(response.data.Project);
      } catch (error) {
        if (error.response) {
          seterror(error.response?.data?.msg || "Cannot get project details");
        } else {
          seterror("Internal server error");
        }
      }
    };
    getproject();
  }, [workId]);
  const researchsubmit=(e)=>{
    setformdata((prev)=>({...prev,[e.target.name]:e.target.value}))
  }
  const handleSearch=async(e)=>{
    e.preventDefault();
    setmsg("");
    seterror("");
    try{
      const response=await axios.get("http://localhost:8000/api/research/search-topic",
        {
          params:{topic:formdata.topic},
          withCredentials: true
        }
      );
      console.log(response);
      setresults(response.data.results);
      setmsg(response.data.msg);
    }catch(error)
    {
      if(error.response)
      {
        seterror(error.response.data.msg || "Cannot fetch Research Papers");
      }
      else
      {
        seterror("Internal server error");
      }
    }
  }
  return (
    <div className="flex w-full  rounded-2xl">
       {repooption && 
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
      {researchhub && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40"
            onClick={()=>{setresearchhub(false);setresults([])}}>
            </div>
             <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-y-auto"
             onClick={(e)=>e.stopPropagation()}>
              <div className="flex flex-col gap-3">
                <div>
                  <h1 className="p-5 font-bold text-2xl">Research Hub</h1>
                </div>
                <div className="flex p-4 justify-center items-center">
                  <form onSubmit={handleSearch} className="flex flex-col gap-3">
                   <input type="text"
                   name="topic"
                   placeholder="Search research papers"
                   onChange={researchsubmit}
                  className="w-full border border-blue-200 border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                   <button type="submit" className="text-white bg-blue-500 font-bold p-3 rounded-xl hover:bg-blue-600">Search</button>
                  </form>
                </div>
                {results.length===0 ? (
                  <h1 className="text-md text-gray-400 ">No results found</h1>
                ):(
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                     {results.map((result,index)=>(
                        <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                         <h2 className="text-md font-semibold text-gray-800">
                            Title : {result.title}
                         </h2>
                         <h3 className="text-sm font-semibold text-gray-600">{result.summary}</h3>
                         <a href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 mt-4 inline-flex items-center gap-2 font-semibold ">
                            Open Paper
                        </a>
                        </div>
                     ))}
                  </div>
                )}
              </div>
               </div>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <div className="flex bg-gray-100 flex-col  gap-3 rounded-2xl">
           <div className="flex flex-row items-start  gap-4 p-2">
            <h1 className="text-2xl sm:text-md md:text-2xl lg:text-2xl text-white bg-blue-400 font-bold p-2 rounded-xl">Research Panel</h1>
        
           <div className="flex flex-row">
              <h1 className="text-2xl sm:text-md md:text-2xl lg:text-2xl text-black   font-bold p-2 rounded-xl">Project Name:</h1>
              <h1 className="text-2xl sm:text-md md:text-2xl lg:text-2xl text-green-500 font-bold p-2">{projectName?.name}</h1>
              <button onClick={()=>setresearchhub(!researchhub)} className="text-lg font-bold mx-5 text-white border bg-purple-400 p-3 rounded-2xl  hover:bg-purple-500">Research HUB</button>
           </div>
            
           </div>
           
        </div>
        <div className="flex bg-gray-100 flex-col gap-3 rounded-2xl">
         <div className="flex flex-row gap-3">
           <h1 className="flex items-start justify-start p-4 font-bold text-2xl">Workspace</h1>
           <div className="flex items-center justify-center">
            <button onClick={()=>setrepooption(true)} className="text-sm font-bold text-white bg-red-500 rounded-2xl p-2 hover:bg-red-600">Create github Repo</button>
            </div>
         </div>
         
        </div>
         <div className="flex bg-gray-100 flex-col gap-3 w-full h-full rounded-2xl">
          <div className="flex flex-col gap-2 p-3">
            <h1 className="text-lg p-3 font-mono">GITHUB repositories </h1>
            {repolist.length===0 ?(
            <div className="text-red-200 font-mono text-lg">No respositories created</div>
          ) :(
            <div className="grid grid-col-1 gap-3">
              {repolist.map((repo)=>(
                <div key={repo._id}  className="flex flex-col  bg-white p-4 rounded-xl shadow hover:-translate-y-1 transition-all duration-200">
                      <div className="flex flex-row ">
                        <h1 className="text-blue-500 font-bold">{repo.name}</h1>
                         
                        <div className="flex flex-1 justify-end mx-4">
                          <a href={repo.repourl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 mt-4 inline-flex items-center gap-2 font-semibold " >
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
      </div>
    </div>
  );
}