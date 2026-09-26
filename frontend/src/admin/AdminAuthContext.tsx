import {
  browserLocalPersistence,
  onIdTokenChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { adminAuth } from "@/lib/firebase-admin-client";
import type { StaffRole } from "@/types/admin";

type AdminSession = {
  user: User | null;
  role: StaffRole | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<StaffRole>;
  signOut(): Promise<void>;
  refreshClaims(): Promise<void>;
};

const AdminAuthContext = createContext<AdminSession | null>(null);

function asStaffRole(value: unknown): StaffRole | null {
  return value === "admin" || value === "manager" ? value : null;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<StaffRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onIdTokenChanged(adminAuth, async (nextUser) => {
        setUser(nextUser);
        if (!nextUser || nextUser.isAnonymous) {
          setRole(null);
          setLoading(false);
          return;
        }
        const token = await nextUser.getIdTokenResult();
        setRole(asStaffRole(token.claims.role));
        setLoading(false);
      }),
    [],
  );

  const value = useMemo<AdminSession>(
    () => ({
      user,
      role,
      loading,
      async signIn(email, password) {
        await setPersistence(adminAuth, browserLocalPersistence);
        const credential = await signInWithEmailAndPassword(adminAuth, email, password);
        const token = await credential.user.getIdTokenResult(true);
        const nextRole = asStaffRole(token.claims.role);
        setUser(credential.user);
        setRole(nextRole);
        if (!nextRole) throw new Error("This account does not have catalogue access.");
        return nextRole;
      },
      signOut: () => signOut(adminAuth),
      async refreshClaims() {
        if (!adminAuth.currentUser) return;
        const token = await adminAuth.currentUser.getIdTokenResult(true);
        setRole(asStaffRole(token.claims.role));
      },
    }),
    [loading, role, user],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error("useAdminAuth must be used within AdminAuthProvider.");
  return value;
}
