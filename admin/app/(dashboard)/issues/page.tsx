"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Download, Filter, SlidersHorizontal } from "lucide-react";
import TopBar from "@/components/TopBar";
import { StatusPill, CategoryPill } from "@/components/StatusPill";
import { Issue, fetchIssues, IssueStatus, updateIssueStatus } from "@/lib/api";

const STATUS_FILTERS: { key: IssueStatus | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "pending", label: "Новые" },
  { key: "in_progress", label: "В работе" },
  { key: "resolved", label: "Решено" },
];

const CATEGORY_FILTERS = [
  { key: "all", label: "Все категории" },
  { key: "pothole", label: "Ямы" },
  { key: "garbage", label: "Мусор" },
  { key: "lighting", label: "Освещение" },
  { key: "other", label: "Другое" },
];

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"created_at" | "id" | "status">("created_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      setIssues(await fetchIssues());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [load]);

  async function changeStatus(id: number, status: IssueStatus) {
    setBusyId(id);
    try {
      await updateIssueStatus(id, status);
      load();
    } finally {
      setBusyId(null);
    }
  }

  const filtered = useMemo(() => {
    let list = [...issues];
    if (statusFilter !== "all") list = list.filter(i => i.status === statusFilter);
    if (categoryFilter !== "all") list = list.filter(i => (i.category ?? "other") === categoryFilter);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(i =>
        `SB-${String(i.id).padStart(7, "0")}`.toLowerCase().includes(s) ||
        (i.description && i.description.toLowerCase().includes(s))
      );
    }
    list.sort((a, b) => {
      let v = 0;
      if (sortField === "created_at") v = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortField === "id") v = a.id - b.id;
      else v = a.status.localeCompare(b.status);
      return sortAsc ? v : -v;
    });
    return list;
  }, [issues, statusFilter, categoryFilter, search, sortField, sortAsc]);

  function relTime(d: Date) {
    const s = (Date.now() - d.getTime()) / 1000;
    if (s < 60) return `${Math.floor(s)} сек назад`;
    if (s < 3600) return `${Math.floor(s / 60)} мин назад`;
    if (s < 86400) return `${Math.floor(s / 3600)} ч назад`;
    return `${Math.floor(s / 86400)} д назад`;
  }

  return (
    <>
      <TopBar
        title="Заявки"
        subtitle={`Всего ${issues.length} · показано ${filtered.length}${error ? ` · ⚠ ${error}` : ""}`}
      >
        <div style={{ display: "flex", gap: 6, marginLeft: 24 }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f.key}
              className={`chip ${statusFilter === f.key ? "active" : ""}`}
              onClick={() => setStatusFilter(f.key)}
            >
              {f.label}
              {f.key !== "all" && (
                <span style={{ marginLeft: 4, opacity: 0.7 }}>
                  {issues.filter(i => f.key === "all" || i.status === f.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </TopBar>

      <div className="content-pad" style={{ overflow: "auto", flex: 1 }}>
        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
        }}>
          <input
            type="text"
            placeholder="Поиск по номеру или описанию…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: 8,
              border: "1px solid var(--line)",
              background: "var(--surface-alt)",
              color: "var(--text)",
              fontSize: 13,
              outline: "none",
              fontFamily: "inherit",
              width: 280,
            }}
          />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{
              height: 38,
              padding: "0 12px",
              borderRadius: 8,
              border: "1px solid var(--line)",
              background: "var(--surface-alt)",
              color: "var(--text)",
              fontSize: 12,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            {CATEGORY_FILTERS.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
          <div style={{ flex: 1 }} />
          <button
            className="btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            onClick={() => {
              setSortAsc(!sortAsc);
            }}
          >
            <SlidersHorizontal size={14} />
            {sortAsc ? "Сначала старые" : "Сначала новые"}
          </button>
          <button
            className="btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Download size={14} />
            Экспорт
          </button>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Номер</th>
                <th>Фото</th>
                <th>Категория</th>
                <th>Координаты</th>
                <th>Описание</th>
                <th>Статус</th>
                <th>Получено</th>
                <th>Действие</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(it => (
                <tr key={it.id}>
                  <td className="mono" style={{ fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                    SB-{String(it.id).padStart(7, "0")}
                  </td>
                  <td>
                    {it.image_url ? (
                      <img
                        src={it.image_url}
                        alt=""
                        style={{
                          width: 40, height: 40, borderRadius: 6,
                          objectFit: "cover", border: "1px solid var(--line)",
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 40, height: 40, borderRadius: 6,
                        background: "var(--surface-alt)", border: "1px solid var(--line)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, color: "var(--text-muted)",
                      }}>📷</div>
                    )}
                  </td>
                  <td><CategoryPill category={it.category} /></td>
                  <td style={{ color: "var(--text-soft)" }}>
                    <span className="mono" style={{ fontSize: 11 }}>
                      {parseFloat(it.latitude).toFixed(4)}, {parseFloat(it.longitude).toFixed(4)}
                    </span>
                  </td>
                  <td style={{
                    maxWidth: 200, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                    color: "var(--text-soft)", fontSize: 12,
                  }}>
                    {it.description || "—"}
                  </td>
                  <td><StatusPill status={it.status} /></td>
                  <td style={{ color: "var(--text-muted)", fontSize: 11, whiteSpace: "nowrap" }}>
                    {relTime(new Date(it.created_at))}
                  </td>
                  <td>
                    <select
                      disabled={busyId === it.id}
                      value={it.status}
                      onChange={e => changeStatus(it.id, e.target.value as IssueStatus)}
                      style={{
                        height: 30,
                        padding: "0 8px",
                        borderRadius: 6,
                        border: "1px solid var(--line)",
                        background: "var(--surface-alt)",
                        color: "var(--text)",
                        fontSize: 11,
                        fontFamily: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      <option value="pending">Новая</option>
                      <option value="in_progress">В работе</option>
                      <option value="resolved">Решена</option>
                    </select>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link href={`/issues/${it.id}`} style={{ color: "var(--text-muted)" }}>
                      <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
                    {issues.length === 0
                      ? "Заявок пока нет. Отправьте первую через мобильное приложение."
                      : "Нет заявок, соответствующих фильтрам"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div style={{
          marginTop: 12, fontSize: 11, color: "var(--text-muted)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span className="live-dot" />
          Live · обновляется каждые 10 сек
        </div>
      </div>
    </>
  );
}
