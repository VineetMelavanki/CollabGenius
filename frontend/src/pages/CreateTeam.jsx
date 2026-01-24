import React,{useState} from "react";
import axios from 'axios';
import "./Auth.css";
import {Box,TextField,Paper,Typography,Button} from "@mui/material"
export default function CreateTeam()
{
    const[teamdata,setteamdata]=useState({
        name :'',
        owner :'',
        members :'',
        roles :'' 
    });
    const[message,setmessage]=useState(null);
    const[error,seterror]=useState(null);
    const handlechange =(e)=>{
        setteamdata(prev=>({...prev,[e.target.name] : e.target.value}));
    }
    const handlesubmit= async (e)=>{
        e.preventDefault();
        setmessage(null);
        seterror(null);
        
        try {
            const response= await axios.post("http://localhost:8000/api/dashboard/CreateTeam",teamdata);
            setmessage(response.data.msg || "Team created successfully");
        }catch(error)
        {
            if(error.response)
            {
                seterror(error.response.data.msg || "Team creation failed");
            }
            else
            {
                seterror("Network error");
            }
        }
    }
   return (
  <Box
    sx={{
      minHeight: "100vh",
      minWidth: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #00172D 0%, #003566 100%)",
      fontFamily: "Poppins, sans-serif",
    }}
  >
    <Paper
      elevation={0}
      sx={{
        width: 420,
        p: "3rem 3.5rem",
        borderRadius: "16px",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "0 4px 25px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        color: "#fff",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Heading */}
      <Typography variant="h4" fontWeight={700} mb={1}>
        Create Team
      </Typography>

      <Typography sx={{ opacity: 0.8, mb: 3 }}>
        Create and manage your team
      </Typography>

      {/* Messages */}
      {message && (
        <Typography sx={{ color: "#00ff9d", mb: 1 }}>
          {message}
        </Typography>
      )}

      {error && (
        <Typography sx={{ color: "#ff6961", mb: 1 }}>
          {error}
        </Typography>
      )}

      {/* Form */}
      <Box component="form" onSubmit={handlesubmit}>
        <TextField
          fullWidth
          label="Team Name"
          name="name"
          value={teamdata.name}
          onChange={handlechange}
          required
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
          label="Owner Name"
          name="owner"
          value={teamdata.owner}
          onChange={handlechange}
          required
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
          label="Members"
          name="members"
          value={teamdata.members}
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
          label="Roles"
          name="roles"
          value={teamdata.roles}
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
          Create Team
        </Button>
      </Box>
    </Paper>
  </Box>
);

}
