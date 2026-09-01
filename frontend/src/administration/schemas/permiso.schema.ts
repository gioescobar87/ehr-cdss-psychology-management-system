import { z } from "zod";

export const schema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(100, "El nombre no puede superar los 100 caracteres."),

  descripcion: z
    .string()
    .trim()
    .max(500, "La descripción no puede superar los 500 caracteres.")
    .optional()
    .or(z.literal("")),
});

export type FormValues = z.output<typeof schema>;
export type FormInput = z.input<typeof schema>;