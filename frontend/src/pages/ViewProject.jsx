import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import {Box,Typography} from "@mui/material"
export default function ViewProject(){
   const[error,seterror]=useState("");
   const[msg,setmsg]=useState("");
   useEffect(()=>{
      const projectview=async ()=>{
        const token=localStorage.getItem("token");
        if(!token)
        {
            seterror("Please log in")
        }
        try{
          const response=await axios.get("http://localhost:8000/api/Project/View-Project",
              {
                headers:{
                    Authorization:`Bearer ${token}`,
                }
              }
          )
         setmsg(response.data.msg || "Project found");
        }catch(error)
        {
            if(error.response)
            {
                seterror(error.response.data.msg ||"Cannot fetch project")
            }else
            {
                seterror("Internal server error");
            }
        }
          
      }
      projectview();
   },[])
   return(
    <Box sx={{display:"flex",minHeight:"100vh",minWidth:"100vw"}}>
    {error && <Typography variant="h6">{error}</Typography>}
    {msg && <Typography variant="h6">{msg}</Typography>}
    </Box>
   )
}