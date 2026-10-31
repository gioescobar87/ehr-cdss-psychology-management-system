import { z } from "zod";

export const diagnosticoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(200, "El nombre no puede superar los 200 caracteres."),
  codigoIcd: z
    .string()
    .max(50, "El código ICD no puede superar los 50 caracteres.")
    .optional(),
  descripcion: z.string().optional(),
  categoriaDiagnosticaId: z
    .number()
    .int()
    .positive("Seleccione una categoría diagnóstica."),
});

export type DiagnosticoFormValues = z.infer<typeof diagnosticoSchema>;
