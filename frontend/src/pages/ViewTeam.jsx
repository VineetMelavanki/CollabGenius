import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function ViewTeam() {
  const [error, seterror] = useState("");
  const [team, setteam] = useState([]); // ✅ array
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const viewteam = async () => {
      try {
        setloading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          seterror("Please log in again");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/Team/View-Team",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setteam(response.data.team); // must be array
        seterror("");
      } catch (error) {
        seterror(
          error.response?.data?.msg || "Internal server error"
        );
        setteam([]);
      } finally {
        setloading(false);
      }
    };

    viewteam();
  }, []);

  return (
    <Box sx={{display:'flex', justifyContent:"flex-start",alignItems:"flex-start",minHeight:"100vh",minWidth:"100vw"}}>
        <Paper  elevation={0} sx={{
          width:400,
          p:"3.5rem 3rem",
          alignItems:"flex-start",      
        }}>
         {error && <Typography variant="h6" sx={{color:"red"}}>{error}</Typography>}
         {loading && <Typography variant="h6" sx={{color:"red"}}>Please wait Data is fetching</Typography>}
         {!error && !loading && team &&
         <>
         <Typography variant="h6">Team name : {team.name}</Typography>
         <Typography variant="h6">Team Onwer Id :{team.owner}</Typography>
         </>}
  
        </Paper>
    </Box>
  );
}
