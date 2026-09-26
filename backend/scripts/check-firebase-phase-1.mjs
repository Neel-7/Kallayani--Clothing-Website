import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "../..");
const expectedProjects = {
  default: "kallayani-storefront-dev",
  dev: "kallayani-storefront-dev",
  staging: "kallayani-storefront-staging",
};

let failures = 0;

function pass(message) {
  console.log(`PASS  ${message}`);
}

function fail(message) {
  failures += 1;
  console.error(`FAIL  ${message}`);
}

function check(condition, message) {
  if (condition) pass(message);
  else fail(message);
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(projectRoot, relativePath), "utf8"));
}

const firebaseConfig = readJson("firebase.json");
check(firebaseConfig.firestore?.rules === "firestore.rules", "Firestore rules are registered.");
check(
  firebaseConfig.firestore?.indexes === "firestore.indexes.json",
  "Firestore indexes are registered.",
);
check(firebaseConfig.storage?.rules === "storage.rules", "Storage rules are registered.");

for (const file of ["firestore.rules", "firestore.indexes.json", "storage.rules"]) {
  check(existsSync(resolve(projectRoot, file)), `${file} exists.`);
}

const aliases = readJson(".firebaserc.example").projects ?? {};
for (const [alias, projectId] of Object.entries(expectedProjects)) {
  check(aliases[alias] === projectId, `Firebase alias '${alias}' targets ${projectId}.`);
}
check(aliases.dev !== aliases.staging, "Development and staging use different Firebase projects.");

const localRcPath = resolve(projectRoot, ".firebaserc");
if (existsSync(localRcPath)) {
  const localAliases = readJson(".firebaserc").projects ?? {};
  for (const [alias, projectId] of Object.entries(expectedProjects)) {
    check(localAliases[alias] === projectId, `Local alias '${alias}' targets ${projectId}.`);
  }
} else {
  console.log(
    "INFO  .firebaserc is not present; copy .firebaserc.example after Firebase CLI login.",
  );
}

const envPath = resolve(projectRoot, "frontend/.env.local");
if (existsSync(envPath)) {
  const envText = readFileSync(envPath, "utf8");
  const projectId = envText.match(/^VITE_FIREBASE_PROJECT_ID=(.+)$/m)?.[1]?.trim();
  check(
    projectId === expectedProjects.dev || projectId === expectedProjects.staging,
    "The local frontend targets an approved non-production Firebase project.",
  );
} else {
  console.log(
    "INFO  .env.local is not present; create it from .env.example for local development.",
  );
}

if (failures > 0) {
  console.error(`\nPhase 1 preflight failed with ${failures} issue${failures === 1 ? "" : "s"}.`);
  process.exitCode = 1;
} else {
  console.log("\nRepository-side Phase 1 preflight passed.");
  console.log(
    "Cloud project, billing, region, Authentication, domain, and deployment checks remain.",
  );
}
