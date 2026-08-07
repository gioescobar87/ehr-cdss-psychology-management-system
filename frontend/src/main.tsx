import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { createAppTheme } from "./theme/createAppTheme";
import { defaultThemeSettings } from "./theme/defaultThemeSettings";

import Provider from "./app/providers";
import App from "./App";

const theme = createAppTheme(defaultThemeSettings);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>
);