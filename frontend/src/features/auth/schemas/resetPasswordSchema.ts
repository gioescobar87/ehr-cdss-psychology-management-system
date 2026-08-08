import { z } from "zod";

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;

export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "La contraseña de be contener por lo menos 8 caracteres")
            .regex(
                strongPasswordRegex,
                "La contraseña debe contener por lo menos una mayúcula, una minúscula, un número y un caracter especial."
            ),
        confirmPassword: z
            .string()
            .min(1, "Por favor confirma tu contraseña")
    }).refine(
        data => data.newPassword === data.confirmPassword,
        {
            message: "Las contraseñas no coinciden",
            path: ["confirmPassword"]
        }
    );

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
