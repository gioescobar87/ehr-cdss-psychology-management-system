import { z } from "zod";

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(1, "New password is required")
            .regex(
                strongPasswordRegex,
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
            ),
        confirmPassword: z
            .string()
            .min(1, "Please confirm your new password")
    })
    .refine(
        data => data.newPassword === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"]
        }
    );

export type ChangePasswordFormData =
    z.infer<typeof changePasswordSchema>;