import React from "react";
import {Box,Paper,Typography,Card,Grid,CardContent,CardActions} from "@mui/material"
export default function About()
{
    return(
        <Box sx={{display:"flex",minWidth:"100vw"}}>
            <Grid container spacing={3}>
             <Grid item xs={12} sm={6} md={3}>
                <Card sx={{width:250,height:250}}>
                    <CardContent>
                        <Typography>hello</Typography>
                    </CardContent>

                </Card>
             </Grid>
            </Grid>
        </Box>
    )
}