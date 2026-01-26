import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Box,Typography,Paper,Button,TextField} from "@mui/material"

export default function Register() {
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setmessage] = useState(null);
  const [error, seterror] = useState(null);

  const handlechange = (e) => {
    setformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitchange = async (e) => {
    e.preventDefault();
    setmessage(null);
    seterror(null);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/User/register",
        formdata
      );
      setmessage(response.data.msg || "Registered Successfully");
      localStorage.setItem('token',response.data.token);
      setTimeout(() => navigate("/login"), 1500); 
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.msg || "Registration failed");
      } else {
        seterror("Network error");
      }
    }
  };

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
          width: 400,
          p: "3rem 3.5rem",
          borderRadius: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 25px rgba(0, 0, 0, 0.3)",
          textAlign: "center",
          color: "#fff",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Title */}
        <Typography variant="h4" fontWeight={700} mb={1}>
          Register
        </Typography>

        <Typography sx={{ opacity: 0.8, mb: 3 }}>
          Create an account to get started!
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
        <Box component="form" onSubmit={submitchange}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formdata.name}
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
            label="Email"
            type="email"
            name="email"
            value={formdata.email}
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
            label="Password"
            type="password"
            name="password"
            value={formdata.password}
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
            Register
          </Button>
        </Box>

        {/* Switch */}
        <Typography sx={{ mt: 2, opacity: 0.9 }}>
          Already have an account?{" "}
          <Box
            component="span"
            sx={{
              color: "#0096FF",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
}
