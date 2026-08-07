import type { IconName } from "../utils/iconMapper";

export interface NavigationOption {

    id: number;

    nombre: string;

    rutaFrontend: string;

    icono?: IconName;

    hijos: NavigationOption[];

}

export interface NavigationModule {

    id: number;

    nombre: string;

    icono?: string;

    orden: number;

    opciones: NavigationOption[];

}