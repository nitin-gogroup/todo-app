import { db } from "@/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { users } from "@/db/schema";
// Ensure this import matches the generated drizzle schema

// Get user from DB and verify password
export async function getUserFromDb(email: string, password: string) {
  // Find user by email
  const userArr = await db.select().from(users).where(eq(users.email, email));
  const user = userArr[0];
  console.log("🚀 ~ getUserFromDb ~ user:", user);
  if (!user || !user.email || !user.password) return null;
  const valid = await bcrypt.compare(password, user.password);
  console.log("🚀 ~ getUserFromDb ~ valid:", valid);
  if (!valid) return null;
  return user;
}
