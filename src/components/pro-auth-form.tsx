"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut } from "lucide-react";

export function ProAuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/pro/${mode === "login" ? "login" : "register"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data)) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Une erreur est survenue.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Veuillez réessayer.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="pro-auth-card"><div className="auth-tabs"><button onClick={() => { setMode("login"); setError(""); }} className={mode === "login" ? "active" : ""} type="button">Se connecter</button><button onClick={() => { setMode("register"); setError(""); }} className={mode === "register" ? "active" : ""} type="button">Créer un compte</button></div><div className="auth-content"><span className="eyebrow">VOTRE ESPACE PRIVILÉGIÉ</span><h2>{mode === "login" ? "Heureux de vous retrouver." : "Faisons connaissance."}</h2><p>{mode === "login" ? "Connectez-vous pour retrouver votre espace et préparer la suite ensemble." : "Créez votre accès professionnel en quelques instants."}</p><form onSubmit={submit} className="auth-form">{mode === "register" && <><label>Nom de l&apos;entreprise <span>*</span><input name="company" type="text" required minLength={2} autoComplete="organization" placeholder="Votre établissement" /></label><label>Votre nom <span>*</span><input name="contactName" type="text" required minLength={2} autoComplete="name" placeholder="Votre nom et prénom" /></label><label>Votre activité <select name="activity" defaultValue="restaurant"><option value="restaurant">Restaurant / bar</option><option value="entreprise">Entreprise</option><option value="cse">CSE / cadeaux</option><option value="autre">Autre activité</option></select></label></>}<label>Adresse email <span>*</span><input name="email" type="email" required autoComplete="email" placeholder="vous@entreprise.fr" /></label><label>Mot de passe <span>*</span><input name="password" type="password" required minLength={mode === "register" ? 8 : 1} autoComplete={mode === "register" ? "new-password" : "current-password"} placeholder={mode === "register" ? "8 caractères minimum" : "Votre mot de passe"} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="button button-dark button-full" disabled={busy}>{busy ? "Un instant..." : mode === "login" ? "Accéder à mon espace" : "Créer mon espace"}<ArrowRight size={18} /></button></form></div></div>;
}

export function ProLogoutButton() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/pro/logout", { method: "POST" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }
  return <button className="pro-logout" type="button" onClick={logout} disabled={busy}><LogOut size={15} /> {busy ? "Déconnexion..." : "Se déconnecter"}</button>;
}
