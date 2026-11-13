/**
 * Creates (or resets the password of) an editor who can sign in at /admin.
 *
 *   npm run create-admin -- you@example.com "Your Name"
 *   (you'll be asked for the password, or set ADMIN_PASSWORD)
 */
import { randomUUID } from "node:crypto";
import readline from "node:readline/promises";
import { and, eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { closeDb, db, schema } from "./db";

async function main() {
  const [email, ...nameParts] = process.argv.slice(2);
  if (!email || !email.includes("@")) {
    throw new Error('Usage: npm run create-admin -- you@example.com "Your Name"');
  }
  const name = nameParts.join(" ") || email.split("@")[0];
  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    password = await rl.question("Password (min 10 characters): ");
    rl.close();
  }
  if (password.length < 10) throw new Error("Password must be at least 10 characters.");

  const hash = await hashPassword(password);
  const normalized = email.toLowerCase();
  const [existing] = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, normalized));

  if (existing) {
    await db
      .update(schema.account)
      .set({ password: hash, updatedAt: new Date() })
      .where(
        and(
          eq(schema.account.userId, existing.id),
          eq(schema.account.providerId, "credential"),
        ),
      );
    console.log(`Updated password for ${normalized}.`);
    return;
  }

  const userId = randomUUID();
  await db.insert(schema.user).values({
    id: userId,
    name,
    email: normalized,
    emailVerified: true,
  });
  await db.insert(schema.account).values({
    id: randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: hash,
  });
  console.log(`Created editor ${normalized}. Sign in at /admin/login.`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(closeDb);
