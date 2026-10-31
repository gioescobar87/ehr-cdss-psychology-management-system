export const DIAGNOSTIC_CATALOG_PATH = "/administration/diagnostic-catalog";

export const diagnosticCatalogs = [
  {
    id: "diagnostico-criterio-clinico",
    nombre: "Asociaciones diagnóstico-criterio clínico",
  },
  { id: "diagnostico-regla", nombre: "Reglas diagnósticas" },
  { id: "diagnostico", nombre: "Diagnósticos" },
  { id: "criterio-clinico", nombre: "Criterios clínicos" },
] as const;

export type DiagnosticCatalogId = (typeof diagnosticCatalogs)[number]["id"];

export const diagnosticCatalogQueryKey = (id: DiagnosticCatalogId) =>
  [id] as const;

export const ruleTypeOptions = [
  { id: 1, nombre: "BÁSICA" },
  { id: 2, nombre: "EXCLUSIÓN" },
] as const;

export const operatorOptions = [
  { id: 1, nombre: "=" },
  { id: 2, nombre: ">" },
  { id: 3, nombre: "<" },
] as const;

export type CatalogStatusFilter = "all" | "active" | "inactive";
