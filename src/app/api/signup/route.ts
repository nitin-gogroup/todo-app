import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [existingUser] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    console.log("🚀 ~ POST ~ existing:", existingUser);

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        name,
        password: hashed,
      })
      .returning();

    return NextResponse.json({ id: user.id, email: user.email });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
