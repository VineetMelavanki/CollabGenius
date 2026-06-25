import React from "react";
import { useState } from "react";
import axios from "axios";
import { MagnifyingGlassIcon,XMarkIcon } from "@heroicons/react/24/outline";
import githublogo from "../assets/logos/github.png"
import arxivlogo from "../assets/logos/arxiv.png"
const sources=[
    {
        name:"github",
        logo:githublogo,
    },
    {
        name:"arxiv",
        logo:arxivlogo,
    },
];
export default function ResearchSearchBar({projectId,workId,onClose}){
    const[selectedResources,setselectedResources]=useState(sources[0]);
 
  const [showResources,setshowResources] = useState(false);
    const[githubresults,setgithubresults]=useState([]);
    const[results,setresults]=useState([]);
    const[formdata,setformdata]=useState({
        topic:"",
      });
    const researchsubmit=(e)=>{
    setformdata((prev)=>({...prev,[e.target.name]:e.target.value}))
  }
  
  const handleSearch=async(e)=>{
    e.preventDefault();
    if(selectedResources.name==="arxiv")
    {
      await searcharxiv();
    }
    if(selectedResources.name==="github")
    {
      await searchgithub();
    }
  }
   const searcharxiv=async()=>{
    setgithubresults([]);
    setresults([]);
  
    try{
      const response=await axios.get("http://localhost:8000/api/research/search-topic",
        {
          params:{topic:formdata.topic},
          withCredentials: true
        }
      );
      console.log(response);
      setresults(response.data.results);
   
    }catch(error)
    {
      if(error.response)
      {
        alert(error.response.data.msg || "Cannot fetch Research Papers");
      }
      else
      {
        alert("Internal server error");
      }
    }
  }
  const searchgithub=async()=>{
    setgithubresults([]);
    setresults([]);
    
      try{
        const response=await axios.get("http://localhost:8000/api/research/github-search",
          {
            params:{topic:formdata.topic},
            withCredentials:true,
          },
        );
        console.log(response);
        setgithubresults(response.data.repositories);

      }catch(error)
      {
              if(error.response)
              {
                alert(error.response?.data?.msg || "Cannot fetch github repositories");
              }
              else
              {
                alert("Internal server error");
              }
      }
  }
     const saveGithubRepo=async(repo)=>{
    try{
         const response=await axios.post(`http://localhost:8000/api/research/save-github-repo/${projectId}/${workId}`,
          {
            name:repo.name,
            html_url:repo.html_url,
          },{
            withCredentials:true,
          }
      );
      alert("Saved successfully");
    }catch(error)
    {
       if(error.response)
       {
        alert("Cannot be saved")
        
       }
       else
       {
        alert("Internal server error");
  
       }
    }
  }
   return(
    <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40"
            onClick={()=>{setresults([]);setgithubresults([]);onClose();}}>
            </div>
             <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-y-auto"
             onClick={(e)=>e.stopPropagation()}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-3">
                  <h1 className="p-5 font-bold text-2xl">Research Hub</h1>
                  <div className="flex flex-1 justify-end items-center mx-7">
                    <button className="text-lg font-bold text-red-500 hover:text-red-600"  onClick={()=>{setresults([]);setgithubresults([]);onClose()}}>X</button>
                  </div>
                </div>
                <div className="flex p-4 justify-center items-center">
                  <form onSubmit={handleSearch} className="flex flex-col gap-3">
                   <div className="flex flex-row gap-3">
                     <div className="relative w-full flex flex-row gap-3">
                       <input type="text"
                       name="topic"
                       placeholder={selectedResources.name==="github" ?"Search github repositories" : "search research papers"}
                       onChange={researchsubmit}
                        className="w-full border border-blue-200 border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                       <button className="hover:bg-gray-100 rounded-2xl p-2" type="button" onClick={()=>setshowResources(!showResources)}>
                       <img src={selectedResources.logo} alt={selectedResources.name} className="w-8 h-8 rounded-full"/>
                       </button>
                       {showResources && (
                      <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl border z-50">
                         {sources.map((source)=>(
                          <div key={source.name}
                          onClick={()=>{setselectedResources(source);setshowResources(false)}}
                          className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer">
                          <img src={source.logo} alt={source.name} 
                          className="w-8 h-8 object-contain"/>

                          <span>{source.name}</span>
                          </div>
                         ))}
                      </div>
                     )}
                     </div>
                     
                   </div>
                   <button type="submit" className="text-white  bg-blue-500 font-bold p-3 rounded-xl hover:bg-blue-600 ">Search</button>
                  </form>
                </div>
                {results.length> 0 && (
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
                {githubresults.length>0 && (
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                     {githubresults.map((result,index)=>(
                      <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                           <h2 className="text-md font-semibold text-gray-800">
                            Repository name :{result.name}
                           </h2>
                            <h3 className="text-sm font-semibold text-gray-600">{result.description}

                            </h3>
                            <a href={result.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 mt-4 inline-flex items-center gap-2 font-semibold ">
                            Open Repository
                        </a>
                       <button onClick={()=>saveGithubRepo(result)} className="mx-6 text-md text-red-500 hover:text-red-600">Save</button>
                      </div>
                     ))}
                  </div>
                )}
               
              </div>
               </div>
        </div>
   )
}