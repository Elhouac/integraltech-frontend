import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === "function") {
          return this.props.fallback(this.state.error, this.handleReset);
        }
        return this.props.fallback;
      }
      return <DefaultFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

function DefaultFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  const isDev = import.meta.env.DEV;

  const handleReturnHome = () => {
    window.location.href = "/";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
        background: "var(--background)",
        color: "var(--text)",
        fontFamily: "var(--font-sans)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          padding: "32px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 800,
            fontFamily: "var(--font-display)",
            marginBottom: "12px",
            color: "var(--text)",
          }}
        >
          Une erreur est survenue
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>
          Nous sommes désolés, mais une erreur inattendue s'est produite lors du chargement de cette page.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "24px" }}>
          <button
            onClick={onReset}
            style={{
              padding: "10px 18px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
          <button
            onClick={handleReturnHome}
            style={{
              padding: "10px 18px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
              color: "var(--text)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Retour à l'accueil
          </button>
        </div>

        {isDev && (
          <div
            style={{
              textAlign: "left",
              background: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              padding: "12px",
              borderRadius: "var(--radius-md)",
              fontSize: "12px",
              fontFamily: "monospace",
              color: "var(--danger)",
              overflowX: "auto",
            }}
          >
            <strong style={{ display: "block", marginBottom: "6px" }}>Détails techniques (Dev) :</strong>
            {error.message}
            {error.stack && (
              <pre style={{ margin: "6px 0 0", fontSize: "10px", opacity: 0.8 }}>
                {error.stack.split("\n").slice(0, 3).join("\n")}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
