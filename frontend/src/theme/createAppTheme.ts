// src/theme/createAppTheme.ts

import { createTheme } from "@mui/material/styles";
import type { AppThemeSettings } from "./appThemeSettings";

export function createAppTheme(settings: AppThemeSettings) {
    return createTheme({
        palette: {
            mode: settings.mode,

            primary: {
                main: settings.primaryColor
            },

            secondary: {
                main: settings.secondaryColor
            },

            success: {
                main: settings.successColor
            },

            warning: {
                main: settings.warningColor
            },

            error: {
                main: settings.errorColor
            },

            info: {
                main: settings.infoColor
            },

            background: {
                default: settings.backgroundColor,
                paper: settings.paperColor
            },

            text: {
                primary: settings.textPrimaryColor,
                secondary: settings.textSecondaryColor
            },

            divider: settings.dividerColor
        },

        shape: {
            borderRadius: settings.borderRadius
        },

        typography: {
            fontFamily: settings.fontFamily,

            h1: {
                fontWeight: 700
            },

            h2: {
                fontWeight: 700
            },

            h3: {
                fontWeight: 600
            },

            h4: {
                fontWeight: 600
            },

            h5: {
                fontWeight: 600
            },

            h6: {
                fontWeight: 600
            },

            button: {
                textTransform: "none",
                fontWeight: 600
            }
        },

        components: {
            MuiButton: {
                defaultProps: {
                    disableElevation: true
                }
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none"
                    }
                }
            }
        }
    });
}