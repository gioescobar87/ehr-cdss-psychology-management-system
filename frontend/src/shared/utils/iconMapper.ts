import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SettingsIcon from "@mui/icons-material/Settings";
import ShieldIcon from "@mui/icons-material/Shield";
import CategoryIcon from "@mui/icons-material/Category";
import WarningIcon from "@mui/icons-material/Warning";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import SchoolIcon from "@mui/icons-material/School";
import EventNoteIcon from "@mui/icons-material/EventNote";
import RuleIcon from "@mui/icons-material/Rule";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MedicationIcon from "@mui/icons-material/Medication";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";

export const iconMap = {
  dashboard: DashboardIcon,
  people: PeopleIcon,
  calendar_month: CalendarMonthIcon,
  psychology: PsychologyIcon,
  assessment: AssessmentIcon,
  medical_services: MedicalServicesIcon,
  settings: SettingsIcon,
  shield: ShieldIcon,
  category: CategoryIcon,
  warning: WarningIcon,
  crisis_alert: CrisisAlertIcon,
  health_and_safety: HealthAndSafetyIcon,
  school: SchoolIcon,
  event_note: EventNoteIcon,
  rule: RuleIcon,
  fact_check: FactCheckIcon,
  medication: MedicationIcon,
  person: PersonIcon,
  assignment: AssignmentIcon,
} as const;

export type IconName = keyof typeof iconMap;
