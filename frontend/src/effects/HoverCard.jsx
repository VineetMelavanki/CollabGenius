import { Paper } from "@mui/material";
import { motion } from "framer-motion";

export default function HoverEffect({ children }) {
  return (
    <Paper
      component={motion.div}
      elevation={4}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      sx={{
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
      }}
    >
      {children}
    </Paper>
  );
}
