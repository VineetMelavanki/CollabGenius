import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"
import NoresNodup from "./NoresNodup";
import GetAllUserChats from "../AIchats/getalluserchats";
import { PanelLeftIcon } from "lucide-react";
import axios from "axios";
import { XIcon } from "lucide-react";
import { useAuth } from "../../AuthContext";

const LoadingAnimation = () => (
  <div className="flex items-center gap-1 px-4 py-3 bg-slate-100 rounded-2xl">
    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);
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
      const[isLoading,setIsLoading]=useState(false);
      const messagesEndRef=useRef(null);
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
         const chathistory=response.data?.messages ||[];
         const formattedMessages=chathistory.map((message)=>{
          if(message.role==="user")
          {
            return message;
          }
          return {
            ...message,
            content:
              message.intent==="COLLABORATION_SEARCH"
              ?JSON.parse(message.content)
              :message.content
          };
         });
         setAimessages(formattedMessages);
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
        
        const tempUserMessage={role:"user",content:messagePrompt};
        setAimessages((prev)=>[...prev,tempUserMessage]);
        setdashboardprompt({prompt:""});
        setIsLoading(true);
        
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
           setAimessages((prev)=>{
            const newMessages=[...prev];
            newMessages[newMessages.length-1]=userMessage;
            return [...newMessages,botMessagewithintent];
           });
           setIsLoading(false);
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
          setIsLoading(false);
        }
        
      }
      const processChat=useCallback(async(messagePrompt)=>{
            const tempUserMessage={role:"user",content:messagePrompt};
            setAimessages((prev)=>[...prev,tempUserMessage]);
            setIsLoading(true);
            
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
           setAimessages((prev)=>{
            const newMessages=[...prev];
            newMessages[newMessages.length-1]=userMessage;
            return [...newMessages,botMessagewithintent];
           });
            setdashboardprompt({prompt:""});
            setIsLoading(false);
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
                  setIsLoading(false);
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

      useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
      },[Aimessages,isLoading]);
       const handlesubmitnew=async(e)=>{
          e.preventDefault();
          if(!dashboardprompt.prompt?.trim()){
            return;
          }
          setIsLoading(true);
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
           setIsLoading(false);
        }
       }
      
    return(
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>onClose()}/>
           <div className="relative flex flex-col bg-gradient-to-br from-white to-gray-50 w-full max-w-2xl shadow-2xl p-6 overflow-hidden rounded-l-2xl"
           >
            <button className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
             <PanelLeftIcon onClick={()=>setopen(true)} className="w-6 h-6 text-gray-600"/>
            </button>
            {!chatId && (
               <NoresNodup
              handlesubmitnew={handlesubmitnew}
              handlechange={handlechange}
              dashboardprompt={dashboardprompt}
              isLoading={isLoading}/>
            )}
             <aside
        className={`absolute flex left-0 top-0 h-full w-72 bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}             
             >
            <div className="p-6">
               <div className="flex flex-row gap-2 items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-800">Chat History</h2>
                 <div className="flex flex-1 justify-end w-full">
                  <button onClick={()=>setopen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <XIcon className="w-5 h-5 text-gray-500 hover:text-red-500"/>
                  </button>
                 </div>
               </div>
               <GetAllUserChats
               userId={user._id}/>
            </div>
             </aside>
            {chatId && Aimessages.length > 0 &&  (
              <div className="flex flex-col border mt-6 w-full h-full p-3 gap-2 rounded-xl">
                <div className="flex-1 overflow-y-auto p-4 gap-2 space-y-4 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm">
                 {Aimessages.map((message,index)=>(

                  <div key={message?._id || `${message?.role || "message"}-${index}`}>
                   {message?.role ==="user" ?(
                    <div className="flex justify-end mx-4 animate-fade-in">
                       <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-3 rounded-2xl shadow-md max-w-[80%]">
                         <p className="break-words">{message?.content}</p>
                       </div>
                    </div>
                   ):(
                    <div className="flex justify-start mx-4 animate-fade-in">
                      {message?.intent === "GREETING" && (

                         <div className="bg-slate-100 text-slate-800 px-5 py-3 rounded-2xl shadow-sm max-w-[80%]">
                           <p className="break-words">{message?.content}</p>
                         </div>

                      )}

                      {message?.intent === "COLLABORATION_SEARCH" && (
            
                      <div className="flex flex-col  bg-slate-100 text-slate-800 px-4 py-3 rounded-2xl">
                        
                      <div className="mb-3">
                        {!message.content.team && (
                            <div className="justify-start max-w-20">
                            <h1 className="font-bold text-white text-center mb-2 rounded-xl bg-yellow-500">Teams</h1>
                          </div>
                        )}
                          { message?.content?.teams?.map((team) => (
                          <div key={team.id} className="mb-3 border p-4 rounded-xl bg-gray-200 ">
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
                      </div>
                     
                       {!message.content.users && (
                          <div className="justify-start max-w-20">
                          <h1 className="font-bold text-white text-center mb-2 rounded-xl bg-yellow-500">Users</h1>
                        </div>
                       )} 
                        {message?.content?.users?.map((user) => (
                          <div key={user.id} className="mb-3 border p-2 rounded-xl bg-gray-200">
                            
                              <div className="flex flex-row gap-2 mb-2">
                                <h3 className="font-bold">
                                 {user.name}
                                </h3>
                                <div className="flex flex-1 gap-2 justify-end mx-2">
                                   <button className="text-blue-600" onClick={()=>navigate(`/view-profile/${user.id}`)}>View</button>
                                </div>
                              </div>
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
                {isLoading && (
                  <div className="flex justify-start mx-4">
                    <LoadingAnimation />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

               <div className="border-2 border-gray-200 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                  <form className="flex flex-row gap-3" onSubmit={handlefollowupSubmit}>
                    <input type="text"
                    name="prompt"
                    placeholder="Type your message..."
                    value={dashboardprompt.prompt}
                    onChange={handlechange}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={isLoading}
                    />
                    <button type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-medium whitespace-nowrap ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {isLoading ? 'Sending...' : 'Send'}
                    </button>
                  </form>
               </div>
              </div>
            )}
          </div>
        </div>
    )
}