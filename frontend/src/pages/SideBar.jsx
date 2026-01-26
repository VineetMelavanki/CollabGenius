import{Box,List,ListItemButton,ListItemText} from "@mui/material"
import React from "react"
import { useNavigate } from "react-router-dom"
export default function Sidebar(){
    const navigate=useNavigate();
    const handleLogout=()=>{
      localStorage.removeItem("token");
      navigate("/login")
    }
    return(
        <Box
      sx={{
        width: 250,
        height: "100vh",
        bgcolor: "#f5f5f5",
        position: "fixed",
        top: 64, // below AppBar
      }}
    >
      <List>
        <ListItemButton sx={{background:"red"}} onClick={() => navigate("/Create-Profile")}>
          <ListItemText primary="Create Profile" />
        </ListItemButton>
        <ListItemButton sx={{background:"red"}} onClick={handleLogout}>
          <ListItemText primary="Logout"/>
        </ListItemButton>
        <ListItemButton sx={{background:"red"}} onClick={()=>navigate("/View-Profile")}>
         <ListItemText primary="View Profile"/>
        </ListItemButton>
      </List>
    </Box>
    )
}