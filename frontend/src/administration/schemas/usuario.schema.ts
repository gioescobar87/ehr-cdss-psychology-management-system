import { z } from "zod";

export const schema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "El usuario debe tener al menos 3 caracteres.")
    .max(50, "El usuario no puede superar los 50 caracteres."),

  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(100, "El nombre no puede superar los 100 caracteres."),

  apellido: z
    .string()
    .trim()
    .min(1, "El apellido es obligatorio.")
    .max(100, "El apellido no puede superar los 100 caracteres."),

  correo: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio.")
    .email("Ingrese un correo electrónico válido."),
});

export type FormValues = z.infer<typeof schema>;
