"use client";

import { Issue, IssueStatus, STATUS_COLORS, STATUS_LABELS, CATEGORY_LABELS, updateIssueStatus } from "@/lib/api";
import { useState } from "react";

export default function IssueTable({
  issues,
  onUpdated,
}: {
  issues: Issue[];
  onUpdated: () => void;
}) {
  const [busyId, setBusyId] = useState<number | null>(null);

  async function changeStatus(id: number, status: IssueStatus) {
    setBusyId(id);
    try {
      await updateIssueStatus(id, status);
      onUpdated();
    } finally {
      setBusyId(null);
    }
  }

  if (issues.length === 0) {
    return <div className="empty">Заявок пока нет</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Фото</th>
          <th>ID</th>
          <th>Категория</th>
          <th>Координаты</th>
          <th>Дата</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue) => (
          <tr key={issue.id}>
            <td>
              {issue.image_url ? (
                <img src={issue.image_url} alt="" className="thumb" />
              ) : (
                <div className="thumb" />
              )}
            </td>
            <td>#{issue.id}</td>
            <td>
              {issue.category ? CATEGORY_LABELS[issue.category] : "—"}
              {issue.confidence != null && (
                <div style={{ fontSize: 11, color: "#999" }}>
                  {Math.round(issue.confidence * 100)}%
                </div>
              )}
            </td>
            <td style={{ fontSize: 11, fontFamily: "monospace" }}>
              {parseFloat(issue.latitude).toFixed(4)},<br />
              {parseFloat(issue.longitude).toFixed(4)}
            </td>
            <td style={{ fontSize: 12 }}>
              {new Date(issue.created_at).toLocaleString("ru-RU")}
            </td>
            <td>
              <span className="badge" style={{ background: STATUS_COLORS[issue.status], marginRight: 6 }}>
                {STATUS_LABELS[issue.status]}
              </span>
              <select
                disabled={busyId === issue.id}
                value={issue.status}
                onChange={(e) => changeStatus(issue.id, e.target.value as IssueStatus)}
              >
                <option value="pending">Отправлено</option>
                <option value="in_progress">В работе</option>
                <option value="resolved">Решено</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
