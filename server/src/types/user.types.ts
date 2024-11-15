export interface UserAttributes {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin";
    isActive: boolean;
    lastLogin?: Date;
}

export interface UserInput extends Omit<UserAttributes, 'id' | 'role' | 'isActive' | 'lastLogin'> {}

export interface UserOutput extends Omit<UserAttributes, 'password'> {
    createdAt: Date;
    updatedAt: Date;
} 