// src/pages/AddNoticePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";
import "../mobile-ui.css";

export default function AddNoticePage() {
  const { t } = useLang();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError(t("noticeTitleContentRequired"));
      return;
    }
    try {
      const res = await fetch("http://localhost:8090/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error(t("noticeCreateFail"));
      alert(t("noticeCreated"));
      navigate("/");
    } catch {
      setError(t("serverError"));
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">{t("createNotice")}</h1>
      <form onSubmit={handleSubmit} style={{ padding: "0 16px" }}>
        <input
          className="input"
          placeholder={t("noticeTitlePlaceholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input"
          placeholder={t("noticeContentPlaceholder")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          style={{ resize: "none" }}
        />
        {error && (
          <p style={{ color: "red", marginTop: "8px" }}>{error}</p>
        )}
        <button type="submit" className="btn-primary">
          {t("createNotice")}
        </button>
      </form>
    </div>
  );
}
