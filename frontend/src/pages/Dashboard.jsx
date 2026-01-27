
import{Button,Box,Card,CardActions,CardContent,Typography}from "@mui/material"
import{Add, Celebration} from "@mui/icons-material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const navigate=useNavigate();
  return (
    <Box sx={{flexWrap:"wrap",display:'flex',gap:2}}>
      <Card sx={{width:250}}>
       <CardContent sx={{justifyContent:"center",textAlign:"center"}}>
        <Add/>
        <Typography sx={{mt:1}}>
          Create your Team
        </Typography>
        <CardActions sx={{justifyContent:"center",textAlign:"center"}}>
          <Button sx={{color:"red"}} onClick={()=>navigate("/CreateTeam")}>
           Create
          </Button>
        </CardActions>
       </CardContent>
      </Card>
      <Card sx={{width:250}}>
       <CardContent sx={{justifyContent:"center",textAlign:"center"}}>
        <VisibilityIcon/>
        <Typography sx={{mt:1}}>
         View your profile 
        </Typography>
       
       <CardActions sx={{justifyContent:'center',alignItems:"center"}}>
        <Button sx={{color:"red"}} onClick={()=>navigate("/View-profile")}>
          View
          </Button>
       </CardActions>
       </CardContent>
      </Card>
    </Box>
  );
}
