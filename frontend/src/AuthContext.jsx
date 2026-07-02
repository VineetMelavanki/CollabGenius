import axios from "axios";
import React from "react";
import { useState,useEffect,useContext,createContext } from "react";

const Authcontext=createContext();

export function AuthProvider({children})
{
     const [user, setuser] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(()=>{
         const fetchme=async()=>{
            try{
                const response=await axios.get("http://localhost:8000/api/User/get-me",{
                    withCredentials:true,
                });
                setuser(response.data?.user ?? null);
            }catch(error)
            {
                setuser(null);
            } finally {
                setLoading(false);
            }
         }
         fetchme();
     },[]);

     return(
        <Authcontext.Provider value={{user,setuser,loading}}>
            {children}
            </Authcontext.Provider>
     )
}
export function useAuth(){
    return useContext(Authcontext);
}
