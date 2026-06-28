import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {FiCheckSquare} from "react-icons/fi";
import { XSquare } from "lucide-react";
export default function Notificationsection({onClose}){
     const[error,seterror]=useState("");
      const[message,setmessage]=useState("");
      const[message1,setmessage1]=useState("");
      const[error1,seterror1]=useState("");
      const[notifications,setnotifications]=useState([]);
      const[assignments,setassignments]=useState([]);
      const[user,setuser]=useState(null);
      const[msg3,setmsg3]=useState("");
      const[error3,seterror3]=useState("");
      const[error2,seterror2]=useState("");
      const[requests,setrequests]=useState([]);
      const socketRef=useRef(null);
      const navigate=useNavigate();
      const removeassignment=async({receiver,task})=>{
             try{
                if(!socketRef.current?.connected)
                {
                    return ;
                }
                setassignments((prev)=>
                    prev.filter((a)=>!(a.receiver._id===receiver && a.task===task)),
                );
                socketRef.current.emit("remove-task",({receiver,task}));
             }catch(error)
             {
                console.log(error);
                socketRef.current.emit("error",{msg:"Internal server error"});
             }
      }
      const getallnotifications=async()=>{
        try{
            const response=await axios.get("http://localhost:8000/api/My/Notifications",
        {
            withCredentials: true
        }
    )
    setnotifications(response.data.Notify || []);
    setmessage(response.data.msg || "All Notifications fetched");
        }catch(error)
        {
            if(error.response)
            {
                seterror(error.response?.data?.msg || "Cannot fetch notifications");
            }else
            {
                seterror("Internal server error");
            }
        }

    }
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
              seterror2(error.response?.data?.msg || "Cannot fetch requests");
          }
        }
      }
      getallRequests();
     },[])
      const declinereq=async(projectId)=>{
        seterror1("");
        setmessage1("");
        try{
            const response=await axios.post(`http://localhost:8000/api/My/decline-request/${projectId}`,{},
                {
                    withCredentials: true
                }
            );
            setmessage1(response.data.msg || "Request rejected");

if (response.data.success) {
  getallnotifications();
}
        }catch(error)
        {
            if(error.response)
            {
                seterror1(error.response?.data?.msg || "Cannot decline request");
            }else
            {
                seterror1("Internal server error");
            }
        }
      }
      const acceptrequest=async(projectId)=>{
        console.log("project passed : ",projectId);
        console.log("Current notifications : ",notifications);
           seterror1("");
           setmessage1("");
           try{
              const response = await axios.post(
      `http://localhost:8000/api/My/accept-request/${projectId}`,
      {},
      {
        withCredentials: true
      }
    );

    setmessage1(response.data.msg);

if (response.data.success) {
  getallnotifications();
}
           }catch(error)
           {
               if(error.response)
               {
                seterror1(error.response?.data?.msg || "Cannot accept request");
               }else
               {
                seterror1("Internal server error");
               }
           }
      }
      useEffect(()=>{
        const fetchUser = async () => {
          try {
            const response = await axios.get("http://localhost:8000/api/User/get-me", {
              withCredentials: true
            });
            setuser(response.data.user);
          } catch (error) {
            console.log(error);
          }
        };
        fetchUser();
      }, []);
      useEffect(()=>{
        const socket=io("http://localhost:8000",{
            withCredentials: true
        });
         socketRef.current=socket;
         socket.on("connect",()=>{
            console.log("user connected :",socket.id);
            if(user?._id) {
              socket.emit("join-notify-room",{receiver:user._id});
            }
         });
         socket.on("All-assignments",(assignments)=>{
            setassignments(assignments);
         });
         socket.on("receive-assignment",(assignment)=>{
            setassignments((prev)=>[assignment,...prev]);
         });
         return ()=>{
            socket.disconnect();
         }
      },[user?._id])
      useEffect(()=>{
        seterror("");
        setmessage("");

        getallnotifications();
      },[]);
      //Request Functions
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
                seterror3(error.response?.data?.msg || "Cannot accept request");
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
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={()=>onClose()}/>
            <div className="relative bg-white w-full max-w-lg h-full flex flex-col shadow-2xl overflow-y-auto">
                <div className="flex items-start justify-start flex-col gap-3 p-4 min-h-full border-2">
                    <div className="flex flex-row gap-2 p-2 w-full">
                       <h1 className="text-slate-600 font-dm text-lg">Notifications</h1>
                       <div className="flex flex-1 justify-end mx-2">
                        <button>
                            <h1 className="text-lg text-red-500 font-bold" onClick={()=>onClose()}>X</h1>
                        </button>
                       </div>
                    </div>
                    <div className="w-full h-px bg-gray-300" />
                 {notifications.length> 0 && (
                    notifications.map((notification)=>(
                            <div  key={notification._id} className="flex flex-row gap-3 w-full ">
                                <h1 className="text-black text-md font-mono">
                                  {notification.message}
                                </h1>
                             <div className="flex flex-1 flex-row justify-end gap-4">
                               <FiCheckSquare className="w-6 h-6 text-green-500 "/>
                               <XSquare className="text-red-500"/>
                             </div>
                            </div>
                       ))
                 )}
                    
                 {assignments.length > 0 && (
                    <div className="flex flex-col border gap-3">
                     {assignments.map((assignment)=>(
                        <div className="flex  items-start rounded-2xl bg-gray-100 shadow-xl hover:shadow-md justify-start  p-4" key={assignment._id}>
                         <div className="flex flex-row justify-center items-center  gap-3">
                          <h1 className="text-xl"><span onClick={()=>navigate(`/view-profile/${assignment.sender._id}`)} className="text-red-500 hover:underline">{assignment.sender.name}</span> has task for you : </h1>
                          <p className="text-blue-500 text-xl font-mono">"{assignment.task}"</p>
                          <button  onClick={()=>navigate(`/get-project/${assignment.projectId?._id}`)} className="mx-4 text-white bg-green-500 font-bold p-3 text-md rounded-xl hover:bg-green-600">REVIEW</button>
                          <button onClick={()=>removeassignment({receiver:assignment.receiver._id,task:assignment.task})} className="rounded-2xl p-3 px-5 border text-white bg-red-500 font-bold hover:bg-red-600">OKAY</button>
                         </div>
                        </div>
                     ))}
                    </div>
                 )}
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
            </div>
        </div>
      )
}