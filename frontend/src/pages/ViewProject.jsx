import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import {Box,Typography,Paper, PopoverPaper} from "@mui/material"
export default function ViewProject(){
   const[error,seterror]=useState("");
   const[project,setproject]=useState(null)
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
         setproject(response.data.project)
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
    <Box sx={{display:"flex",minHeight:"50vh",minWidth:"100vw",}}>
        {error && <Typography variant="h6"sx={{color:"red"}}>{error}</Typography>}
     {project && (
       <Box sx={{flexDirection:"column",justifyContent:"flex-start"}}>
        <Box sx={{display:"flex",flexDirection:"column",gap:1}}>
            <Paper elevation={0}
            sx={{
                display:"flex",
                justifyContent:"flex-start",
                width:400,
                p:"1rem 1rem",
            }}>
            <Box sx={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
              <Typography variant="h6">Project name : {project?.title}</Typography>
            </Box>
            </Paper>
            <Paper elevation={0}
            sx={{display:"flex",
                width:"400",
                p:"1rem 1rem",
            }}>
            <Box sx={{display:"flex",flexDirection:"column",gap:2}}>
                <Typography variant="h5">Project Details</Typography>
                <Typography variant="h7">Owner Name : {project.ownerProfile?.name}</Typography>
  
                <Typography variant="h7">Project status : {project.status}</Typography>
            </Box>
            </Paper>
        </Box>
      </Box>
     )} 
    </Box>
   )
}