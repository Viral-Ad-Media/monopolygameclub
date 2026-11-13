"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Sign in failed");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm font-semibold">Email</span>
        <input name="email" type="email" required autoComplete="email" className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2" />
      </label>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-brand-dark">{error}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-brand px-4 py-2.5 font-bold text-white disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
