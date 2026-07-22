import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"
import NoresNodup from "./NoresNodup";
import axios from "axios";
export default function OllamaDashboard({ onClose, prompt: initialPromptProp }){
      const navigate=useNavigate();
      const location=useLocation();
      const {chatId}=useParams();
      const[Aimessages,setAimessages]=useState([]);
      const[dashboardprompt,setdashboardprompt]=useState({
        prompt: initialPromptProp || "",
      });
      const initialprompt=location.state?.prompt || initialPromptProp;
      const handlechange=async(e)=>{
        setdashboardprompt((prev)=>({...prev,[e.target.name]:e.target.value}));
      }
    
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
           
           setAimessages((prev)=>[...prev,userMessage,botMessage]);
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
            const botMessage=response.data?.botMessage;
            setAimessages((prev)=>[...prev, userMessage, botMessage].filter(Boolean));
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
        if(!chatId || !initialprompt)
        {
          return ;
        }
        else
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
           <div className="relative flex bg-white w-full max-w-2xl h-full shadow-2xl p-4">
            {!chatId && (
               <NoresNodup
              handlesubmitnew={handlesubmitnew}
              handlechange={handlechange}
              dashboardprompt={dashboardprompt}/>
            )}
             
            
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
                        <h1 className="bg-slate-100 text-slate-800 px-4 py-3 rounded-2xl">{message?.content}</h1>
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