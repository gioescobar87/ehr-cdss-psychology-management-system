import { Card, CardContent, Typography, Stack } from "@mui/material";
import type { UserProfile } from "../types/auth.types";

interface Props { user: UserProfile; }

export default function ProfileCard({
    user
}: Props) {
    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h5">
                        My Profile
                    </Typography>
                    <Typography>
                        <strong>Usuario:</strong>{" "}
                        {user.username}
                    </Typography>
                    <Typography>
                        <strong>Name:</strong>{" "}
                        {user.nombre} {user.apellido}
                    </Typography>
                    <Typography>
                        <strong>Email:</strong>{" "}
                        {user.correo}
                    </Typography>
                    <Typography>
                        <strong>Roles:</strong>{" "}
                        {user.roles.join(", ")}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    )
}