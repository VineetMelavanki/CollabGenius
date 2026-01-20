import React from "react";
import {useNavigate} from "react-router-dom"
import {Box,Grid,Typography,Card, Icon,Container, CardActions,CardContent,Button} from "@mui/material"
import{Add,Description,LogoutIcon} from "@mui/icons-material"
export default function Dashboard()
{
    const handlelogout=()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }
    const navigate=useNavigate();
    const cards=[
        {
            title:"Create team",
            Description:"Create your own team here",
            icon :<Add sx={{fontSize:60,color:"secondary.main"}}/>,
            action:()=>navigate("/Create-team"),
            Textbtn:"Create team",
        },
        {
            title:"Logout",
            Description:"Log out from here",
            icon:<LogoutIcon sx={{fontSize:60,color:"secondary.main"}}/>,
            action:()=>{handlelogout},
            Textbtn:"Logout",
        },
    ];

    return(
        <Container maxWidth="lg">
            <Box sx={{mt:4,mb:4}}>
                <Typography variant="h1" sx={{color:"gray"}}>Collab Genius</Typography>
                <Typography variant="h1" sx={{color:"gray"}}>Your Project Management Dashboard</Typography>
                <Grid container spacing={4}>
                    {cards.map((card,index)=>(
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{display:"flex",height:"100%", flexDirection:"column"}}>
                                <CardContent sx={{textAlign:"center"}}>
                                 {card.icon}
                                 <Typography variant="h5" sx={{mt:2}}>{card.title}</Typography>
                                 <Typography variant="body2">{card.Description}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button variant="outlined" sx={{color:"gray"}} onClick={card.action}>{card.Textbtn}</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    )
}