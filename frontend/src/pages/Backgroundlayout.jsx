import { Box } from "@mui/material";

export default function BackgroundLayout({ children }) {
  return (
    <Box
  sx={{
    minHeight: "100vh",
    background: `
      radial-gradient(1200px circle at 10% 10%, #e0e7ff 0%, transparent 40%),
      radial-gradient(1200px circle at 90% 20%, #fef3c7 0%, transparent 40%),
      linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)
    `,
    p: 3,
  }}
>
  {children}
</Box>

  );
}
