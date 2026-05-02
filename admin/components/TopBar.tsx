"use client";

import { Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function TopBar({
  title, subtitle, children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const { theme, toggle } = useTheme();
  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
      <div className="topbar-search">
        <Search size={16} />
        <input placeholder="№SB-… или адрес" />
      </div>
      <button className="icon-btn" onClick={toggle} aria-label="Theme">
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <button className="icon-btn" aria-label="Notifications">
        <Bell size={16} />
        <span className="badge-dot">5</span>
      </button>
    </div>
  );
}
