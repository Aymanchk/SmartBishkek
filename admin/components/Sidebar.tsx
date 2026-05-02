"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, Map, ListTodo, Users, LayoutGrid, Settings, LogOut,
} from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

const items = [
  { href: "/",          label: "Дашборд",   Icon: BarChart3 },
  { href: "/map",       label: "Карта",     Icon: Map },
  { href: "/issues",    label: "Заявки",    Icon: ListTodo, badge: undefined as number | undefined },
  { href: "/crews",     label: "Бригады",   Icon: Users },
  { href: "/analytics", label: "Аналитика", Icon: LayoutGrid },
  { href: "/settings",  label: "Настройки", Icon: Settings },
];

export default function Sidebar({ openIssuesCount }: { openIssuesCount?: number }) {
  const pathname = usePathname();
  const { settings } = useSettings();

  const initials = `${settings.firstName.charAt(0)}${settings.lastName.charAt(0)}`.toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">{settings.systemName.charAt(0)}</div>
        <div>
          <div className="sidebar-brand-text">{settings.systemName}</div>
          <div className="sidebar-brand-sub">оператор · v2.4</div>
        </div>
      </div>

      <div className="sidebar-section">Меню</div>
      <nav className="sidebar-nav">
        {items.map(({ href, label, Icon, badge }) => {
          const isActive = href === "/"
            ? pathname === "/"
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-item ${isActive ? "active" : ""}`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.6} />
              <span>{label}</span>
              {label === "Заявки" && openIssuesCount != null && (
                <span className="badge">{openIssuesCount}</span>
              )}
              {badge != null && <span className="badge">{badge}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{settings.firstName} {settings.lastName.charAt(0)}.</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)" }}>Мэрия · {settings.district}</div>
        </div>
        <LogOut
          size={16}
          color="rgba(255,255,255,.5)"
          style={{ cursor: "pointer" }}
          onClick={() => {
            document.cookie = "sb_auth=; path=/; max-age=0";
            window.location.href = "/login";
          }}
        />
      </div>
    </aside>
  );
}
