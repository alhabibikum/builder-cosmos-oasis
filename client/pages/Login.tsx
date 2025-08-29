import { useAuth } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <section className="mx-auto max-w-md space-y-4">
      <h1 className="font-['Playfair Display'] text-3xl font-extrabold tracking-tight">Sign in</h1>
      <input className="h-11 w-full rounded-md border px-3" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="h-11 w-full rounded-md border px-3" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="grid gap-2 sm:grid-cols-3">
        <button onClick={() => { signIn("user", { name, email }); nav("/dashboard"); }} className="rounded-md border px-3 py-2 text-sm font-semibold">Continue as Customer</button>
        <button onClick={() => { signIn("admin", { name: name || "Admin" }); nav("/admin"); }} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Admin</button>
        <button onClick={() => { signIn("guest", { name: "Guest" }); nav("/"); }} className="rounded-md border px-3 py-2 text-sm font-semibold">Guest</button>
      </div>
      <p className="text-sm text-muted-foreground">This demo uses local storage for authentication. Connect real auth (e.g., Supabase, Clerk) to secure it.</p>
    </section>
  );
}
