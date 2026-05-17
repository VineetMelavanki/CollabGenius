import React from "react";
import { useState ,useEffect ,useRef} from "react";
import {io} from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Notifications()
{
      const[error,seterror]=useState("");
      const[message,setmessage]=useState("");
      const[message1,setmessage1]=useState("");
      const[error1,seterror1]=useState("");
      const[notifications,setnotifications]=useState([]);
      const[assignments,setassignments]=useState([]);
      const[user,setuser]=useState(null);
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

      return(
        <div className="flex min-h-screen w-full">
            <div className="flex items-start justify-start flex-col gap-3">
                <div className="flex flex-start flex-col gap-3 mb-3">
                      {message && <h1 className="text-green-300 text-2xl">{message}</h1>}
                </div>
             {notifications.length===0?(
                <h1 className="text-red-300 text-xl font-serif">No notifications recieved</h1>
             ):(
                <div className="flex flex-col gap-3">
                    {error1 &&  <h1 className="text-red-500 border-red-400 text-lg ">{error1}</h1>}
                        {message1 && <h1 className="text-green-500 border-green-500 text-lg">{message1}</h1>}
                   {notifications.map((notification)=>(
                    <div className="flex bg-blue-200 items-start rounded-2xl border border-black justify-start p-4" key={notification._id}>

                        <div className="flex justify-between gap-3">
                            <h1 className="text-black text-xl">
                              {notification.message}
                            </h1>
                            <div className="flex-1 items-center ">
                                <button className="text-xl  text-green-500 border border-green-400 rounded-2xl p-3" onClick={()=>acceptrequest(notification.project._id)}>
                                    Accept
                                </button>
                                <button className="text-xl text-red-500 border border-red-500 rounded-2xl p-3" onClick={()=>declinereq(notification.project._id)}>
                                   Decline
                                </button>
                            </div>
                        </div>
                    </div>
                   ))}
                </div>
             )}
             {assignments.length > 0 && (
                <div className="flex flex-col border gap-3">
                 {assignments.map((assignment)=>(
                    <div className="flex  items-start rounded-2xl bg-gray-100 shadow-xl hover:shadow-md justify-start  p-4" key={assignment._id}>
                     <div className="flex flex-row justify-center items-center  gap-3">
                      <h1 className="text-xl"><span onClick={()=>navigate(`/view-profile/${assignment.sender._id}`)} className="text-red-500 hover:underline">{assignment.sender.name}</span> has task for you : </h1>
                      <p className="text-blue-500 text-xl">"{assignment.task}"</p>
                      <button  onClick={()=>navigate(`/get-project/${assignment.projectId?._id}`)} className="mx-4  border-green-300  p-3 px-4 rounded-2xl hover:text-green-500 border-2">REVIEW</button>
                      <button onClick={()=>removeassignment({receiver:assignment.receiver._id,task:assignment.task})} className="rounded-2xl p-3 px-5 border border-red-500 hover:text-red-500">OKAY</button>
                     </div>
                    </div>
                 ))}
                </div>
             )}
            </div>
        </div>
      )
}