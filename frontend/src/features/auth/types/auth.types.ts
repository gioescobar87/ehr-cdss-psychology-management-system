export interface LoginRequest {

    username: string;

    password: string;

}

export interface LoginResponse {

    accessToken: string;

    refreshToken: string;

    tokenType: string;

}

export interface UserProfile {

    id: number;

    username: string;

    nombre: string;

    apellido: string;

    correo: string;
    
    roles: string[];
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}