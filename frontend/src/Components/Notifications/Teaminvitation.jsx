import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { FiCheckSquare } from "react-icons/fi";
import { XSquare } from "lucide-react";
export default function Teaminvitation(){
    const[notifications,setnotifications]=useState([]);
     const getallnotifications=async()=>{
        try{
            const response=await axios.get("http://localhost:8000/api/My/Notifications",
        {
            withCredentials: true,
        }
    )
    setnotifications(response.data.Notify || []);
      
        }catch(error)
        {
            if(error.response)
            {
                alert(error.response?.data?.msg || "Cannot fetch notifications");
            }else
            {
                alert("Internal server error");
            }
        }

    }
    useEffect(()=>{
  

        getallnotifications();
      },[]);
       //decline team invitation
      const declinereq=async(projectId)=>{
  
        try{
            const response=await axios.post(`http://localhost:8000/api/My/decline-request/${projectId}`,{},
                {
                    withCredentials: true
                }
            );
            alert(response.data.msg || "Request rejected");

          if (response.data.success) {
                getallnotifications();
            }
        }catch(error)
        {
            if(error.response)
            {
                alert(error.response?.data?.msg || "Cannot decline request");
            }else
            {
               alert("Internal server error");
            }
        }
      }
      // accept team invitation
      const acceptrequest=async(projectId)=>{
        console.log("project passed : ",projectId);
        console.log("Current notifications : ",notifications);
          
           try{
              const response = await axios.post(
      `http://localhost:8000/api/My/accept-request/${projectId}`,
      {},
      {
        withCredentials: true
      }
    );

    alert(response.data.msg);

if (response.data.success) {
  getallnotifications();
}
           }catch(error)
           {
               if(error.response)
               {
                alert(error.response?.data?.msg || "Cannot accept request");
               }else
               {
                alert("Internal server error");
               }
           }
      }
      return(
        <div>
             {notifications.length> 0 && (
                    notifications.map((notification)=>(
                            <div  key={notification._id} className="flex flex-row gap-3 w-full ">
                                <h1 className="text-black text-md font-mono">
                                  {notification.message}
                                </h1>
                             <div className="flex flex-1 flex-row justify-end gap-4">
                               <FiCheckSquare onClick={()=>acceptrequest(notification?.project)} className="w-6 h-6 text-green-500 "/>
                               <XSquare onClick={()=>declinereq(notification?.project)} className="text-red-500"/>
                             </div>
                            </div>
                       ))
                 )}
        </div>
      )
}