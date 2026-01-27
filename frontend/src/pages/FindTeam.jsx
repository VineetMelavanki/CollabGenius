import React from "react";
import { useState } from "react";
import axios from "axios";
import {Paper,TextField,Button, Typography} from "@mui/material"
export default function FindTeam(){
    const[error,seterror]=useState("");
    const[team,setteam]=useState("");
    const showteam=async(e)=>{
       try{
        e.preventDefault();
        const token=localStorage.getItem("token");
        if(!token)
        {
            seterror("Please Log in");
            return ;
        }
        const response=await axios.get("http://localhost:8000/api/Team/:Teamid",
            {
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
        )
        setteam(response);
       }
       catch(error)
       {
        if(error.response)
        {
            seterror(error.response.data.msg||"Cannot fetch team");
        }else
        {
            seterror("Internal server error");
        }
       }
    }
    return(
       <Box
       sx={{minHeight:"100vh",minWidth:"10vw",display:"flex",justifyContent:"center",alignItems:'center'}}>
        <Paper
        elevation={0}
        sx={{width:400,
            p:"2rem 3rem",
            textAlign:'center',
            borderRadius:"16px"
        }}>
            <Typography variant="h4" sx={{color:"red"}}>
              Team INFORMATION
            </Typography>
            {error && <Typography sx={{color:"red"}}>{error}</Typography>}
            {team ?(
                <>
                <Typography variant="h6">Name :{team.name}</Typography>
                <Typography variant="H6">Owner :{team.owner}</Typography>
                </>
            ):(<Button onClick={showteam} color="primary">SHOW TEAM INFO</Button>)}
        </Paper>
       </Box>
    )
}