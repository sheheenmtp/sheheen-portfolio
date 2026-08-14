import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import App from "./App.tsx";
import "./index.css";
import "./theme.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    enableColorScheme
    storageKey="sheheen-portfolio-theme"
  >
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
    <Analytics />
    <SpeedInsights />
  </ThemeProvider>,
);
