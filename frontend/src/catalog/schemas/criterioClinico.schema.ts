import { z } from "zod";

export const criterioClinicoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(200, "El nombre no puede superar los 200 caracteres."),
  descripcion: z.string().optional(),
  categoriaCriterioClinicoId: z
    .number()
    .int()
    .positive("Seleccione una categoría de criterio clínico."),
});

export type CriterioClinicoFormValues = z.infer<typeof criterioClinicoSchema>;
