import { Model, Optional } from 'sequelize';

// Base interface for User attributes
export interface UserAttributes {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin";
    isActive: boolean;
    lastLogin?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

// Interface for User Model, extending Sequelize Model
export interface UserModel extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

// For creating a new user - all the fields that can be optional during creation
export type UserCreationAttributes = Optional<UserAttributes, 
    'id' | 
    'role' | 
    'isActive' | 
    'lastLogin' | 
    'createdAt' | 
    'updatedAt'
>;

// For API input - only the fields that should be provided by the client
export interface UserInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

// For API output - excluding password and making timestamps required
export interface UserOutput extends Omit<UserAttributes, 'password'> {
    createdAt: Date;
    updatedAt: Date;
}

// For auth responses
export interface AuthResponse {
    token: string;
    user: UserOutput;
} 