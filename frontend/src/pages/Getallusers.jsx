import React from "react";
import { useState ,useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Allusers()
{
      const navigate=useNavigate();
      const[error,seterror]=useState("");
      const[message,setmessage]=useState("");
      const token=localStorage.getItem("token");
      const[users,setusers]=useState([]);
      const[formdata,setformdata]=useState({
        name:"",
      });
      const handlechange=async(e)=>{
        e.preventDefault();
        setformdata((prev)=>({...prev,[e.target.name]:e.target.value}));
      }
      const handleSearch=async(e)=>{
        e.preventDefault();
        seterror("");
        setmessage("");
        try{
           const response=await axios.get("http://localhost:8000/api/User/search",
            {
                params:{name:formdata.name},
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
           )
           setusers(response.data.userdata);
           setmessage(response.data.msg || "User fetched successfully");
        }catch(error)
        {
            if(error.response)
            {
                seterror(error.response.data.msg || "Cannot fetch user");
            }
            else
            {
                seterror("Internal server error");
            }
        }
      }
      useEffect(()=>{
         const getallusers=async ()=>{

            seterror("");
            setmessage("");

            try{
            const response=await axios.get("http://localhost:8000/api/User/allusers",
                {
                    headers:
                    {
                        Authorization:`Bearer ${token}`,
                    }
                }
            )
            console.log(error);
            console.log(message);
             setusers(response.data.user);
             setmessage(response.data.msg || "All users fetched succcessfully");
            }catch(error)
            {
                if(error.response)
                {
                    seterror(error.response.data.msg || "Cannot fetch users");
                }
                else
                {
                    seterror("Internal server error");
                }
            }
         }
         getallusers();
      },[token]);

      return(
        <div className="bg-white max-w-full">
         <div className="bg-white rounded-2xl p-6">
          <div className="flex flex-col gap-3">
            <form onSubmit={handleSearch} className="flex flex-row gap-2" >
                <input type="text"
                value={formdata.name}
                name="name"
                onChange={handlechange} 
                placeholder="Enter the name"
                className="flex text-lg p-2 rounded-xl border border-blue-400"/>
                <button  type="submit"  className="text-lg p-2  text-red-400  hover:bg-red-200 border rounded-xl border-red-400 border-2 ">
                Search 
                </button>
            </form>
           {users.length === 0 ? (
  <p className="text-gray-500">No users found</p>
) : (
  <div className="grid grid-cols-1 gap-2">
    {users.map((user) => (
      <div
        key={user._id}
        className="flex justify-between items-center gap-3 border border-blue-400 rounded-2xl p-3"
      >
        <h1 className="text-xl font-serif">
          User name : {user.name}
        </h1>

        <div className="flex gap-2">
          <button
            className="border border-blue-200 text-blue-500 p-3 rounded-xl hover:bg-blue-50"
            onClick={() => navigate(`/view-profile/${user._id}`)}
          >
            View Profile
          </button>
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