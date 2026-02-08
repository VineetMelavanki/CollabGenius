import React, { useEffect } from "react";
import { useState } from "react";
import {Button,Drawer,Box,ListItem,ListItemButton,ListItemText,Typography,AppBar,Toolbar,IconButton,List} from "@mui/material"
import {useNavigate} from "react-router-dom"
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu"
export default function DashBoardLayout({children}){
    const[open,setopen]=useState(false);
    const navigate=useNavigate();
    const[hasprofile,sethasprofile]=useState(false);

    useEffect(()=>{
      const profileverify=async()=>{
        sethasprofile(null);
        const token=localStorage.getItem("token");
        try{
        
        const response=await axios.get("http://localhost:8000/api/Profile-Get-me",{
            headers:{
                Authorization:`Bearer ${token}`,
            }
        });
        sethasprofile(response.data.hasprofile);
        }catch(error)
        {
            console.log(error);
            sethasprofile(false);
        }
      }
      profileverify();
    },[])
    const handleLogout=()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }
    return(
        <Box sx={{display:"flex"}}>
            <Drawer anchor="left" open={open} onClose={()=>setopen(false)}>
                <Box sx={{width:250}} role="presentation">
                  <List>
                    <ListItemButton onClick={()=>{navigate("/dashboard");setopen(false)}}>
                        <ListItemText primary="Home-page"/>
                    </ListItemButton>
                    {!hasprofile &&(
                       <ListItemButton onClick={()=>{navigate("/Create-Profile");setopen(false)}}>
                        <ListItemText primary="Create your profile"/>
                    </ListItemButton>
                    )}
                   
                    <ListItemButton onClick={handleLogout}>
                        <ListItemText primary="Logout"/>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{navigate("/View-Profile");setopen(false)}}>
                        <ListItemText primary="View Profile"/>
                    </ListItemButton>
                    <ListItemButton onClick={()=>{navigate("/View-Project");setopen(false)}}>
                        <ListItemText primary="View-Project"/>
                    </ListItemButton>
                  </List>
                </Box>
            </Drawer>
            {/*Main layout*/}
            <Box sx={{flexGrow:1}}>
            <AppBar position="fixed" color="primary" >
              <Toolbar>
                <IconButton color="inherit" onClick={()=>setopen(true)}>
                    <MenuIcon/>
                </IconButton> 
                <Typography variant="h6">
                    Collab-Genius
                </Typography>
                <Typography variant="h4" sx={{flexGrow:1,textAlign:"center"}}>
                DashBoard
                </Typography>
                <Box>
                 <Button variant="outlined" sx={{color:"black"}} onClick={()=>navigate("/About")}>
                    ABOUT
                </Button>
                <Button variant="outlined"  sx={{color:"red",border:2}}onClick={handleLogout}>
                    Logout
                </Button>
                </Box>
                
              </Toolbar>
            </AppBar>
            <Box sx={{ mt: '64px',p: 2,bgcolor: '#f0f0f0',minHeight: 'calc(100vh - 64px)'}}>
            {children}
            </Box>
    </Box>
    </Box>
    );
}