import React, { useState } from "react";
import { publicApi } from "../../api/publicApi";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await publicApi.submitLead({
        name,
        email,
        message: message || "Demande de contact",
      });
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} aria-label="Formulaire de contact">
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input aria-label="Votre nom" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
        <input aria-label="Votre email" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <textarea aria-label="Votre message" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
      </div>
      {error && <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>{error}</div>}
      <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <button type="submit" disabled={submitting}>
          {submitting ? "Envoi..." : "Envoyer"}
        </button>
        {submitted && <span style={{ color: "#9fe6a0" }}>Message envoyé avec succès</span>}
      </div>
    </form>
  );
}
