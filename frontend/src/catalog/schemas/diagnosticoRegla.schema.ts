import { z } from "zod";

export const diagnosticoReglaSchema = z.object({
  diagnosticoId: z.number().int().positive("Seleccione un diagnóstico."),
  tipoReglaId: z.number().int().positive("Seleccione un tipo de regla."),
  valorRegla: z.number().int("El valor debe ser un número entero."),
  operadorId: z.number().int().positive("Seleccione un operador."),
  parametro: z.string().optional(),
});

export type DiagnosticoReglaFormValues = z.infer<typeof diagnosticoReglaSchema>;
