import {randomBytes, createHash} from "crypto";

// Hash password with salt using SHA-256
export function saltAndHashPassword(password: string, salt?: string) {
  const actualSalt = salt || randomBytes(16).toString("hex");
  const hash = 
    createHash("sha256")
    .update(actualSalt + password)
    .digest("hex");
  return { salt: actualSalt, hash };
}
