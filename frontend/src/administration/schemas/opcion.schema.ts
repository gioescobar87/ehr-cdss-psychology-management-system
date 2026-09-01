import { z } from "zod";

export const schema = z.object({
  moduloId: z.number().int().positive("Debe seleccionar un módulo."),

  opcionPadreId: z.number().int().positive().nullable(),

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

  rutaFrontend: z
    .string()
    .trim()
    .min(1, "La ruta del frontend es obligatoria.")
    .max(150, "La ruta no puede superar los 150 caracteres.")
    .regex(/^\//, "La ruta debe iniciar con '/'."),

  componente: z.string().trim().max(150).optional().or(z.literal("")),

  icono: z.string().trim().max(100).optional().or(z.literal("")),

  orden: z.coerce.number().int().min(0, "El orden debe ser mayor o igual a 0."),

  visibleMenu: z.boolean(),

  requiereAutenticacion: z.boolean(),

  esMenuPrincipal: z.boolean(),
});

export type FormInput = z.input<typeof schema>;
export type FormValues = z.output<typeof schema>;
