import { useState } from "react";
import axios from "axios";
import { TextField,Box,Paper,Typography,Button } from "@mui/material";
export default function CreateProfile(){
    const[formdata,setformdata]=useState({
        Bio:"",
        skills:"",
        skillevel:"",
        github_link:"",
    });
    const[error,seterror]=useState("");
    const[msg,setmsg]=useState("");

    const handlechange=(e)=>{
        setformdata((prev)=>({...prev,[e.target.name]:e.target.value}));
    };
    const handleSubmit=async (e)=>{
        try{
           e.preventDefault();
        seterror("");
        setmsg("");
        const response=await axios.post("http://localhost:8000/api/Profile/Create-Profile",formdata);
        const token=localStorage.getItem("token");
        if(!token)
        {
            seterror("Invalid token");
        }
        localStorage.setItem("token");
        setmsg(response.data.msg||"Profile Created Successfully");
        }catch(error)
        {
            if(error.response)
            {
                seterror(error.response.data.msg ||"Profile cannot be Created")
            }else
            {
                seterror("Internal server error");
            }
        }
       
    }
    return(
       <Box
       sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #00172D 0%, #003566 100%)",
        fontFamily: "Poppins, sans-serif",
      }}>
    <Paper
    elevation={0}
        sx={{
          width: 400,
          p: "3rem 3.5rem",
          borderRadius: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 25px rgba(0, 0, 0, 0.3)",
          textAlign: "center",
          color: "#fff",
          backdropFilter: "blur(8px)",
        }}>
     <Typography variant="h4" fontWeight={700} mb={1}>
          Create Profile
        </Typography>
      {error && (
          <Typography sx={{ color: "#ff6961", mb: 1 }}>
            {error}
          </Typography>
        )}
     {msg&& (
          <Typography sx={{ color: "#00ff9d", mb: 1 }}>
            {msg}
          </Typography>
        )}
         <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Bio"
            type="text"
            name="Bio"
            value={formdata.Bio}
            onChange={handlechange}
            variant="filled"
            sx={{ mb: 2 }}
            InputProps={{
              sx: {
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "10px",
                color: "#fff",
              },
            }}
            InputLabelProps={{
              sx: { color: "rgba(255,255,255,0.6)" },
            }}
          />

          <TextField
            fullWidth
            label="skills"
            type="text"
            name="skills"
            value={formdata.skills}
            onChange={handlechange}
            variant="filled"
            sx={{ mb: 2 }}
            InputProps={{
              sx: {
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "10px",
                color: "#fff",
              },
            }}
            InputLabelProps={{
              sx: { color: "rgba(255,255,255,0.6)" },
            }}
          />
          <TextField
          fullWidth
            label="skillevel"
            type="text"
            name="skillevel"
            value={formdata.skillevel}
            onChange={handlechange}
            variant="filled"
            sx={{ mb: 2 }}
            InputProps={{
              sx: {
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "10px",
                color: "#fff",
              },
            }}
            InputLabelProps={{
              sx: { color: "rgba(255,255,255,0.6)" },
            }}/>
            
          <TextField
          fullWidth
            label="github-link"
            type="text"
            name="github-link"
            value={formdata.github_link}
            onChange={handlechange}
            variant="filled"
            sx={{ mb: 2 }}
            InputProps={{
              sx: {
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "10px",
                color: "#fff",
              },
            }}
            InputLabelProps={{
              sx: { color: "rgba(255,255,255,0.6)" },
            }}/>
            
          <Button
            type="submit"
            fullWidth
            sx={{
              mt: 1,
              py: 1.2,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: "10px",
              backgroundColor: "#0096FF",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#0077cc",
                transform: "scale(1.02)",
              },
            }}
          >
            Create Profile
          </Button>
        </Box>
    </Paper>
       </Box>
    );
}