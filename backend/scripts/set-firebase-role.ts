import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
const [, , email, requestedRole] = process.argv;
const allowedRoles = new Set(["admin", "manager", "customer"]);

if (!projectId) throw new Error("VITE_FIREBASE_PROJECT_ID is missing.");
if (!email || !requestedRole || !allowedRoles.has(requestedRole)) {
  throw new Error("Usage: npm run firebase:set-role -- user@example.com admin|manager|customer");
}

const app =
  getApps()[0] ??
  initializeApp({
    ...(process.env.FIREBASE_AUTH_EMULATOR_HOST ? {} : { credential: applicationDefault() }),
    projectId,
  });

const auth = getAuth(app);
const user = await auth.getUserByEmail(email);

console.log(`Project: ${projectId}`);
console.log(`User: ${user.email ?? "(no email)"}`);
console.log(`UID: ${user.uid}`);
console.log(`Current claims: ${JSON.stringify(user.customClaims ?? {})}`);
console.log(`Requested role: ${requestedRole}`);

const prompt = createInterface({ input, output });
const answer = await prompt.question('Type "assign" to update this user: ');
prompt.close();

if (answer.trim().toLowerCase() !== "assign") {
  console.log("No changes made.");
  process.exit(0);
}

await auth.setCustomUserClaims(user.uid, {
  ...(user.customClaims ?? {}),
  role: requestedRole,
});

console.log(`Assigned role '${requestedRole}' to ${user.email ?? user.uid}.`);
console.log("The user must sign in again or refresh their ID token before the role takes effect.");
