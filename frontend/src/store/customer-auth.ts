import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/data/auth-repository";

type AsyncState = "idle" | "sending" | "sent" | "error";

export type CustomerAuthState = {
  status: "checking" | "anonymous" | "authenticated";
  user: AuthUser | null;
  error: string | null;
  passwordReset: { status: AsyncState; email: string };
  verification: { status: AsyncState };
};

const initialState: CustomerAuthState = {
  status: "checking",
  user: null,
  error: null,
  passwordReset: { status: "idle", email: "" },
  verification: { status: "idle" },
};

const customerAuthSlice = createSlice({
  name: "customerAuth",
  initialState,
  reducers: {
    authChecking(state) {
      state.status = "checking";
      state.error = null;
    },
    authAnonymous(state) {
      state.status = "anonymous";
      state.user = null;
      state.error = null;
    },
    authAuthenticated(state, action: PayloadAction<AuthUser>) {
      state.status = "authenticated";
      state.user = action.payload;
      state.error = null;
      if (action.payload.emailVerified) state.verification.status = "idle";
    },
    authFailed(state, action: PayloadAction<string>) {
      state.status = "anonymous";
      state.user = null;
      state.error = action.payload;
    },
    signedOut(state) {
      state.status = "anonymous";
      state.user = null;
      state.error = null;
    },
    passwordResetSending(state, action: PayloadAction<string>) {
      state.passwordReset = { status: "sending", email: action.payload };
    },
    passwordResetSent(state, action: PayloadAction<string>) {
      state.passwordReset = { status: "sent", email: action.payload };
    },
    passwordResetFailed(state) {
      state.passwordReset.status = "error";
    },
    clearPasswordReset(state) {
      state.passwordReset = { status: "idle", email: "" };
    },
    verificationSending(state) {
      state.verification.status = "sending";
    },
    verificationSent(state) {
      state.verification.status = "sent";
    },
    verificationFailed(state) {
      state.verification.status = "error";
    },
  },
});

export const {
  authChecking,
  authAnonymous,
  authAuthenticated,
  authFailed,
  signedOut,
  passwordResetSending,
  passwordResetSent,
  passwordResetFailed,
  clearPasswordReset,
  verificationSending,
  verificationSent,
  verificationFailed,
} = customerAuthSlice.actions;

export const customerAuthReducer = customerAuthSlice.reducer;
