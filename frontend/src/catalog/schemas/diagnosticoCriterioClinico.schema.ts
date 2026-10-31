import { z } from "zod";

export const diagnosticoCriterioClinicoSchema = z.object({
  diagnosticoId: z.number().int().positive("Seleccione un diagnóstico."),
  criterioClinicoId: z
    .number()
    .int()
    .positive("Seleccione un criterio clínico."),
  referenciaRegla: z
    .string()
    .max(1, "La referencia no puede exceder 1 carácter.")
    .optional()
    .or(z.literal("")),
});

export type DiagnosticoCriterioClinicoFormValues = z.infer<
  typeof diagnosticoCriterioClinicoSchema
>;
