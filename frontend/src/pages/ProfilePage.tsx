import { Box, Typography } from "@mui/material";
import { useAuth } from "../auth/useAuth";
import ProfileCard from "../features/auth/components/ProfileCard";

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <Box>
            <Typography
                variant="h4"
                mb={3}
            >
                Mi Perfil
            </Typography>
            <ProfileCard user={user} />
        </Box>
    );
}