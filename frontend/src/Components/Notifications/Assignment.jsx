import React from "react";
import { useState,useEffect ,useRef} from "react";

import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../AuthContext";
export default function Teamassignment(){
    const {user}=useAuth();
    const navigate=useNavigate();
    const[assignments,setassignments]=useState([]);
    const socketRef=useRef(null);
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

      return(
        <div >
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
        </div>
      )
}