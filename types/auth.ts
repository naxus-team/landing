import { type Role } from "./index";

export type AuthUser = {
  id:         string;
  email:      string;
  name:       string;
  avatar?:    string;
  role:       Role;
  provider:   "email" | "google" | "github";
  created_at: string;
};

export type AuthResponse = {
  user:         AuthUser;
  accessToken:  string;
  refreshToken: string;
};

export type LoginInput = {
  email:    string;
  password: string;
};

export type RegisterInput = {
  name:     string;
  email:    string;
  password: string;
};

export type OAuthProvider = "google" | "github";