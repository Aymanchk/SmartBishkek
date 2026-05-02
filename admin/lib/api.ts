export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type IssueStatus = "pending" | "in_progress" | "resolved";
export type IssueCategory = "pothole" | "garbage" | "lighting" | "other" | null;

export interface Issue {
  id: number;
  image_url: string | null;
  latitude: string;
  longitude: string;
  category: IssueCategory;
  confidence: number | null;
  description: string;
  status: IssueStatus;
  created_at: string;
  updated_at: string;
}

export async function fetchIssues(): Promise<Issue[]> {
  const res = await fetch(`${API_URL}/api/issues/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch issues");
  return res.json();
}

export async function updateIssueStatus(id: number, status: IssueStatus): Promise<Issue> {
  const res = await fetch(`${API_URL}/api/issues/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update issue");
  return res.json();
}

export const CATEGORY_LABELS: Record<string, string> = {
  pothole: "Яма",
  garbage: "Мусор",
  lighting: "Освещение",
  other: "Другое",
};

export const STATUS_LABELS: Record<IssueStatus, string> = {
  pending: "Отправлено",
  in_progress: "В работе",
  resolved: "Решено",
};

export const STATUS_COLORS: Record<IssueStatus, string> = {
  pending: "#e74c3c",
  in_progress: "#f39c12",
  resolved: "#27ae60",
};
