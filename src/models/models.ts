export interface RowData {
    user: string;
    interactions: number;
}

export interface AuthCredentials {
    login_id: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface ChannelResponse {
        id: string,
}

export interface UserResponse {
    id: string,
    email: string
}

export interface PostResponse {
    id: string,
    user_id: string,
 }