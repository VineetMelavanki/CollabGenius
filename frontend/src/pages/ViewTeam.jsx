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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {loading && <CircularProgress />}

      {error && !loading && (
        <Typography color="error">{error}</Typography>
      )}

      {!loading &&
        !error &&
        team.map((t) => (
          <Paper
            elevation={0}
            key={t._id}
            sx={{ p: "1rem" }}
          >
            <Typography variant="h6">
              Team name : {t.name}
            </Typography>
          </Paper>
        ))}
    </Box>
  );
}
