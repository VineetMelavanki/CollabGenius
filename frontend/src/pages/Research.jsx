import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { NotebookPen ,UserRound ,ChevronUp,ChevronDown} from "lucide-react";
import { MagnifyingGlassIcon,FolderOpenIcon ,PlusIcon ,ChatBubbleOvalLeftIcon,ChevronDoubleDownIcon,ChevronDoubleUpIcon} from "@heroicons/react/24/outline";
import ResearchSearchBar from "../Components/ResearchSearchBar";
import SavedGithubRepos from "../Components/SavedGithubrepos";
import CreatedRepos from "../Components/CreatedRepos";
import TaskManagement from "../Components/Taskmanagement";
import{FaTrash,FaPencilAlt,FaUser} from "react-icons/fa"

export default function Research() {
  const { workId, projectId } = useParams();
  const [projectName, setprojectName] = useState(null);
  const[Leader,setLeader]=useState(null);

  const[foldersection,setfoldersection]=useState(false);

  useEffect(()=>{
    const verifyowner=async()=>{
         try{
            const response=await axios.get(`http://localhost:8000/api/Project/verify-Leader/${projectId}`,{
              withCredentials:true,
            });
            setLeader(response.data.isLeader);
         }catch(error)
         {
          if(error.response)
          {
            alert(error.response?.data?.msg || "Cannot verify Leader");
          }
          else
          {
            alert("Internal server error");
          }
         }
    } 
    verifyowner();
  },[workId,projectId])
  

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
          alert(error.response?.data?.msg || "Cannot get project details");
        } else {
          alert("Internal server error");
        }
      }
    };
    getproject();
  }, [workId]);

  return (
    <div className="flex w-full  rounded-2xl">
       
            {foldersection && !researchhub &&  (
              <SavedGithubRepos
              projectId={projectId}
              workId={workId}
              onClose={()=>setfoldersection(false)}
              Leader={Leader}/>
            )}
     
      <div className="flex flex-col gap-3">
        <div className="flex bg-gray-100 flex-col  gap-3 rounded-2xl">
           <div className="flex flex-row items-start  gap-4 p-2">
            <h1 className="text-2xl sm:text-md md:text-2xl lg:text-2xl text-white bg-blue-400 font-bold p-2 rounded-xl">Research Panel</h1>
        
           <div className="flex flex-row">
              <h1 className="text-2xl sm:text-md md:text-2xl lg:text-2xl text-black   font-bold p-2 rounded-xl">Project Name:</h1>
              <h1 className="text-2xl sm:text-md md:text-2xl lg:text-2xl text-green-500 font-bold p-2">{projectName?.name}</h1>
              
           </div>
            
           </div>
           
        </div>
        <div className="flex bg-gray-100 flex-col gap-3 rounded-2xl">
         <div className="flex flex-row ">
           <h1 className="flex items-start justify-start p-4 font-bold text-2xl">Workspace</h1>
           <div className="flex items-center justify-center">
              <button onClick={()=>setresearchhub(!researchhub)} className="text-lg font-bold mx-5 text-white border bg-black/80 p-3 rounded-2xl  hover:bg-black">
                    <MagnifyingGlassIcon className="h-5 w-5 text-white" />
              </button>
              <button>
                <FolderOpenIcon onClick={()=>setfoldersection(true)} className="h-7 w-7 text-yellow-500 "/>
              </button>
              
          
            </div>
         </div>
         {researchhub && (
          <ResearchSearchBar
          projectId={projectId}
          workId={workId}
          onClose={()=>setresearchhub(false)}/>
         )}
        </div>
         <CreatedRepos
         projectId={projectId}
         workId={workId}
         Leader={Leader}
         />
         <TaskManagement
         projectId={projectId}
         workId={workId}
         Leader={Leader}
         openSavedRepo={()=>setfoldersection(true)}/>
      </div>
    </div>
  );
}