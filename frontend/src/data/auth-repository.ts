export type AuthUser = {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
};

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export interface AuthRepository {
  login(email: string, password: string): Promise<AuthUser>;
  register(input: RegisterInput): Promise<AuthUser>;
  loginWithGoogle(): Promise<AuthUser>;
  sendPasswordReset(email: string): Promise<void>;
  sendEmailVerification(): Promise<void>;
  refreshUser(): Promise<AuthUser>;
  updateName(firstName: string, lastName: string): Promise<AuthUser>;
  logout(): Promise<void>;
}
