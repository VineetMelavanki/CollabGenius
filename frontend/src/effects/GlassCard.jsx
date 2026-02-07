import { Paper } from "@mui/material";

export default function GlassCard({ children, sx }) {
  return (
    <Paper
      elevation={0}
      sx={{
        backdropFilter: "blur(16px)",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 4,
        p: 4,
        color: "white",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          background: "rgba(255,255,255,0.18)",
        },
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}
