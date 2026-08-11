import { z } from "zod";

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "La contraseña actual es obligatoria"),
        newPassword: z
            .string()
            .min(1, "La nueva contraseña es obligatoria")
            .regex(
                strongPasswordRegex,
                "La contraseña debe contener por lo menos una mayúcula, una minúscula, un número y un caracter especial."
            ),
        confirmPassword: z
            .string()
            .min(1, "Por favor confirma la nueva contraseña")
    })
    .refine(
        data => data.newPassword === data.confirmPassword,
        {
            message: "Las contraseñas no coinciden",
            path: ["confirmPassword"]
        }
    );

export type ChangePasswordFormData =
    z.infer<typeof changePasswordSchema>;