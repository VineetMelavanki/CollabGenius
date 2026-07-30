import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function GetAllUserChats({ userId }) {
  const [chats, setchats] = useState([]);
  const navigate=useNavigate();
    useEffect(()=>{
     const fetchallchats=async()=>{
        try{
           const response=await axios.get(`http://localhost:8000/api/Chat/get-all-user-chats/${userId}`,{
            withCredentials:true,
           });
           setchats(response.data.chats || []);
           
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
     }
     fetchallchats();
    },[])

    return(
        <div className="flex flex-col gap-2 w-full ">
           {chats.length==0 ? (
            <h1 className="font-bold text-md text-purple-300">No chat history found</h1>
           ):(
           <div className="grid grid-cols-1 w-full  left-0">
             {chats.map((chat)=>(
               <div key={chat._id} className="group flex items-center gap-3 w-full px-3 py-2.5
                         rounded-lg cursor-pointer
                         hover:bg-blue-100
                         transition-colors duration-150"
                         onClick={()=>navigate(`/HomeScreen/chat/${chat._id}`)}
              >
                  <h1 className="font-grotesk">{chat?.title}</h1>
               </div>
             ))}
           </div>
           )}
        </div>
    )
}