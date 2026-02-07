import React from "react";
import { useState } from "react";
import {Box,Typography,Paper, TextField, Button} from "@mui/material"
import axios from "axios";
export default function CreateProject(){
    const[msg,setmsg]=useState("");
    const[error,seterror]=useState("");
    const[formdata,setformdata]=useState({
        title:"",
    })
    const handlechange=(e)=>{
    setformdata((prev)=>({...prev,[e.target.name]:e.target.value}));
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        seterror("");
        setmsg("");
        const token=localStorage.getItem("token");
        if(!token)
        {
            seterror("Please log in again");
        }
        try{
            const response=await axios.post("http://localhost:8000/api/Project/Create-Project",formdata,
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                }
            )
            setmsg(response.data.msg || "Project Created Successfully");
        }catch(error)
        {
            if(error.response)
            {
                seterror(error.response.data.msg || "Cannot create Profile");
            }else
            {
                seterror("Internal server error");
            }
        }
    }
    return(
       <Box sx={{
        minHeight:"100vh",
        minWidth:"100vw",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
       }}>
        <Paper elevation={0} sx={{
            width:400,
            textAlign:"center",
            p:"3rem 3.5rem",
        }}>
         <Typography variant="h4" fontWeight={700} mb={1}>
            Create Project
         </Typography>
         {error && <Typography sx={{color:"red"}}>{error}</Typography>}
         {msg && <Typography sx={{color:"green"}}>{msg}</Typography>}
         <Box component="form" onSubmit={handleSubmit}>
         <TextField
         fullWidth
         label="Team name"
         type="text"
         name="title"
         value={formdata.title}
         onChange={handlechange}
         variant="filled"
         sx={{
            backgroundColor:"white",
            mb:2
         }}/>
         <Button type="submit">Create</Button>
         </Box>
        </Paper>
       </Box>
    )
}