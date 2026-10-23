import * as categoriaDiagnostica from "./categoriaDiagnosticaApi";
import * as condicionMedica from "./condicionMedicaApi";
import * as estadoCivil from "./estadoCivilApi";
import * as nivelConsistencia from "./nivelConsistenciaApi";
import * as nivelEscolaridad from "./nivelEscolaridadApi";
import * as nivelRiesgo from "./nivelRiesgoApi";
import * as nivelSeveridadAlergia from "./nivelSeveridadAlergiaApi";
import * as tipoIntervencion from "./tipoIntervencionApi";
import * as tipoPrueba from "./tipoPruebaApi";
import * as tipoRiesgo from "./tipoRiesgoApi";
import * as tipoSesion from "./tipoSesionApi";
import * as tipoSustanciaAlergena from "./tipoSustanciaAlergenaApi";
import * as categoriaCriterioClinico from "./categoriaCriterioClinicoApi";
import type { BasicCatalogId } from "../basicCatalogs";
import type { Request, Response } from "../types/catalogDTOs.types";

interface CatalogApi {
  getAll: () => Promise<Response[]>;
  getById: (id: number) => Promise<Response>;
  create: (request: Request) => Promise<Response>;
  update: (id: number, request: Request) => Promise<Response>;
}

export const basicCatalogApi = {
  "categoria-diagnostica": categoriaDiagnostica,
  "condicion-medica": condicionMedica,
  "estado-civil": estadoCivil,
  "nivel-consistencia": nivelConsistencia,
  "nivel-escolaridad": nivelEscolaridad,
  "nivel-riesgo": nivelRiesgo,
  "nivel-severidad-alergia": nivelSeveridadAlergia,
  "tipo-intervencion": tipoIntervencion,
  "tipo-prueba": tipoPrueba,
  "tipo-riesgo": tipoRiesgo,
  "tipo-sesion": tipoSesion,
  "tipo-sustancia-alergena": tipoSustanciaAlergena,
  "categoria-criterio-clinico": categoriaCriterioClinico,
} satisfies Record<BasicCatalogId, CatalogApi>;
