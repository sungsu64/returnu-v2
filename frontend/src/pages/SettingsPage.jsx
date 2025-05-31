// src/pages/SettingsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/SettingsPage.css";

export default function SettingsPage() {
  const { lang, setLang, t } = useLang();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert(t("logout") + " " + t("completed"));
    navigate("/login");
  };

  const handleChangePw = () => {
    navigate("/change-password");
  };

  const isDark = theme === "dark";

  return (
    <div className={`settings-wrapper ${isDark ? "dark" : ""}`}>
      <button className="back-button" onClick={() => navigate(-1)}>
        ← {t("back")}
      </button>

      <h2 className="settings-title">
        <span role="img" aria-label="gear">⚙️</span> {t("settings")}
      </h2>

      <div className="settings-menu">
        <button className="settings-btn" onClick={handleChangePw}>
          🔑 {t("changePassword")}
        </button>
        <button className="settings-btn" onClick={handleLogout}>
          🔒 {t("logout")}
        </button>
      </div>

      <div className="settings-toggle">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="toggle-btn"
        >
          {isDark ? t("dark") : t("light")}
        </button>
        <button
          onClick={() => setLang(lang === "ko" ? "en" : "ko")}
          className="toggle-btn"
        >
          {lang === "ko" ? "🇰🇷 " + t("korean") : "🇺🇸 " + t("english")}
        </button>
      </div>

      <div className="settings-footer">
        ReturnU {t("settings")} {t("page")}
      </div>
    </div>
  );
}
