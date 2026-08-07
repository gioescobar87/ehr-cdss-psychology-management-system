import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SettingsIcon from "@mui/icons-material/Settings";

export const iconMap = {
    Dashboard: DashboardIcon,
    People: PeopleIcon,
    CalendarMonth: CalendarMonthIcon,
    Psychology: PsychologyIcon,
    Assessment: AssessmentIcon,
    MedicalServices: MedicalServicesIcon,
    Settings: SettingsIcon
} as const;

export type IconName = keyof typeof iconMap;