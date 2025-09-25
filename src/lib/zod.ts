import { email, object, string } from "zod";

export const signInSchema = object({
  email: email({ error: "Invalid email" }).min(1, "Email is required"),
  password: string()
    .min(1, "Password is required")
});
