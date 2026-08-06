/**
 * Diagnostic SMTP à lancer là où le problème se produit (typiquement dans le
 * conteneur de production) :
 *
 *   npx tsx scripts/test-smtp.ts
 *
 * Le formulaire de contact renvoie « Erreur d'authentification email » sans
 * jamais montrer la réponse du serveur SMTP. Ce script fait la même connexion
 * que la route /api/sendMail, mais affiche le code et la réponse brute, et
 * inspecte les valeurs d'environnement pour les pièges de copier-coller
 * (guillemets conservés par l'interface d'hébergement, espaces du mot de passe
 * applicatif Google, retour chariot en fin de valeur).
 *
 * Aucun secret n'est affiché en clair : seuls la longueur et un aperçu masqué.
 */
import nodemailer from "nodemailer";

/** Rend visibles les caractères qui cassent une authentification sans se voir. */
function describe(name: string, raw: string | undefined) {
  if (raw === undefined) {
    console.log(`  ${name.padEnd(11)} ABSENTE`);
    return;
  }

  const notes: string[] = [];
  if (raw !== raw.trim()) notes.push("espaces/retour chariot en début ou fin");
  if (/^["'][\s\S]*["']$/.test(raw.trim()))
    notes.push("entourée de guillemets (ils font partie de la valeur !)");
  if (/\s/.test(raw.trim())) notes.push("contient des espaces internes");

  const masked =
    name === "EMAIL_PASS"
      ? `${raw.slice(0, 2)}${"*".repeat(Math.max(raw.length - 4, 0))}${raw.slice(-2)}`
      : raw;

  console.log(
    `  ${name.padEnd(11)} ${masked}  (${raw.length} caractères)` +
      (notes.length ? `\n              /!\\ ${notes.join(" ; ")}` : "")
  );
}

const host = process.env.EMAIL_HOST;
const port = process.env.EMAIL_PORT;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

console.log("\n=== Variables d'environnement email ===");
describe("EMAIL_HOST", host);
describe("EMAIL_PORT", port);
describe("EMAIL_USER", user);
describe("EMAIL_PASS", pass);
describe("EMAIL_TO", process.env.EMAIL_TO);

if (!host || !port || !user || !pass) {
  console.error(
    "\nAu moins une variable est absente : la route renverrait « Configuration email manquante », pas une erreur d'authentification."
  );
  process.exit(1);
}

const portNumber = Number(port);
if (!Number.isFinite(portNumber)) {
  console.error(`\nEMAIL_PORT n'est pas un nombre : « ${port} ».`);
  process.exit(1);
}

// Un mot de passe applicatif Google est présenté par groupes de quatre lettres.
// Collé tel quel, il fait 19 caractères au lieu de 16 : on teste les deux
// formes pour dire laquelle passe.
const candidates: Array<{ label: string; value: string }> = [
  { label: "valeur telle quelle", value: pass },
];
const cleaned = pass
  .trim()
  .replace(/^["']([\s\S]*)["']$/, "$1")
  .replace(/\s+/g, "");
if (cleaned !== pass) {
  candidates.push({
    label: "valeur nettoyée (guillemets et espaces retirés)",
    value: cleaned,
  });
}

console.log(
  `\n=== Connexion à ${host}:${portNumber} (secure=${portNumber === 465}) ===`
);

let success = false;

for (const candidate of candidates) {
  const transporter = nodemailer.createTransport({
    host,
    port: portNumber,
    secure: portNumber === 465,
    auth: { user, pass: candidate.value },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    logger: true,
    debug: true,
  });

  console.log(`\n--- Essai : ${candidate.label} ---`);
  try {
    await transporter.verify();
    console.log(`\nOK : l'authentification passe avec la ${candidate.label}.`);
    success = true;
    transporter.close();
    break;
  } catch (error) {
    const err = error as NodeJS.ErrnoException & {
      responseCode?: number;
      response?: string;
      command?: string;
    };
    console.error("\nÉchec :");
    console.error(`  code          : ${err.code ?? "(aucun)"}`);
    console.error(`  responseCode  : ${err.responseCode ?? "(aucun)"}`);
    console.error(`  command       : ${err.command ?? "(aucune)"}`);
    console.error(`  message       : ${err.message}`);
    console.error(`  réponse SMTP  : ${err.response ?? "(aucune)"}`);
    transporter.close();
  }
}

if (!success) {
  console.error(
    "\nAucun essai n'a abouti. Pour Gmail, une réponse 535-5.7.8 « Username and Password not accepted »\n" +
      "signifie presque toujours l'un de ces cas :\n" +
      "  - EMAIL_PASS contient le mot de passe du compte, pas un mot de passe d'application ;\n" +
      "  - le mot de passe d'application a été révoqué (ils meurent au changement de mot de passe du compte) ;\n" +
      "  - la validation en deux étapes n'est plus active sur le compte, ce qui invalide tous ses mots de passe d'application ;\n" +
      "  - EMAIL_USER n'est pas exactement l'adresse du compte qui a généré le mot de passe."
  );
  process.exit(1);
}
