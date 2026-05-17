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
  })
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
    <div className="flex w-full   rounded-2xl">
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
         </div>
         
        </div>
         
      </div>
     
    </div>
  );
}