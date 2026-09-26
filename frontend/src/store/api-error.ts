export function apiErrorMessage(reason: unknown, fallback: string) {
  if (reason && typeof reason === "object" && "data" in reason) {
    const data = (reason as { data?: unknown }).data;
    if (data && typeof data === "object" && "error" in data) {
      const error = (data as { error?: { message?: unknown } }).error;
      if (typeof error?.message === "string") return error.message;
    }
  }
  if (reason instanceof Error) return reason.message;
  return fallback;
}
