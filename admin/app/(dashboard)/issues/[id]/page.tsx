"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ChevronLeft, MapPin, Clock, Tag, Sparkles,
  CheckCircle2, XCircle, PlayCircle, AlertTriangle,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import { StatusPill, CategoryPill } from "@/components/StatusPill";
import { Issue, fetchIssues, IssueStatus, updateIssueStatus } from "@/lib/api";
import { C, STATUS_TOKENS, CATEGORY_TOKENS } from "@/lib/tokens";

const IssueMap = dynamic(() => import("@/components/IssueMap"), { ssr: false });

const TIMELINE = [
  { key: "pending", label: "Заявка создана", desc: "Получена через мобильное приложение", icon: "📱" },
  { key: "classified", label: "ML-классификация", desc: "Категория определена автоматически", icon: "🤖" },
  { key: "accepted", label: "Принята оператором", desc: "Оператор подтвердил заявку", icon: "✅" },
  { key: "in_progress", label: "В работе", desc: "Бригада назначена", icon: "🔧" },
  { key: "resolved", label: "Решена", desc: "Проблема устранена", icon: "🎉" },
];

function getTimelineStage(status: string) {
  switch (status) {
    case "pending": return 1;
    case "in_progress": return 3;
    case "resolved": return 4;
    default: return 0;
  }
}

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = Number(params.id);

  const [issue, setIssue] = useState<Issue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const all = await fetchIssues();
      const found = all.find(i => i.id === issueId);
      if (found) setIssue(found);
      else setError("Заявка не найдена");
    } catch (e) {
      setError((e as Error).message);
    }
  }, [issueId]);

  useEffect(() => { load(); }, [load]);

  async function changeStatus(status: IssueStatus) {
    setBusy(true);
    try {
      await updateIssueStatus(issueId, status);
      load();
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <>
        <TopBar title="Ошибка" subtitle={error} />
        <div className="content-pad" style={{ textAlign: "center", padding: 80, color: "var(--text-muted)" }}>
          <AlertTriangle size={48} style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 16, fontWeight: 600 }}>{error}</div>
          <Link href="/issues" style={{ color: C.amber500, marginTop: 12, display: "inline-block" }}>
            ← Вернуться к списку
          </Link>
        </div>
      </>
    );
  }

  if (!issue) {
    return (
      <>
        <TopBar title="Загрузка…" />
        <div className="content-pad" style={{ textAlign: "center", padding: 80, color: "var(--text-muted)" }}>
          <div className="live-dot" style={{ width: 12, height: 12, borderRadius: 6, margin: "0 auto 12px" }} />
          Загрузка данных заявки…
        </div>
      </>
    );
  }

  const stage = getTimelineStage(issue.status);
  const catToken = CATEGORY_TOKENS[issue.category ?? "other"] ?? CATEGORY_TOKENS.other;

  return (
    <>
      <TopBar
        title={`SB-${String(issue.id).padStart(7, "0")}`}
        subtitle={`${catToken.ru} · ${new Date(issue.created_at).toLocaleString("ru-RU")}`}
      >
        <div style={{ marginLeft: 24 }}>
          <Link href="/issues" style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 12, color: "var(--text-muted)", textDecoration: "none",
          }}>
            <ChevronLeft size={14} />
            Все заявки
          </Link>
        </div>
      </TopBar>

      <div className="content-pad" style={{ overflow: "auto", flex: 1 }}>
        <div className="detail-grid">
          {/* Left column — main content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Photo */}
            {issue.image_url && (
              <div className="card" style={{ overflow: "hidden" }}>
                <img
                  src={issue.image_url}
                  alt="Фото проблемы"
                  style={{
                    width: "100%", maxHeight: 400, objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            )}

            {/* Map */}
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--line-soft)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <MapPin size={14} color={C.amber500} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Местоположение</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>
                  {parseFloat(issue.latitude).toFixed(6)}, {parseFloat(issue.longitude).toFixed(6)}
                </span>
              </div>
              <div style={{ height: 260 }}>
                <IssueMap issues={[issue]} />
              </div>
            </div>

            {/* AI Insight */}
            <div className="ai-card">
              <div className="ai-icon">
                <Sparkles size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                  AI-классификация
                </div>
                <div style={{ fontSize: 12, color: "var(--text-soft)", marginTop: 4 }}>
                  Категория <strong>{catToken.ru}</strong> определена с уверенностью{" "}
                  <strong>{issue.confidence != null ? `${Math.round(issue.confidence * 100)}%` : "N/A"}</strong>.
                  {issue.confidence != null && issue.confidence < 0.7 && (
                    <span style={{ color: C.amber700 }}>
                      {" "}Низкая уверенность — рекомендуется ручная проверка.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {issue.description && (
              <div className="card card-pad">
                <div className="section-label" style={{ marginBottom: 10 }}>Описание от жителя</div>
                <div style={{ fontSize: 13, color: "var(--text-soft)", lineHeight: 1.6 }}>
                  {issue.description}
                </div>
              </div>
            )}
          </div>

          {/* Right column — status & actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Current status */}
            <div className="card card-pad">
              <div className="section-label" style={{ marginBottom: 12 }}>Статус</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <StatusPill status={issue.status} />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Обновлено: {new Date(issue.updated_at).toLocaleString("ru-RU")}
                </span>
              </div>

              {/* Timeline */}
              <div style={{ marginTop: 8 }}>
                {TIMELINE.map((step, i) => {
                  const done = i <= stage;
                  const current = i === stage;
                  return (
                    <div key={step.key} className={`timeline-row ${done && !current ? "done" : ""}`}>
                      {i < TIMELINE.length - 1 && <div className="line" />}
                      <div className={`timeline-dot ${done && !current ? "done" : ""} ${current ? "current" : ""}`} />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 12, fontWeight: 600,
                          color: done ? "var(--text)" : "var(--text-muted)",
                        }}>
                          {step.icon} {step.label}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick info */}
            <div className="card card-pad">
              <div className="section-label" style={{ marginBottom: 12 }}>Информация</div>
              {[
                { icon: <Tag size={13} />, label: "Категория", value: catToken.ru },
                { icon: <Clock size={13} />, label: "Создана", value: new Date(issue.created_at).toLocaleString("ru-RU") },
                { icon: <MapPin size={13} />, label: "Район", value: "Определяется…" },
              ].map((row, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 0",
                  borderTop: i > 0 ? "1px solid var(--line-soft)" : "none",
                }}>
                  <span style={{ color: "var(--text-muted)" }}>{row.icon}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", flex: 1 }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="card card-pad">
              <div className="section-label" style={{ marginBottom: 12 }}>Действия</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {issue.status === "pending" && (
                  <button
                    className="btn-primary"
                    disabled={busy}
                    onClick={() => changeStatus("in_progress")}
                  >
                    <PlayCircle size={16} />
                    Взять в работу
                  </button>
                )}
                {issue.status === "in_progress" && (
                  <button
                    className="btn-primary"
                    disabled={busy}
                    onClick={() => changeStatus("resolved")}
                  >
                    <CheckCircle2 size={16} />
                    Отметить как решено
                  </button>
                )}
                {issue.status === "resolved" && (
                  <button
                    className="btn-primary"
                    disabled={busy}
                    onClick={() => changeStatus("pending")}
                    style={{ background: C.success500, color: "#fff" }}
                  >
                    <CheckCircle2 size={16} />
                    Решена ✓ — вернуть в новые
                  </button>
                )}
                <button
                  className="btn-danger-outline"
                  disabled={busy}
                >
                  <XCircle size={14} style={{ marginRight: 4 }} />
                  Отклонить заявку
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
