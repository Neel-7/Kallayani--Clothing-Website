import type { AuthRepository } from "./auth-repository";
import { firebaseAuthRepository } from "./firebase-auth-repository";

export const authRepository: AuthRepository = firebaseAuthRepository;
