import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { FiCheckSquare } from "react-icons/fi";
import { XSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function TeamJoiningreq(){
    const[requests,setrequests]=useState([]);
    const navigate=useNavigate();
    useEffect(()=>{
      const getallRequests=async()=>{
        try{
           const response=await axios.get(`http://localhost:8000/api/Request/get-all-requests`,
          {
            withCredentials:true,
          }
        );
        setrequests(response.data.allrequest || []);
        }catch(error)
        {
          if(error.response)
          {
              alert(error.response?.data?.msg || "Cannot fetch requests");
          }
        }
      }
      getallRequests();
     },[])

     const acceptTeamrequest=async(senderId,projectId,requestId)=>{
            try{
              const response=await axios.post(`http://localhost:8000/api/Request/accept-request/${projectId}/${senderId}`,{},
                {
                  withCredentials:true,
                }
              );
             setrequests((prev)=>prev.filter((r)=>(r._id || r).toString()!==requestId.toString()));
             alert(response.data?.msg || "Request accepted");
            }catch(error)
            {
               if(error.response)
               {
                console.log(error.response?.data?.msg);
                alert(error.response?.data?.msg || "Cannot accept request");
                alert(error.response?.data?.msg || "Cannot accept request");
               }
               else
               {
                 alert("Internal server error");
               }
            }
      }

      const declineTeamrequest=async(senderId,projectId,requestId)=>{
        try{
            const response=await axios.post(`http://localhost:8000/api/Request/decline-request/${projectId}/${senderId}`,{},
              {
                withCredentials:true,
              }
            );
            setrequests((prev)=>prev.filter((r)=>(r._id || r).toString()!==requestId.toString()));
            alert(response?.data?.msg || "Request rejected");
        }catch(error)
        {
            if(error.response)
            {
              alert(error.response?.data?.msg || "Failed to reject request");
            }
            else
            {
              alert("Internal server error");
            }
        }
      }

      return(
        <div>
             {requests.length> 0 && (
                    requests.map((request)=>(
                       <div className="flex flex-col bg-purple-50">
                        
                         <div className="flex flex-row gap-3 w-full p-2" key={request._id} >
                              <p className="text-black text-md font-mono "><span onClick={()=>navigate(`/view-profile/${request.sender._id}`)} className="text-red-500 hover:underline mx-2">{request.sender.name}</span>{request.message}<span className="text-md text-green-500 hover:underline font-sans mx-3"onClick={()=>navigate(`/get-project/${request.projectId._id}`)}>{request.projectId.title}</span></p>
                              <div className="flex flex-1 flex-row justify-end my-2 gap-2">
                                <FiCheckSquare bo onClick={()=>acceptTeamrequest(request.sender._id,request.projectId._id,request._id)} className="text-green-500 w-8 h-8"/>
                                <XSquare onClick={()=>declineTeamrequest(request.sender._id,request.projectId._id,request._id)} className="text-red-500 w-8 h-8 mx-2"/>
                              </div>
                         
                         </div>
                       </div>
                    ))
                 )}
        </div>
      )
}