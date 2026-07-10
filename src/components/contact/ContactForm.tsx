import React, { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} aria-label="Formulaire de contact">
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input aria-label="Votre nom" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
        <input aria-label="Votre email" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <textarea aria-label="Votre message" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <button type="submit">Envoyer</button>
        {submitted && <span style={{ color: "#9fe6a0" }}>Message envoyé</span>}
      </div>
    </form>
  );
}
