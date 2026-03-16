export interface Role {
    id: number;
    name: string;
    description?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role_id?: number;
    role?: Role;
    branch_id?: number;
    branch?: Branch;
}

export interface Branch {
    id: number;
    name: string;
    address: string;
    map_url?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

export interface Patient {
    id: number;
    name: string;
    gender: "male" | "female";
    birth_date: string;
    phone?: string;
    address?: string;
    initial_complaint: string;
    current_complaint?: string;
    cakra?: string;
    is_verified?: boolean;
    photo?: string;
    branches?: Branch[];
}

export interface Therapist {
    id: number;
    name: string;
    gender: "male" | "female";
    birth_date: string;
    phone?: string;
    address?: string;
    photo?: string;
    branches?: Branch[];
}
