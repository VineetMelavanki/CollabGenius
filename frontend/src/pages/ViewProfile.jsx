import React, { useEffect } from "react";
import {Box,Paper,Typography,Button,MenuItem} from "@mui/material"
import {List,ListItemText} from "@mui/material"
import { useState } from "react";
import Link from "@mui/material/Link"
import {Avatar} from "@mui/material"
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
       <Box sx={{display:"flex",minWidth:"100vw",minHeight:"50vh"}}>
         {error && <Typography sx={{color:"red"}}>{error}</Typography>}
         {!error && !user && <Typography sx={{color:"blue"}}>Loading...</Typography>}
         {user && (
        <Box sx={{display:"flex",flexDirection:"row",justifyContent:"flex-start"}}>
         <Box sx={{display:"flex",gap:2}}>
           <Paper elevation={0} sx={{
            display:"flex",
            justifyContent:"center",
            width:200,           
            p:"3rem 2.5rem",
            mb:2
         }}>
            <Box sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
               <Avatar  src={user?.photo?.url} sx={{height:100,width:100}}/>
         <Typography variant="h6" sx={{mt:6}}>
            User Id : {user?.userId}
         </Typography>
            </Box>
         </Paper>
         <Paper sx={{
            display:"flex",
            justifyContent:"flex-start",
            width:800,
            p:"2rem 2rem",
            mb:2
         }}
         >
          <Box sx={{display:"flex",flexDirection:"column",justifyContent:"flex-start"}}>
            <Typography variant="h4" sx={{mb:2}}>
               Details
            </Typography>
            <Box sx={{display:"flex",mb:2,flexDirection:"column",gap:2}}>
            <Typography variant="h6">User : {user?.name}</Typography>
           <Typography variant="h6">User Bio : {user?.Bio}</Typography>
           <Typography variant="h6">User skills : {user?.skills}</Typography>
           <Typography variant="h6">skillevel :{user?.skillevel}</Typography>
           <Link href={user?.github_link} target="_blank" underline="hover">{user?.github_link}</Link>
            </Box>
          </Box>
            </Paper>
         </Box>
        
        </Box>
         )}
       </Box>
    );
        
}