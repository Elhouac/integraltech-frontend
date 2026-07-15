import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Shield, User, UserX, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../context/AuthContext";
import DataTable from "../../components/admin/shared/DataTable";
import type { Column, SortState } from "../../components/admin/shared/DataTable";
import Pagination from "../../components/admin/shared/Pagination";
import type { PaginationMeta } from "../../components/admin/shared/Pagination";
import SearchInput from "../../components/admin/shared/SearchInput";
import StatusBadge from "../../components/admin/shared/StatusBadge";
import EmptyState from "../../components/admin/shared/EmptyState";
import ConfirmDialog from "../../components/admin/shared/ConfirmDialog";
import { MOCK_SYSTEM_USERS } from "../../data/admin-mocks";
import type { SystemUser } from "../../data/admin-mocks";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, OVERLAY } from "../../constants";
import { safeSort } from "../../utils/sort";

const PER_PAGE = 5;

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Administrateur",
  editor: "Éditeur",
  support: "Support",
  viewer: "Lecteur (Viewer)",
  reader: "Lecteur (Reader)",
};

const STATUS_VARIANTS = {
  active: { label: "Actif", color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  suspended: { label: "Suspendu", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
};

function formatLastLogin(iso: string | null): string {
  if (!iso) return "Jamais";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<SystemUser[]>(MOCK_SYSTEM_USERS);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Pagination & Sort
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>({ key: "id", direction: "asc" });

  // Modal Dialogs
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("viewer");
  const [isActive, setIsActive] = useState(true);

  // Delete Dialog
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: number | null }>({
    open: false,
    userId: null,
  });

  const handleSort = (key: string) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" }
    );
    setPage(1);
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setRole("viewer");
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (u: SystemUser) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setIsActive(u.is_active);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingUser) {
      // In-place edit for persistence
      const index = MOCK_SYSTEM_USERS.findIndex((u) => u.id === editingUser.id);
      if (index !== -1) {
        // Enforce safety: do not allow self deactivation
        const finalActiveStatus = editingUser.id === currentUser?.id ? true : isActive;
        MOCK_SYSTEM_USERS[index] = {
          ...MOCK_SYSTEM_USERS[index],
          name: name.trim(),
          email: email.trim(),
          role,
          is_active: finalActiveStatus,
        };
      }
      setUsers([...MOCK_SYSTEM_USERS]);
    } else {
      // In-place create
      const newUser: SystemUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        role,
        is_active: isActive,
        last_login: null,
      };
      MOCK_SYSTEM_USERS.push(newUser);
      setUsers([...MOCK_SYSTEM_USERS]);
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteDialog.userId !== null) {
      // Safeguard check
      if (deleteDialog.userId === currentUser?.id) {
        setDeleteDialog({ open: false, userId: null });
        return;
      }
      const index = MOCK_SYSTEM_USERS.findIndex((u) => u.id === deleteDialog.userId);
      if (index !== -1) {
        MOCK_SYSTEM_USERS.splice(index, 1);
      }
      setUsers([...MOCK_SYSTEM_USERS]);
    }
    setDeleteDialog({ open: false, userId: null });
  };

  const toggleUserStatus = (u: SystemUser) => {
    // Safeguard check
    if (u.id === currentUser?.id) return;

    const index = MOCK_SYSTEM_USERS.findIndex((usr) => usr.id === u.id);
    if (index !== -1) {
      MOCK_SYSTEM_USERS[index].is_active = !MOCK_SYSTEM_USERS[index].is_active;
    }
    setUsers([...MOCK_SYSTEM_USERS]);
  };

  const handleSearchChange = (val: string) => { setSearch(val); setPage(1); };
  const handleRoleFilter = (val: string) => { setRoleFilter(val); setPage(1); };
  const handleStatusFilter = (val: string) => { setStatusFilter(val); setPage(1); };

  // Filtered & Sorted Data
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (statusFilter !== "all") {
      const activeMatch = statusFilter === "active";
      result = result.filter((u) => u.is_active === activeMatch);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    return safeSort(result, sort.key, sort.direction);
  }, [users, search, roleFilter, statusFilter, sort]);

  const paginationMeta: PaginationMeta = {
    page,
    perPage: PER_PAGE,
    total: filteredUsers.length,
  };

  const pagedUsers = useMemo(
    () => filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filteredUsers, page]
  );

  const columns: Column<SystemUser>[] = [
    {
      key: "name",
      label: "Utilisateur",
      sortable: true,
      render: (u) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: u.id === currentUser?.id ? "rgba(249,115,22,0.08)" : "var(--hover)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={14} color={u.id === currentUser?.id ? ACCENT : TEXT_SECONDARY} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: TEXT }}>
              {u.name} {u.id === currentUser?.id && <span style={{ fontSize: 10, color: ACCENT, fontStyle: "italic" }}>(Vous)</span>}
            </div>
            <div style={{ fontSize: 11, color: TEXT_SECONDARY }}>{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Rôle",
      sortable: true,
      width: 140,
      render: (u) => (
        <span style={{ fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY }}>
          {ROLE_LABELS[u.role] || u.role}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Statut",
      width: 120,
      render: (u) => (
        <StatusBadge variant={u.is_active ? STATUS_VARIANTS.active : STATUS_VARIANTS.suspended} size="sm" />
      ),
    },
    {
      key: "last_login",
      label: "Dernière connexion",
      sortable: true,
      width: 160,
      render: (u) => (
        <span style={{ fontSize: 11, color: TEXT_SECONDARY }}>
          {formatLastLogin(u.last_login)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: 120,
      render: (u) => {
        const isSelf = u.id === currentUser?.id;
        return (
          <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
            {/* Status toggle */}
            <button
              disabled={isSelf}
              onClick={() => toggleUserStatus(u)}
              title={u.is_active ? "Suspendre l'utilisateur" : "Activer l'utilisateur"}
              style={{
                padding: 6,
                background: "none",
                border: "none",
                color: isSelf ? "var(--muted)" : u.is_active ? "var(--warning)" : "#22C55E",
                cursor: isSelf ? "not-allowed" : "pointer",
                borderRadius: "var(--radius-sm)",
                opacity: isSelf ? 0.3 : 1,
              }}
              onMouseEnter={(e) => { if (!isSelf) e.currentTarget.style.background = "var(--hover)"; }}
              onMouseLeave={(e) => { if (!isSelf) e.currentTarget.style.background = "none"; }}
            >
              {u.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
            </button>

            {/* Edit */}
            <button
              onClick={() => handleOpenEdit(u)}
              title="Modifier l'utilisateur"
              style={{
                padding: 6,
                background: "none",
                border: "none",
                color: TEXT_SECONDARY,
                cursor: "pointer",
                borderRadius: "var(--radius-sm)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
            >
              <Edit2 size={14} />
            </button>

            {/* Delete */}
            <button
              disabled={isSelf}
              onClick={() => setDeleteDialog({ open: true, userId: u.id })}
              title="Supprimer l'utilisateur"
              style={{
                padding: 6,
                background: "none",
                border: "none",
                color: "var(--danger)",
                cursor: isSelf ? "not-allowed" : "pointer",
                borderRadius: "var(--radius-sm)",
                opacity: isSelf ? 0.3 : 1,
              }}
              onMouseEnter={(e) => { if (!isSelf) e.currentTarget.style.background = "var(--hover)"; }}
              onMouseLeave={(e) => { if (!isSelf) e.currentTarget.style.background = "none"; }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              color: TEXT,
              margin: 0,
            }}
          >
            Utilisateurs
          </h1>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", margin: "4px 0 0" }}>
            Gérez les rôles et permissions des comptes d'administration.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            border: "none",
            borderRadius: "var(--radius-md)",
            background: ACCENT,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
          }}
        >
          <Plus size={15} />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Filters bar */}
      <div className="admin-lead-filters" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 240px", minWidth: 200 }}>
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Rechercher par nom ou email…" />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => handleRoleFilter(e.target.value)}
          aria-label="Filtrer par rôle"
          style={{
            padding: "8px 32px 8px 12px",
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-md)",
            background: SURFACE,
            color: TEXT,
            fontSize: 13,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            outline: "none",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
          }}
        >
          <option value="all">Tous les rôles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Administrateur</option>
          <option value="editor">Éditeur</option>
          <option value="support">Support</option>
          <option value="viewer">Lecteur (Viewer)</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          aria-label="Filtrer par statut"
          style={{
            padding: "8px 32px 8px 12px",
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-md)",
            background: SURFACE,
            color: TEXT,
            fontSize: 13,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            outline: "none",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
          }}
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Suspendus</option>
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        <DataTable
          columns={columns}
          data={pagedUsers}
          sort={sort}
          onSort={handleSort}
          getRowKey={(u) => u.id}
          onRowClick={(u) => handleOpenEdit(u)}
          emptyContent={
            <EmptyState
              icon={Shield}
              title="Aucun utilisateur trouvé"
              description="Essayez de modifier vos filtres de recherche."
              actionLabel="Ajouter un utilisateur"
              onAction={handleOpenCreate}
            />
          }
        />

        <div style={{ padding: "0 16px 16px" }}>
          <Pagination meta={paginationMeta} onPageChange={setPage} />
        </div>
      </div>

      {/* Inline Create/Edit Modal */}
      {modalOpen && (
        <>
          <div
            onClick={() => setModalOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: OVERLAY,
              zIndex: 998,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 450,
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: "var(--radius-lg)",
              padding: 24,
              boxShadow: "var(--shadow-xl)",
              zIndex: 999,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT, margin: "0 0 16px" }}>
              {editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Driss Bensalah"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: SURFACE,
                    color: TEXT,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Adresse email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: driss@integraltech.ma"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: SURFACE,
                    color: TEXT,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              {/* Role */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Rôle
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: SURFACE,
                    color: TEXT,
                    fontSize: 13,
                    outline: "none",
                  }}
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Administrateur</option>
                  <option value="editor">Éditeur</option>
                  <option value="support">Support</option>
                  <option value="viewer">Lecteur (Viewer)</option>
                </select>
              </div>

              {/* Status active - safeguarded if edit is current self */}
              {(!editingUser || editingUser.id !== currentUser?.id) && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    style={{ accentColor: ACCENT, cursor: "pointer", width: 16, height: 16 }}
                  />
                  <label htmlFor="isActiveCheck" style={{ fontSize: 13, fontWeight: 600, color: TEXT, cursor: "pointer" }}>
                    Compte actif (autoriser la connexion)
                  </label>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: SURFACE,
                    color: TEXT,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    background: ACCENT,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}

      {/* Delete dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Supprimer l'utilisateur ?"
        message="Voulez-vous vraiment supprimer cet utilisateur ? Cette action révoquera immédiatement tous ses accès administratifs."
        confirmLabel="Supprimer"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, userId: null })}
      />
    </div>
  );
}
