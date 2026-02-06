import React from "react";
import HoverEfffect from "../effects/HoverCard";
import {Box,Paper,Typography,Card,Grid,CardContent,CardActions} from "@mui/material"
export default function About()
{
    return(
        
         <Box sx={{display:"flex",minWidth:"100vw",minHeight:"100vh",flexDirection:"column",color:"black"}}>
           <Box sx={{textAlign:"center",mb:3}}>
           <Typography variant="h3"sx={{mb:2}}>
            About our platform
           </Typography>
            <Typography variant="h6" sx={{color:"black"}}>
            Our platform provides an easy way to collaborate and maintain transparency , this platform is user friendly and can be used in wide range of professions
            </Typography>
           </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <HoverEfffect>
             <Paper sx={{
                width:400,
                p:"2rem 2rem",
                justifyContent:"center",
                textAlign:'center'
            }}>
                
                 <Typography variant="h6" sx={{color:"red",mb:2}}>
                Revenue generate 
             </Typography>
             <Typography variant="h7" sx={{color:"red"}}>
               $300K+
             </Typography>
            </Paper>
            </HoverEfffect>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HoverEfffect>
              <Paper sx={{
                width:400,
                p:"2rem 2rem",
                justifyContent:"center",
                textAlign:'center'
            }}>
            <Typography variant="h6" sx={{color:"red",mb:2}}>
                Users Attracted
            </Typography>
            <Typography>
                Total Usera :100k
            </Typography>
            </Paper>  
            </HoverEfffect>
            
          </Grid>
        </Grid>
        </Box>
         
        
    )
}