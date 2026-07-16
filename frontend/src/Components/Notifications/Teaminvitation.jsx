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
      const declinereq=async(TeamId)=>{
  
        try{
            const response=await axios.post(`http://localhost:8000/api/My/decline-request/${TeamId}`,{},
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
      const acceptrequest=async(TeamId)=>{
        console.log("Team passed : ",TeamId);
        console.log("Current notifications : ",notifications);
          
           try{
              const response = await axios.post(
      `http://localhost:8000/api/My/accept-request/${TeamId}`,
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
                            <div  key={notification._id} className="flex flex-row gap-3 w-full p-2 bg-blue-100">
                                <h1 className="text-black text-md font-mono">
                                  {notification.message}
                                </h1>
                             <div className="flex flex-1 flex-row justify-end my-2 gap-2">
                               <FiCheckSquare onClick={()=>acceptrequest(notification.Team._id)} className="w-8 h-8 text-green-500 "/>
                               <XSquare onClick={()=>declinereq(notification.Team._id)} className="text-red-500 w-8 h-8 mx-2"/>
                             </div>
                            </div>
                       ))
                 )}
        </div>
      )
}