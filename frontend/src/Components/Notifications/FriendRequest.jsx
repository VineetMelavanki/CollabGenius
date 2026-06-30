import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { FiCheckSquare } from "react-icons/fi";
import { XSquare } from "lucide-react";
export default function FriendRequest(){
    const[friendreq,setfriendreq]=useState([]);
    const[senderphotos,setsenderphotos]=useState({});
    useEffect(()=>{
        const fetchFriendReq=async()=>{
          try{
            const response=await axios.get("http://localhost:8000/api/FriendRequest/get-all-requests",{
            withCredentials:true,
          });
          setfriendreq(response.data.Requests || []);
          setsenderphotos(response.data.Senderphotos || {});
          }catch(error)
          {
             if(error.response)
             {
              alert(error.response?.data?.msg || "Cannot fetch requests");
             }
             else
             {
              console.log(error);
              alert("Internal server error");
             }
          }
          
        }
        fetchFriendReq();
      },[]);

      const handleacceptfriendreq=async(requestId)=>{
        try{
          const response=await axios.post(`http://localhost:8000/api/FriendRequest/accept-request/${requestId}`,{},{
            withCredentials:true,
          });
          setfriendreq((prev)=>prev.filter((r)=>(r._id || r).toString()!==requestId.toString()));
          alert(response?.data?.msg || "Friend request accepted");
        }catch(error)
        {
            if(error?.response)
            {
              alert(error?.response?.data?.msg || 'Cannot accept friend request');
            }
            else
            {
              console.log("The error is : ",error);
              alert("Internal server error");
            }
        }
      }

      const handlerejectfriendreq=async(requestId)=>{
        try{
         const response=await axios.post(`http://localhost:8000/api/FriendRequest/decline-request/${requestId}`,{},{
          withCredentials:true,
         });
         setfriendreq((prev)=>prev.filter((r)=>(r._id || r).toString()!==requestId.toString()));
         alert(response?.data?.msg||"Friend Request Rejected");
        }catch(error)
        {
            if(error.response)
            {
              alert(error.response?.data?.msg || 'Cannot reject request');
            }
            else
            {
              alert("Internal server error");
            }
        }
      }

      return(
        <div>
            {friendreq.length > 0 && (
                  friendreq.map((request)=>(
                       <div key={request._id} className="flex flex-row gap-3 w-full text-md">
                      {senderphotos[request?.sender?._id] && (
                        <img src={senderphotos[request.sender._id]} className="w-10 h-10 rounded-full" />
                      )}
                         <h1 className="text-gray-500"><span className="text-red-500">{request?.sender?.name}</span>{" "}{request.message}</h1>
                        <div className="flex flex-1 gap-2">
                          <XSquare onClick={()=>handlerejectfriendreq(request._id)} className="w-9 h-9 text-red-500"/>
                          <FiCheckSquare onClick={()=>handleacceptfriendreq(request._id)} className="w-9 h-9 text-green-500"/>
                        </div>
                    </div>
                  ))
                 )}
        </div>
      )
}