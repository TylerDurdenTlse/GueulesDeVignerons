"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

type InquiryType = "contact" | "club" | "cadeau" | "pro" | "pro_quote";

type Props = {
  type?: InquiryType;
  message?: string;
  showOrganization?: boolean;
  buttonLabel?: string;
  initialName?: string;
  initialEmail?: string;
  initialOrganization?: string;
};

export function InquiryForm({ type = "contact", message = "", showOrganization = false, buttonLabel = "Envoyer mon message", initialName = "", initialEmail = "", initialOrganization = "" }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    if (fields.get("website")) return;
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name: fields.get("name"), email: fields.get("email"), phone: fields.get("phone"), organization: fields.get("organization") ?? "", message: fields.get("message") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Une erreur est survenue.");
      form.reset();
      setState("success");
      if (type === "pro_quote") router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Veuillez réessayer.");
      setState("error");
    }
  }

  if (state === "success") return <div className="form-success" role="status"><CheckCircle2 size={33} strokeWidth={1.2} /><h3>Message bien reçu !</h3><p>Merci de nous avoir écrit. Votre demande est enregistrée ; la maison reviendra vers vous.</p><button onClick={() => setState("idle")} className="text-link">Envoyer un autre message <ArrowUpRight size={17} /></button></div>;

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <div className="form-row"><label>Votre nom <span>*</span><input name="name" type="text" required minLength={2} maxLength={160} autoComplete="name" placeholder="Comment vous appelez-vous ?" defaultValue={initialName} /></label><label>Votre email <span>*</span><input name="email" type="email" required maxLength={255} autoComplete="email" placeholder="vous@exemple.fr" defaultValue={initialEmail} /></label></div>
      <div className="form-row"><label>Téléphone <input name="phone" type="tel" maxLength={50} autoComplete="tel" placeholder="Pour échanger de vive voix" /></label>{showOrganization ? <label>Entreprise / établissement <input name="organization" type="text" maxLength={180} autoComplete="organization" placeholder="Le nom de votre structure" defaultValue={initialOrganization} /></label> : <div className="form-row-note">Nous ne partagerons jamais vos coordonnées. Elles nous servent uniquement à répondre à votre demande.</div>}</div>
      <label>Votre projet, votre envie <span>*</span><textarea name="message" required minLength={10} maxLength={4000} rows={5} placeholder="Racontez-nous ce que vous imaginez..." defaultValue={message} /></label>
      <label className="honeypot" aria-hidden="true">Site web<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      {state === "error" && <p className="form-error" role="alert">{error}</p>}
      <div className="form-submit-row"><p>En envoyant ce formulaire, vous acceptez d&apos;être recontacté·e au sujet de votre demande.</p><button className="button button-dark" type="submit" disabled={state === "sending"}>{state === "sending" ? "Envoi en cours..." : buttonLabel} <ArrowUpRight size={18} /></button></div>
    </form>
  );
}
