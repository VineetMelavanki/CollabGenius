import React from "react";
import {Box,Paper,Typography,Button,MenuItem} from "@mui/material"
import { useState } from "react";
import axios from "axios";
export default function ViewProfile(){
    const[error,seterror]=useState("");
     const[user,setuser]=useState("");
   
     const showuser=async(e)=>{
        try{
          e.preventDefault();
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
    return(
        <Box
        sx={{minHeight:"100vh",
            minWidth:"100vw",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
        }}
        >
        <Paper
        elevation={0}
        sx={{
            width:400,
            p:"2rem 3rem",
            textAlign:"center",
            borderRadius:"16px",
            background:"#rgba(8, 8, 7, 0.08)"
        }}>
         <Typography variant="h5" mb={4} mt={1}>
            User Profile
         </Typography>
         {error && <Typography sx={{color:"red",mb:2}}>{error}</Typography>}
         {user ?(
            <>
            <Typography  variant="h6"sx={{mb:2, color:"black"}}>Bio :{user.Bio}</Typography>
            <Typography>Skills : {user.skills}</Typography>
            <Typography>skillevel :{user.skillevel}</Typography>
            <Typography>github_link : {user.github_link}</Typography>
            </>
         ):(
           <Button variant="contained" onClick={showuser}>View Profile</Button>
         )}
        </Paper>
        </Box>
    );
}