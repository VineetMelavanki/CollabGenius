import axios from "axios";
import React from "react";
import { useState,useEffect,useContext,createContext } from "react";

const Authcontext=createContext();

export  function AuthProvider({children})
{
     const[user,setuser]=useState([]);

     useEffect(()=>{
         const fetchme=async()=>{
            try{
            const response=await axios.get("http://localhost:8000/api/User/get-me",{
                withCredentials:true,
            });
            setuser(response.data.user);
            }catch(error)
            {
            setuser(null);
            }
         }
         fetchme();
     },[]);

     return(
        <Authcontext.Provider value={{user,setuser}}>
            {children}
            </Authcontext.Provider>
     )
}
export function useAuth(){
    return useContext(Authcontext);
}
