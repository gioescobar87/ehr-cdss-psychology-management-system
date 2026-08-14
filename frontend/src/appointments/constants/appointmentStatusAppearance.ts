import { APPOINTMENT_STATUS } from "./appointmentStatus";

export interface AppointmentStatusAppearance {
  backgroundColor: string;
  borderColor: string;
  accentColor: string;
  hoverBackgroundColor: string;
}

export const APPOINTMENT_STATUS_APPEARANCE: Record<
  number,
  AppointmentStatusAppearance
> = {
  [APPOINTMENT_STATUS.SCHEDULED]: {
    backgroundColor: "grey.50",
    borderColor: "grey.300",
    accentColor: "grey.600",
    hoverBackgroundColor: "grey.100",
  },

  [APPOINTMENT_STATUS.CONFIRMED]: {
    backgroundColor: "success.50",
    borderColor: "success.200",
    accentColor: "success.700",
    hoverBackgroundColor: "success.100",
  },

  [APPOINTMENT_STATUS.CANCELLED]: {
    backgroundColor: "error.50",
    borderColor: "error.200",
    accentColor: "error.700",
    hoverBackgroundColor: "error.100",
  },

  [APPOINTMENT_STATUS.COMPLETED]: {
    backgroundColor: "primary.50",
    borderColor: "primary.200",
    accentColor: "primary.700",
    hoverBackgroundColor: "primary.100",
  },

  [APPOINTMENT_STATUS.NO_SHOW]: {
    backgroundColor: "warning.50",
    borderColor: "warning.200",
    accentColor: "warning.700",
    hoverBackgroundColor: "warning.100",
  },
};

export const DEFAULT_APPOINTMENT_STATUS_APPEARANCE: AppointmentStatusAppearance =
  {
    backgroundColor: "grey.50",
    borderColor: "grey.300",
    accentColor: "grey.600",
    hoverBackgroundColor: "grey.100",
  };
