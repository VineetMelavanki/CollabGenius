import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
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
                  <div className="flex flex-col gap-3">
                    {requests.map((request)=>(
                      <div className="flex items-start rounded-2xl bg-gray-100 shadow-xl hover:shadow-md justify-start p-4" key={request._id}>
                         <div className="flex flex-row justify-center items-center gap-3">
                            <p className="lg:text-xl sm:text-lg font-mono "><span onClick={()=>navigate(`/view-profile/${request.sender._id}`)} className="text-red-500 hover:underline mx-2">{request.sender.name}</span>{request.message}<span className="text-lg text-green-500 hover:underline font-sans mx-3"onClick={()=>navigate(`/get-project/${request.projectId._id}`)}>{request.projectId.title}</span></p>
                            <div className="flex flex-1 justify-end">
                               <div className="flex flex-row gap-3">
                                  <button onClick={()=>acceptTeamrequest(request.sender._id,request.projectId._id,request._id)} className="text-lg text-white bg-green-500 p-4 font-bold rounded-2xl hover:bg-green-600">Accept</button>
                                  <button onClick={()=>declineTeamrequest(request.sender._id,request.projectId._id,request._id)} className="text-lg text-white bg-red-500 p-4 font-bold rounded-2xl hover:bg-red-600">Decline</button>
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                 )}
        </div>
      )
}