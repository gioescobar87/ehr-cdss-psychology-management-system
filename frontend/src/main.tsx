import ReactDOM from "react-dom/client";

import App from "./App";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "./theme/createAppTheme";
import { defaultThemeSettings } from "./theme/defaultThemeSettings";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/queryClient";

const theme = createAppTheme(defaultThemeSettings);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);