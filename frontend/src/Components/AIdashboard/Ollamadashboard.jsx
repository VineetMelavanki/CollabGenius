import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"
import NoresNodup from "./NoresNodup";
import GetAllUserChats from "../AIchats/getalluserchats";
import { PanelLeftIcon } from "lucide-react";
import axios from "axios";
import { XIcon } from "lucide-react";
import { useAuth } from "../../AuthContext";
export default function OllamaDashboard({ onClose, prompt: initialPromptProp }){
      const navigate=useNavigate();
      const location=useLocation();
      const {chatId}=useParams();
      const[Aimessages,setAimessages]=useState([]);
      const[dashboardprompt,setdashboardprompt]=useState({
        prompt: initialPromptProp || "",
      });
      const {user}=useAuth();
      const[open,setopen]=useState(false);
      const initialprompt=location.state?.prompt || initialPromptProp;
      const handlechange=async(e)=>{
        setdashboardprompt((prev)=>({...prev,[e.target.name]:e.target.value}));
      }
      const fetchChathistory=useCallback(async()=>{
        try{
         const response=await axios.get(`http://localhost:8000/api/Chat/get-chat-messages/${chatId}`,{
          withCredentials:true,
         });
         console.log("The backend response is : ",response.data?.messages);
         const chathistory=response.data?.messages;
         console.log("The chathistory is : ",chathistory);
         setAimessages(chathistory);
        }catch(error)
        {
            if(error.response)
            {
              alert(error.response?.data?.msg || "Chat history cannot be fetched");
            }
            else
            {
              alert("Internal server errror");
            }
        }
      },[chatId]);
      const handlefollowupSubmit=async(e)=>{
        e.preventDefault();
        const messagePrompt=dashboardprompt.prompt.trim();

        if(!messagePrompt)
        {
          return ;
        }
        try{
           const response=await axios.post(`http://localhost:8000/api/ai/get-answers/${chatId}`,{
            prompt:messagePrompt,
           },{
            withCredentials:true,
           });
           console.log("Backend response : ",response.data);
           
           const userMessage=response.data?.userMessage;
           const botMessage=response.data?.botMessage;
           const intent=response.data?.intenttype;

           const botMessagewithintent={
            ...botMessage,
            intent:intent,
            content:
            intent==="COLLABORATION_SEARCH"
            ?JSON.parse(botMessage.content)
            :botMessage.content
           };
           setAimessages((prev)=>[...prev,userMessage,botMessagewithintent]);
           setdashboardprompt({prompt:""});
        }catch(error)
        {
          if(error.response)
          {
            console.log("Error is ",error.message);
            alert(error.response?.data?.msg || "Cannot send followup message");
          }
          else
          {
            alert("Internal server error");
          }
        }
        
      }
      const processChat=useCallback(async(messagePrompt)=>{
            try{
              console.log("Chat id : ",chatId);
                const response=await axios.post(`http://localhost:8000/api/ai/get-answers/${chatId}`,{
              prompt:messagePrompt,
            },
              {
                withCredentials:true,
              },
            );
            console.log("Backend response : ",response.data);

            const userMessage=response.data?.userMessage;
            const intent=response.data?.intenttype;
            const botMessage=response.data?.botMessage;
            const botMessagewithintent={
            ...botMessage,
            intent:intent,
            content:
            intent==="COLLABORATION_SEARCH"
            ?JSON.parse(botMessage.content)
            :botMessage.content
           };
           setAimessages((prev)=>[...prev,userMessage,botMessagewithintent]);
            setdashboardprompt({prompt:""})
            }catch(error)
            {
                if(error.response)
                  {
                    alert(error.response?.data?.msg || "Cannot fetch chats");
                  }     
                  else
                  {
                    alert("Internal server error");
                  }
            }
          }, [chatId]);

       
      useEffect(()=>{
        if(chatId && !initialprompt)
        {
          fetchChathistory();
        }
        if(chatId && initialprompt)
        {
          processChat(initialprompt);
        }
      },[chatId, initialprompt, processChat]);
       const handlesubmitnew=async(e)=>{
          e.preventDefault();
          if(!dashboardprompt.prompt?.trim()){
            return;
          }
          try{
         const response=await axios.post("http://localhost:8000/api/chat/create-chat",{
          prompt:dashboardprompt.prompt,
         },{
          withCredentials:true,
         });
         const newChatId=response.data?.newChat?._id;
         navigate(`/HomeScreen/chat/${newChatId}`,{
          state:{
            prompt:dashboardprompt.prompt,
          }
         });
        }catch(error)
        {
           if(error.response)
           {
            alert(error.response?.data?.msg || "Cannot create chat");
           }
           else
           {
            alert("Internal server error");
           }
        }
       }
      
    return(
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={()=>onClose()}/>
           <div className="relative flex flex-col bg-white  w-full max-w-2xl shadow-2xl p-4 overflow-hidden"
           >
            <button className="items-start justify-start">
             <PanelLeftIcon onClick={()=>setopen(true)}/>
            </button>
            {!chatId && (
               <NoresNodup
              handlesubmitnew={handlesubmitnew}
              handlechange={handlechange}
              dashboardprompt={dashboardprompt}/>
            )}
             <aside
        className={`absolute flex left-0 top-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}             
             >
            <div className="p-6">
               <div className="flex flex-row gap-2">
                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Chat history</h2>
                 <div className="flex flex-1 justify-end w-full">
                  <XIcon className="w-5 h-5 text-red-500" onClick={()=>setopen(false)}/>
                 </div>
               </div>
               <GetAllUserChats
               userId={user._id}/>
            </div>
             </aside>
            {chatId && Aimessages.length > 0 &&  (
              <div className="flex flex-col border mt-6 w-full h-full p-3 gap-2 ">
               <div className="flex-1 overflow-y-auto p-4 space-y-4 border-2">
                 {Aimessages.map((message,index)=>(
                  <div key={message?._id || `${message?.role || "message"}-${index}`}>
                   {message?.role ==="user" ?(
                    <div className="flex justify-end mx-4 ">
                       <h1 className="bg-violet-600 text-white px-4 py-3 rounded-2xl">{message?.content}</h1>
                    </div>
                   ):(
                    <div className="flex justify-start mx-4">
                      {message?.intent === "GREETING" && (

          <h1 className="bg-slate-100 text-slate-800 px-4 py-3 rounded-2xl">
            {message?.content}
          </h1>

        )}

        {message?.intent === "COLLABORATION_SEARCH" && (
            
              <div className="bg-slate-100 text-slate-800 px-4 py-3 rounded-2xl">
            <div className="justify-start max-w-20">
             <h1 className="font-bold text-white text-center mb-2 rounded-xl bg-yellow-500">Teams</h1>
            </div>
            
            {message?.content?.teams?.map((team) => (
              <div key={team.id} className="mb-3 border p-2 rounded-xl bg-gray-200">
                <div className="flex flex-row gap-2 mb-2">
                  <h3 className="font-bold">
                    {team.title}
                  </h3>
                  <div className="flex flex-1 gap-2 justify-end mx-2">
                   <button className="text-blue-600" onClick={()=>navigate(`/get-Team/${team.id}`)}>View</button>
                  </div>
                </div>

                <p>
                  {team.description}
                </p>
              </div>
            ))}

            {message?.content?.users?.map((user) => (
              <div key={user.id} className="mb-3">
                <h3 className="font-bold">
                  {user.name}
                </h3>

                <p>
                  {user.skills?.join(", ")}
                </p>
              </div>
            ))}

            {message?.content?.Work?.map((work) => (
              <div key={work.id} className="mb-3">
                <h3 className="font-bold">
                  {work.title}
                </h3>
              </div>
            ))}

          </div>

        )}
                    </div>
                   )}
                  </div>
                 ))}
               </div>

               <div className="border-2 bg-white p-4">
                  <form className="flex flex-row gap-2" onSubmit={handlefollowupSubmit}>
                    <input type="text"
                    name="prompt"
                    placeholder="Enter message"
                    value={dashboardprompt.prompt}
                    onChange={handlechange}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium whitespace-nowrap">
                      Send
                    </button>
                  </form>
               </div>
              </div>
            )}
          </div>
        </div>
    )
}