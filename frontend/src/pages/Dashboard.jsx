import React from "react";

import{AppBar,Toolbar,Box,Typography,IconButton}from "@mui/material"
import {Notifications,AccountCircle} from "@mui/icons-material"
export default function Dashboard()
{
    return(
        <AppBar position="fixed" color="primary">
            <Toolbar>
                <Box>
                    <Typography variant="h6">Collab-Genius</Typography>
                </Box>
                <Box sx={{flexGrow:1,textAlign:"center"}}>
                    <Typography variant="subtitle1">
                        DashBoard
                    </Typography>
                </Box>
                <Box sx={{display:"flex", gap:1}}>
                <IconButton>
                    <Notifications/>
                </IconButton>
                <IconButton>
                    <AccountCircle/>
                </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}