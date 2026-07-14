import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, User } from "lucide-react";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";
import type { LeadNote } from "../../../data/admin-mocks";

interface LeadNotesProps {
  notes: LeadNote[];
  onAddNote: (content: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LeadNotes({ notes, onAddNote }: LeadNotesProps) {
  const [newNote, setNewNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(newNote.trim());
    setNewNote("");
  };

  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <MessageSquare size={16} color={ACCENT} />
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: TEXT,
            fontFamily: "var(--font-display)",
            margin: 0,
          }}
        >
          Notes internes ({notes.length})
        </h3>
      </div>

      {/* Notes list */}
      <div style={{ padding: notes.length > 0 ? "12px 20px" : 0 }}>
        {notes.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            style={{
              padding: "12px 0",
              borderBottom: i < notes.length - 1 ? `1px solid ${BORDER}` : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "rgba(249,115,22,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={12} color={ACCENT} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>
                {note.author}
              </span>
              <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-sans)" }}>
                {formatDate(note.created_at)}
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: TEXT_SECONDARY,
                fontFamily: "var(--font-sans)",
                lineHeight: 1.6,
                margin: "0 0 0 32px",
              }}
            >
              {note.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Add note form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: 8,
          padding: "12px 20px",
          borderTop: `1px solid ${BORDER}`,
          background: "var(--background)",
        }}
      >
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Ajouter une note…"
          aria-label="Ajouter une note interne"
          style={{
            flex: 1,
            padding: "8px 14px",
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-md)",
            background: SURFACE,
            color: TEXT,
            fontSize: 13,
            fontFamily: "var(--font-sans)",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = ACCENT; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; }}
        />
        <button
          type="submit"
          disabled={!newNote.trim()}
          aria-label="Envoyer la note"
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "var(--radius-md)",
            background: newNote.trim() ? ACCENT : "var(--hover)",
            color: newNote.trim() ? "#fff" : "var(--muted)",
            cursor: newNote.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            transition: "background 0.15s",
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
