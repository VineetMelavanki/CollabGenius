import React, { useEffect } from "react";
import {Box,Paper,Typography,Button,MenuItem} from "@mui/material"
import { useState } from "react";
import axios from "axios";
export default function ViewProfile(){
    const[error,seterror]=useState("");
     const[user,setuser]=useState(null);
   useEffect(()=>{
     const showuser=async()=>{
        try{
          const token=localStorage.getItem("token");
     if(!token)
     {
        seterror("Please log in ");
        return ;
     }
         const response=await axios.get("http://localhost:8000/api/Profile/View-Profile",
            {
                headers:{
                   Authorization:`Bearer ${token}`,
                }
            }
         );
         setuser(response.data.Profile);
     }
        catch(error)
        {
           if(error.response)
           {
            seterror(error.response.data.msg ||"Cannot view Profile")
           }
           else
           {
            seterror("Internal server error");
           }
        }   
        
    }
    showuser();
   },[])

    return(
      <Box sx={{minHeight:"100vh",p:3,minWidth:"100vw", justifyContent:"center", textAlign:"center"}}>
         {error && <Typography variant="h4">{error}</Typography>}
         {!error &&!user &&(
            <Typography variant="h4" sx={{color:"red"}}>Loading....</Typography>
         )}
         {user &&(
            <>
            <Typography variant="h4" sx={{color:"black"}}> Bio: {user.Bio}</Typography>
            <Typography variant="h4" sx={{color:"black"}}> SKILLS : {user.skills}</Typography>
            <Typography variant="h4" sx={{color:"black"}}> skillevel : {user.skillevel}</Typography>
            <Typography variant="h4" sx={{color:"black"}}>github_link : {user.github_link}</Typography>
            </>
         )}
      </Box>
    );
        
}