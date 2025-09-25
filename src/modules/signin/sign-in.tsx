"use client";

import { signIn } from "next-auth/react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        switch (res.error) {
          case "CredentialsSignin":
            toast.error(
              "Invalid email or password, Please sign up if you don't have an account"
            );
            break;
          default:
            toast.error("Error signing in: " + res.error);
        }
      } else {
        console.log();
        router.replace("/");
      }
    } catch (e) {
      toast("Error signing in");
      console.error("Sign in error:", e);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold pb-4">Todos: Sign In</h1>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-4 min-w-[300px]"
      >
        <label>
          Email
          <Input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <Input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <Button disabled={!email || !password}>Sign In</Button>
        <p className="text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </main>
  );
}
