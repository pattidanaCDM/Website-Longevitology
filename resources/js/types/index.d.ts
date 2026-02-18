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
