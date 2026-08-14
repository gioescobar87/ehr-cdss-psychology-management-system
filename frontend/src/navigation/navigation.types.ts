import type { IconName } from "../shared/utils/iconMapper";

export interface NavigationOption {
  id: number;
  nombre: string;
  rutaFrontend: string;
  icono?: IconName;
  children: NavigationOption[];
}

export interface NavigationModule {
  id: number;
  nombre: string;
  icono?: IconName;
  orden: number;
  opciones: NavigationOption[];
}
