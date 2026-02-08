import{Button,Box,Card,CardActions,CardContent,Typography,Grid,Paper}from "@mui/material"
import{Add, Celebration} from "@mui/icons-material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useNavigate } from "react-router-dom";
import HoverEfffect from "../effects/HoverCard";

export default function Dashboard() {
  const navigate=useNavigate();
  return (
    
      <Box sx={{display:"flex",minWidth:"100vw",minHeight:"100vh",flexDirection:"column"}}>
      <Box sx={{textAlign:"center",mb:2}}>
         <Typography variant="h4" sx={{color:"black",mb:2}}>
           Welcome to the DashBoard
         </Typography>
         <Typography variant="h6" sx={{color:"blueviolet",mb:2}}>
            Access all the features below
         </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <HoverEfffect>
              <Paper sx={{
            width :400,
            p:"2rem 2rem",
            justifyContent:"center",
            textAlign:'center'
          }}>
          <Typography variant="h6" sx={{color:"black",mb:2}}>
            About Section
          </Typography>
          <Box sx={{textAlign:'center',gap:2}}>
            <Typography variant="h7"
            sx={{color:"black"}}>
              Click here :
            </Typography>
            <Button  onClick={()=>navigate("/About")}>
              About Section
            </Button>
          </Box>
          </Paper>
          </HoverEfffect>
      
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HoverEfffect>
              <Paper sx={{
            width:400,
            justifyContent:"center",
            textAlign:"center",
            p:"2rem 2rem",
            }}>
             <Typography variant="h6" sx={{color:"black",mb:2}}>
              Create Profile
             </Typography>
             <Box sx={{textAlign:"center",gap:2}}>
              <Typography variant="h7" sx={{color:"black"}}>
                Click here :
              </Typography>
              <Button  onClick={()=>navigate("/Create-Profile")}>
                Create Profile
              </Button>
             </Box>
            </Paper>
            </HoverEfffect>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HoverEfffect>
            <Paper sx={{
              width:400,
              justifyContent:"center",
              textAlign:"center",
              p:"2rem 2rem",
            }}>
            <Typography variant="h6" sx={{color:"black",mb:2}}>
             Create Project
            </Typography>
            <Box sx={{textAlign:"center",gap:2}}>
            <Typography variant="h7" sx={{color:"black"}}>
              Click here :
            </Typography>
           <Button onClick={()=>navigate("/Create-Project")}>
            Create Project
           </Button>
            </Box>
            </Paper>
          </HoverEfffect>
        </Grid>
      </Grid>
      </Box>
  );
}
