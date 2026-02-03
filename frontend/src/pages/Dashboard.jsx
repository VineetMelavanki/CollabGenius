
import{Button,Box,Card,CardActions,CardContent,Typography,Grid}from "@mui/material"
import{Add, Celebration} from "@mui/icons-material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const navigate=useNavigate();
  return (
    <Box sx={{display:"flex",minWidth:"100vw"}}>
    <Grid container spacing={3} sx={{p:10}}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{width:250,p:4,height:250}}>
          <CardContent>
            <Button onClick={()=>navigate("/View-Profile")}></Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    </Box> 
  );
}
