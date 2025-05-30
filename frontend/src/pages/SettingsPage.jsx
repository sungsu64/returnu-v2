// src/pages/SettingsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale"; // ← 추가


export default function SettingsPage() {
  const { lang, setLang, t } = useLang(); // ← useLang 훅으로 언어 관리
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "";
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("user");
    alert(t("logout") + " " + t("completed")); // alert도 번역 적용
    navigate("/login");
  };

  // 비밀번호 변경 이동
  const handleChangePw = () => {
    navigate("/change-password");
  };

  const isDark = theme === "dark";

  return (
    <div
      className="settings-wrapper"
      style={{
        minHeight: 400,
        paddingTop: 36,
        background: isDark ? "#22242b" : "#fff",
        color: isDark ? "#f3f3f3" : "#232323",
        borderRadius: 18,
        boxShadow: "0 2px 12px rgba(0,0,0,0.09)",
        maxWidth: 400,
        margin: "40px auto",
        transition: "background 0.2s, color 0.2s",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#f38c3f", margin: "0 0 24px 0" }}>
        <span style={{ fontSize: "2rem" }}>⚙️</span> {t("settings")}
      </h2>

      <div
        className="settings-menu"
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <button
          className="settings-btn"
          style={{
            ...btnStyle,
            background: isDark ? "#252735" : "#faf6f0",
            color: isDark ? "#ffce81" : "#444",
          }}
          onClick={handleChangePw}
        >
          🔑 {t("changePassword")}
        </button>
        <button
          className="settings-btn"
          style={{
            ...btnStyle,
            background: isDark ? "#252735" : "#faf6f0",
            color: isDark ? "#ffce81" : "#444",
          }}
          onClick={handleLogout}
        >
          🔒 {t("logout")}
        </button>
      </div>

      {/* 다크/라이트, 한/영 토글 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "28px",
          gap: "28px",
        }}
      >
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          style={{
            ...toggleBtnStyle,
            background: isDark ? "#22242b" : "#fff",
            color: isDark ? "#ffe1ac" : "#232323",
            borderColor: isDark ? "#55576b" : "#ddd",
          }}
        >
          {isDark ? t("dark") : t("light")}
        </button>
        <button
          onClick={() => setLang(lang === "ko" ? "en" : "ko")}
          style={{
            ...toggleBtnStyle,
            background: isDark ? "#22242b" : "#fff",
            color: isDark ? "#ffe1ac" : "#232323",
            borderColor: isDark ? "#55576b" : "#ddd",
          }}
        >
          {lang === "ko" ? "🇰🇷 " + t("korean") : "🇺🇸 " + t("english")}
        </button>
      </div>

      <div
        style={{
          textAlign: "center",
          color: isDark ? "#888" : "#bbb",
          marginTop: "40px",
          fontSize: "1rem",
        }}
      >
        ReturnU {t("settings")} {t("page")}
      </div>
    </div>
  );
}

// 인라인 스타일
const btnStyle = {
  width: "100%",
  padding: "18px 0",
  border: "none",
  borderRadius: "13px",
  fontSize: "1.13rem",
  fontWeight: 500,
  textAlign: "left",
  cursor: "pointer",
  transition: "background 0.14s, color 0.14s",
};

const toggleBtnStyle = {
  display: "flex",
  alignItems: "center",
  border: "1.5px solid #ddd",
  borderRadius: "20px",
  padding: "12px 26px",
  fontSize: "1.08rem",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  cursor: "pointer",
  fontWeight: 500,
  gap: "10px",
  transition: "background 0.2s, color 0.2s, border-color 0.2s",
};
