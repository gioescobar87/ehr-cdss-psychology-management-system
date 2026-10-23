import type {
  NavigationModule,
  NavigationOption,
} from "../navigation/navigation.types";

export const BASIC_CATALOG_PATH = "/administration/basic-catalog";

export const basicCatalogs = [
  { id: "categoria-diagnostica", nombre: "Categoría diagnóstica" },
  { id: "condicion-medica", nombre: "Condición médica" },
  { id: "estado-civil", nombre: "Estado civil" },
  { id: "nivel-escolaridad", nombre: "Nivel de escolaridad" },
  { id: "nivel-riesgo", nombre: "Nivel de riesgo" },
  { id: "nivel-severidad-alergia", nombre: "Nivel de severidad de alergia" },
  { id: "tipo-intervencion", nombre: "Tipo de intervención" },
  { id: "tipo-riesgo", nombre: "Tipo de riesgo" },
  { id: "tipo-sesion", nombre: "Tipo de sesión" },
  { id: "tipo-sustancia-alergena", nombre: "Tipo de sustancia alérgena" },
  { id: "categoria-criterio-clinico", nombre: "Categoría de criterio clínico" },
] as const;

export type BasicCatalog = (typeof basicCatalogs)[number];
export type BasicCatalogId = BasicCatalog["id"];

export function getAvailableBasicCatalogs() {
  return [...basicCatalogs];
}

export function getBasicCatalogQueryKey(id: BasicCatalogId) {
  return [id] as const;
}

export function groupBasicCatalogNavigation(navigation: NavigationModule[]) {
  const catalogRoutes = new Set(
    basicCatalogs.map((catalog) => `/administration/${catalog.id}`),
  );
  let inserted = false;

  function group(options: NavigationOption[]): NavigationOption[] {
    return options.flatMap((option) => {
      if (catalogRoutes.has(option.rutaFrontend)) {
        if (inserted) {
          return [];
        }
        inserted = true;
        return [
          {
            ...option,
            nombre: "Catálogos básicos",
            rutaFrontend: BASIC_CATALOG_PATH,
            children: [],
          },
        ];
      }
      return [{ ...option, children: group(option.children) }];
    });
  }

  return navigation.map((module) => ({
    ...module,
    opciones: group(module.opciones),
  }));
}
