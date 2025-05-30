// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";

export default function LoginPage() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useLang();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:8090/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, password }),
      });
      if (!res.ok) throw new Error(t("loginFailed"));
      const { user } = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      alert(t("loginSuccess"));
      navigate("/my");
    } catch (err) {
      setError(t("loginError"));
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">🔐 {t("loginTitle")}</h1>
      <form onSubmit={handleLogin} style={{ padding: "16px" }}>
        <input
          className="input"
          type="text"
          placeholder={t("loginIdPlaceholder")}
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder={t("loginPwPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn-primary" type="submit">
          {t("loginButton")}
        </button>
        {error && (
          <p style={{ color: "red", marginTop: "12px" }}>{error}</p>
        )}
      </form>
    </div>
  );
}
