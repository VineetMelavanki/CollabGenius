import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import {Box,Typography} from "@mui/material"
export default function ViewTeam(){
    const[error,seterror]=useState("");
    const[team,setteam]=useState(null);
    
    useEffect(()=>{
        
        const viewteam=async()=>{
            try{
                const token=localStorage.getItem("token");
                if(!token)
                {
                    seterror("Please log in again");
                    return ;
                }
                const response=await axios.get("http://localhost:8000/api/Team/View-Team",
                    {
                        headers:{
                            Authorization:`Bearer ${token}`,
                        }
                    }
                );
                setteam(response.data.team);
            }catch(error)
            {
                if(error.response)
                {
                    seterror(error.response.data.msg || "Cannot fetch team");
                }else
                {
                    seterror("Internal server error");
                }
            }
        }
        viewteam();
    },[])

    return(
        <Box sx={{display:"flex" , justifyContent:'center', alignItems:"center"}}>
            {error && <Typography variant="h4" sx={{color:"red"}}>{error}</Typography>}
            {team &&
            <>
            <Typography variant="h4" sx={{color:"black"}}> Team Name :{team.name}</Typography>
            <Typography variant="h4" sx={{color:"black"}}>Owner id : {team.owner}</Typography>
            </>}
        </Box>
    )
}