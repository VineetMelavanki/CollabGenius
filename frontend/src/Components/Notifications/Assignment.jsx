import React from "react";
import { useState,useEffect ,useRef} from "react";

import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../AuthContext";
import { FiCheckSquare } from "react-icons/fi";
import { XSquare } from "lucide-react";
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
                   
                     assignments.map((assignment)=>(
                        
                         <div className="flex flex-row justify-center items-center   gap-3">
                          <h1 className="text-md"><span onClick={()=>navigate(`/view-profile/${assignment.sender._id}`)} className="text-red-500 hover:underline">{assignment.sender.name}</span> has task for you : {assignment.task}</h1>
                          
                          <FiCheckSquare  onClick={()=>navigate(`/get-project/${assignment.projectId?._id}`)} className="w-9 h-9 text-green-500"/>
                          <XSquare onClick={()=>removeassignment({receiver:assignment.receiver._id,task:assignment.task})} className="w-9 h-9 text-red-500" />
                       
                         </div>
                        
                     ))
                   
                 )}
        </div>
      )
}