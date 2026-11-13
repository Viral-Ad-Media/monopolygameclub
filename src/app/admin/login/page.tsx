import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Editor sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="font-display text-3xl">Editor sign in</h1>
      <p className="mt-2 text-sm text-muted">Sign in to write and edit articles.</p>
      <LoginForm />
    </div>
  );
}
