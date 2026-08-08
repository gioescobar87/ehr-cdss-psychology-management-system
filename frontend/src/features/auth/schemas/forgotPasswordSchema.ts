import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "El correo electrónico es obligatorio")
        .email("Ingrese una dirección de correo electrónico válido")
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;