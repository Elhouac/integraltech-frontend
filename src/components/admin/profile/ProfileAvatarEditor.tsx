import { useState, useRef, useEffect, useCallback } from "react";
import { Link2, Trash2, Upload, X, Info } from "lucide-react";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

function formatBytes(b: number): string {
  if (b < 1024) return `${b} o`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} Ko`;
  return `${(b / 1048576).toFixed(1)} Mo`;
}

interface ProfileAvatarEditorProps {
  avatarUrl: string;
  initials: string;
  onAvatarChange: (url: string) => void;
  onAvatarRemove: () => void;
}

export default function ProfileAvatarEditor({ avatarUrl, initials, onAvatarChange, onAvatarRemove }: ProfileAvatarEditorProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState("");
  const [imgBroken, setImgBroken] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs
  useEffect(() => {
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [objectUrl]);

  const handleFile = useCallback((file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Type non supporté. Autorisés : JPEG, PNG, WebP.`);
      return;
    }
    if (file.size > MAX_SIZE) {
      setError(`Fichier trop volumineux (${formatBytes(file.size)}). Maximum : ${formatBytes(MAX_SIZE)}.`);
      return;
    }
    setError("");
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    setImgBroken(false);
    onAvatarChange(url);
  }, [objectUrl, onAvatarChange]);

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput);
    } catch {
      setError("URL invalide.");
      return;
    }
    setError("");
    setImgBroken(false);
    onAvatarChange(urlInput.trim());
    setShowUrlInput(false);
    setUrlInput("");
  };

  const handleRemove = () => {
    if (objectUrl) { URL.revokeObjectURL(objectUrl); setObjectUrl(null); }
    setImgBroken(false);
    onAvatarRemove();
  };

  const currentSrc = avatarUrl || null;
  const showImage = currentSrc && !imgBroken;

  const btnStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px",
    borderRadius: "var(--radius-md)", border: `1px solid ${BORDER}`, background: SURFACE,
    color: TEXT, fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer",
  };

  return (
    <div>
      <div className="admin-profile-avatar-zone">
        <div className="admin-profile-avatar-circle" aria-label="Photo de profil">
          {showImage ? (
            <img src={currentSrc} alt="Photo de profil"
              onError={() => setImgBroken(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <input ref={fileRef} type="file" accept={ALLOWED_TYPES.join(",")}
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />
            <button onClick={() => fileRef.current?.click()} style={btnStyle}>
              <Upload size={13} /> Choisir un fichier
            </button>
            <button onClick={() => setShowUrlInput((v) => !v)} style={btnStyle}>
              <Link2 size={13} /> URL externe
            </button>
            {avatarUrl && (
              <button onClick={handleRemove} style={{ ...btnStyle, color: DANGER, borderColor: DANGER }}>
                <Trash2 size={13} /> Supprimer
              </button>
            )}
          </div>
          <span style={{ fontSize: 11, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
            JPEG, PNG ou WebP · Max {formatBytes(MAX_SIZE)}
          </span>
          {error && <span style={{ fontSize: 12, color: DANGER, fontFamily: "var(--font-sans)" }}>{error}</span>}
        </div>
      </div>

      {showUrlInput && (
        <div style={{ padding: "0 20px 16px", display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
          <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            style={{
              flex: "1 1 250px", padding: "9px 14px", fontSize: 13, fontFamily: "var(--font-sans)", color: TEXT,
              background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", outline: "none", minWidth: 0,
            }}
            onKeyDown={(e) => { if (e.key === "Enter") handleUrlSubmit(); }}
          />
          <button onClick={handleUrlSubmit} style={{ ...btnStyle, background: ACCENT, color: "#fff", borderColor: ACCENT }}>
            Appliquer
          </button>
          <button onClick={() => { setShowUrlInput(false); setUrlInput(""); }} style={btnStyle}>
            <X size={13} />
          </button>
        </div>
      )}

      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", borderRadius: "var(--radius-md)", background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: 2, color: ACCENT }} />
          <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
            Mode démonstration : la photo n'est pas envoyée au serveur et sera réinitialisée après actualisation.
          </span>
        </div>
      </div>
    </div>
  );
}
