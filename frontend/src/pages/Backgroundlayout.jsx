import { Box } from "@mui/material";

export default function BackgroundLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: `
          radial-gradient(circle at 20% 20%, rgba(0,150,255,0.25), transparent 40%),
          radial-gradient(circle at 80% 30%, rgba(0,255,200,0.18), transparent 45%),
          radial-gradient(circle at 50% 80%, rgba(140,0,255,0.25), transparent 50%),
          linear-gradient(135deg, #0f172a, #020617)
        `,
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: { xs: 2, md: 6 },
      }}
    >
      {children}
    </Box>
  );
}
