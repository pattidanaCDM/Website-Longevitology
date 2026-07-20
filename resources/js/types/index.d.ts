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

export interface BranchContact {
    id: number;
    branch_id: number;
    name: string;
    phone?: string;
}

export interface BranchPhoto {
    id: number;
    branch_id: number;
    photo_path: string;
}

export interface Branch {
    id: number;
    name: string;
    code?: string;
    address: string;
    map_url?: string;
    embed_map_url?: string;
    contacts?: BranchContact[];
    photos?: BranchPhoto[];
    schedule?: string;
    schedule_exceptions?: any[];
    active_announcements?: any[];
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
