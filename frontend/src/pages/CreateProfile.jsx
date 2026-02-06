import { useState } from "react";
import axios from "axios";
import { TextField,Box,Paper,Typography,Button, MenuItem } from "@mui/material";
export default function CreateProfile(){
    const[formdata,setformdata]=useState({
        name:"",
        Bio:"",
        skills:"",
        skillevel:"",
        github_link:"",
    });
    const[file,setfile]=useState([]);
    const[error,seterror]=useState("");
    const handlefilechange=(e)=>{
      const requiredfile=e.target.files[0];
      setfile(requiredfile);
    }
    
    const[msg,setmsg]=useState("");
    const handlechange=(e)=>{
        setformdata((prev)=>({...prev,[e.target.name]:e.target.value}));
    };
    const handleSubmit=async (e)=>{
        try{
           e.preventDefault();
        seterror("");
        setmsg("");

        const token=localStorage.getItem("token");
        if(!token)
        {
            seterror("Invalid token");
            return;
        }
        if(!file)
        {
          seterror("Please upload a profile picture");
          return;
        }
        if(!formdata.name || !formdata.Bio || !formdata.skills || !formdata.github_link)
        {
          seterror("All fields are required");
          return;
        }
        const data=new FormData();
        data.append("name",formdata.name);
        data.append("Bio",formdata.Bio);
        data.append("skills",formdata.skills);
        data.append("skillevel",formdata.skillevel);
        data.append("github_link",formdata.github_link);
        data.append("photo",file);
        const response=await axios.post("http://localhost:8000/api/Profile/Create-Profile",data,
          {
            headers:{
              Authorization:`Bearer ${token}`,
              
            }
          }
        );
        
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
          backdropFilter: "blur(8px)",
        }}>
     <Typography variant="h4" fontWeight={700} mb={1}>
          Create Profile
        </Typography>
      {error && (
          <Typography sx={{ color: "#ff6961", mb: 1 }}>
            {error}
      {msg &&(
       <Typography sx={{color:"green"}}>{msg}</Typography>
      )}
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
            label="Name"
            type="text"
            name="name"
            value={formdata.name}
            onChange={handlechange}
            variant="filled"
            sx={{
              backgroundColor:"white",
              mb:2,
            }}
          />
          <TextField
            fullWidth
            label="Bio"
            type="text"
            name="Bio"
            value={formdata.Bio}
            onChange={handlechange}
            variant="filled"
            sx={{
              backgroundColor:"white",
              mb:2,
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
            sx={{
              backgroundColor:"white",
              mb:2
            }}
          />
          <TextField  select
  fullWidth
  label="Skill Level"
  name="skillevel"
  value={formdata.skillevel}
  onChange={handlechange}
  variant="filled"
  sx={{backgroundColor:"white",mb:2}}>
          <MenuItem value="Beginner">Beginner</MenuItem>
          <MenuItem value="Intermediate">Intermediate</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
          </TextField>
            
          <TextField
          fullWidth
            label="github_link"
            type="text"
            name="github_link"
            value={formdata.github_link}
            onChange={handlechange}
            variant="filled"
            sx={{backgroundColor:"white",
              mb:2
            }}
            />
            <Box sx={{ mb: 2 }}>
             
            <Box sx={{display:"flex",flexDirection:"column"}}>
              <Typography variant="h7" sx={{mb:2}}>Upload your profile picture</Typography>
               <input type="file" accept="image/*" onChange={handlefilechange} style={{marginBottom:"1rem"}}/>
            </Box>
             
           
         
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
        </Box>
    </Paper>
       </Box>
    );
}