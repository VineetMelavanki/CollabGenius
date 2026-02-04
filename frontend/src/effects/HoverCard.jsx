import {Paper} from "@mui/material"
export default function HoverEfffect({children})
{
     return (
    <Paper
      elevation={4}
      sx={{
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
        }
      }}
    >
      {children}
    </Paper>
  );
}