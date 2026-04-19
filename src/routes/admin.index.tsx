import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  GAMEMODES,
  TIER_OPTIONS,
  type PlayerRow as P,
  type GamemodeKey,
  totalPoints,
  avatarUrl,
} from "@/lib/tiers";
import { LogOut, Plus, Save, Trash2, X } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Panel — InvisTierlist" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPanel,
});

const REGIONS = ["Asia", "NA", "EU", "SA", "OCE", "AF"];

function AdminPanel() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [players, setPlayers] = useState<P[]>([]);
  const [editing, setEditing] = useState<P | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let mounted = true;
    const verify = async (uid: string | undefined) => {
      if (!uid) {
        setIsAdmin(false);
        setAuthChecked(true);
        navigate({ to: "/admin/login" });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (!mounted) return;
      if (!data) {
        await supabase.auth.signOut();
        setIsAdmin(false);
        setAuthChecked(true);
        navigate({ to: "/admin/login" });
        return;
      }
      setIsAdmin(true);
      setAuthChecked(true);
      loadPlayers();
    };

    const sub = supabase.auth.onAuthStateChange((_e, session) => {
      verify(session?.user?.id);
    });
    supabase.auth.getSession().then(({ data }) => verify(data.session?.user?.id));

    return () => {
      mounted = false;
      sub.data.subscription.unsubscribe();
    };
  }, [navigate]);

  const loadPlayers = async () => {
    const { data } = await supabase.from("players").select("*").order("username");
    setPlayers((data as P[]) ?? []);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this player?")) return;
    await supabase.from("players").delete().eq("id", id);
    loadPlayers();
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Verifying…
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: "var(--gradient-rank-1)" }}
            >
              <Eye className="h-4 w-4 text-background" />
            </div>
            <div>
              <div className="text-sm font-extrabold">InvisTierlist</div>
              <div className="text-[10px] uppercase tracking-wider text-primary">Admin Panel</div>
            </div>
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-destructive/40 hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Players</h1>
            <p className="text-sm text-muted-foreground">
              {players.length} players · click a row to edit tiers.
            </p>
          </div>
          <button
            onClick={() => {
              setCreating(true);
              setEditing({
                id: "",
                username: "",
                region: "Asia",
                vanilla: null,
                sword: null,
                axe: null,
                pot: null,
                nethop: null,
                uhc: null,
                smp: null,
                mace: null,
              });
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add player
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card/40">
          <table className="w-full text-sm">
            <thead className="bg-card/80 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Points</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-border transition hover:bg-card/80"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarUrl(p.username, 48)}
                        alt={p.username}
                        className="h-9 w-9 rounded-md border border-border"
                      />
                      <span className="font-semibold">{p.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.region}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{totalPoints(p)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setCreating(false);
                          setEditing(p);
                        }}
                        className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold transition hover:border-primary/40 hover:text-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive transition hover:bg-destructive/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No players yet. Click "Add player" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {editing && (
        <PlayerEditor
          player={editing}
          isNew={creating}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            loadPlayers();
          }}
        />
      )}
    </div>
  );
}

function PlayerEditor({
  player,
  isNew,
  onClose,
  onSaved,
}: {
  player: P;
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<P>(player);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof P>(k: K, v: P[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const setTier = (k: GamemodeKey, v: string) =>
    setField(k, (v === "" ? null : v) as P[GamemodeKey]);

  const handleSave = async () => {
    setError(null);
    if (!draft.username.trim()) {
      setError("Username is required.");
      return;
    }
    setSaving(true);
    if (isNew) {
      const { error: err } = await supabase.from("players").insert({
        username: draft.username.trim(),
        region: draft.region,
        vanilla: draft.vanilla,
        sword: draft.sword,
        axe: draft.axe,
        pot: draft.pot,
        nethop: draft.nethop,
        uhc: draft.uhc,
        smp: draft.smp,
        mace: draft.mace,
      });
      if (err) setError(err.message);
      else onSaved();
    } else {
      const { error: err } = await supabase
        .from("players")
        .update({
          username: draft.username.trim(),
          region: draft.region,
          vanilla: draft.vanilla,
          sword: draft.sword,
          axe: draft.axe,
          pot: draft.pot,
          nethop: draft.nethop,
          uhc: draft.uhc,
          smp: draft.smp,
          mace: draft.mace,
        })
        .eq("id", draft.id);
      if (err) setError(err.message);
      else onSaved();
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            {draft.username && (
              <img
                src={avatarUrl(draft.username, 48)}
                alt=""
                className="h-9 w-9 rounded-md border border-border"
              />
            )}
            <div>
              <div className="font-extrabold">{isNew ? "Add player" : "Edit player"}</div>
              <div className="text-xs text-muted-foreground">
                Set tiers per gamemode. Leave blank for unranked.
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Minecraft username
              </label>
              <input
                value={draft.username}
                onChange={(e) => setField("username", e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="e.g. Notch"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Region
              </label>
              <select
                value={draft.region}
                onChange={(e) => setField("region", e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tiers
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {GAMEMODES.map((g) => (
                <div key={g.key}>
                  <label className="mb-1 block text-xs font-semibold text-foreground">
                    {g.label}
                  </label>
                  <select
                    value={draft[g.key] ?? ""}
                    onChange={(e) => setTier(g.key, e.target.value)}
                    className="w-full rounded-lg border border-border bg-input px-2 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="">— None —</option>
                    {TIER_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border bg-card/60 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
