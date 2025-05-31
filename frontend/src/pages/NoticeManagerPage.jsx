// src/pages/NoticeManagerPage.jsx
import React, { useEffect, useState } from "react";
import "../mobile-ui.css";
import { useLang } from "../locale";

export default function NoticeManagerPage() {
  const { t, lang } = useLang();
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const isDark =
    typeof document !== "undefined" &&
    document.body.classList.contains("dark");

  // 공지사항 목록 불러오기
  useEffect(() => {
    fetch("http://localhost:8090/api/notices")
      .then((res) => res.json())
      .then((data) => {
        setNotices(data);
        // 콘솔에서 데이터 직접 확인 가능
        console.log("notices:", data);
      })
      .catch(() => alert(t("noticeLoadError")));
  }, [t]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditId(null);
    setError("");
  };

  // 등록 or 수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError(t("titleContentRequired"));
      return;
    }

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:8090/api/notices/${editId}`
        : "http://localhost:8090/api/notices";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("fail");

      alert(editId ? t("noticeUpdated") : t("noticeCreated"));
      window.location.reload();
    } catch (err) {
      setError(t("serverError"));
    }
  };

  // 수정 버튼 클릭 → 값 세팅
  const handleEdit = (notice) => {
    setTitle(notice.title);
    setContent(notice.content);
    setEditId(notice.id);
  };

  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDelete"))) return;

    try {
      const res = await fetch(`http://localhost:8090/api/notices/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      alert(t("noticeDeleted"));
      window.location.reload();
    } catch {
      alert(t("deleteError"));
    }
  };

  return (
    <div
      className="app-wrapper"
      style={{
        background: isDark ? "#23242c" : undefined,
        minHeight: "100vh",
        transition: "background 0.2s",
      }}
    >
      <h1
        className="title"
        style={{
          color: isDark ? "#ffd377" : "#232323",
          marginTop: 0,
        }}
      >
        📢 {t("noticeManager")}
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: "0 16px",
          marginBottom: "24px",
        }}
      >
        <input
          className="input"
          placeholder={t("title")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            background: isDark ? "#252735" : "#fff",
            color: isDark ? "#ffe4ad" : "#232323",
            border: `1px solid ${isDark ? "#393a4b" : "#ccc"}`,
            transition: "background 0.2s, color 0.2s, border 0.2s",
          }}
        />
        <textarea
          className="input"
          placeholder={t("content")}
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            background: isDark ? "#252735" : "#fff",
            color: isDark ? "#ffe4ad" : "#232323",
            border: `1px solid ${isDark ? "#393a4b" : "#ccc"}`,
            transition: "background 0.2s, color 0.2s, border 0.2s",
          }}
        />
        {error && (
          <p
            style={{
              color: isDark ? "#ff8a80" : "red",
              marginBottom: "8px",
            }}
          >
            {error}
          </p>
        )}
        <button
          className="btn-primary"
          type="submit"
          style={{
            background: isDark ? "#d19c66" : "#faad14",
            color: isDark ? "#22242a" : "#fff",
            fontWeight: "bold",
            borderRadius: "10px",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          {editId ? t("editNotice") : t("createNotice")}
        </button>
        {editId && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              background: "transparent",
              color: isDark ? "#bfbfbf" : "#888",
              textDecoration: "underline",
              marginTop: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {t("cancel")}
          </button>
        )}
      </form>

      <hr
        style={{
          margin: "16px 0",
          borderColor: isDark ? "#333848" : "#eee",
        }}
      />

      <div style={{ padding: "0 16px" }}>
        {notices.map((n) => (
          <div
            key={n.id}
            style={{
              ...noticeBox,
              backgroundColor: isDark ? "#262730" : "#fff",
              border: `1px solid ${isDark ? "#393a4b" : "#eee"}`,
              color: isDark ? "#ffe4ad" : "#232323",
              boxShadow: isDark
                ? "0 2px 8px rgba(0,0,0,0.18)"
                : "0 2px 8px rgba(0,0,0,0.04)",
              transition: "background 0.2s, color 0.2s, border 0.2s",
            }}
          >
            <h3
              style={{
                color: isDark ? "#b8c1d8" : "#334",
                fontWeight: "bold",
                fontSize: "1.1rem",
                margin: 0,
                marginBottom: "6px",
              }}
            >
              {/* 언어에 따라 표시 */}
              {lang === "en"
                ? n.title_en || n.title
                : n.title}
            </h3>
            <p
              style={{
                color: isDark ? "#c6c6e3" : "#7c7c7c",
                fontSize: "1rem",
                margin: 0,
                marginBottom: "10px",
                lineHeight: 1.6,
              }}
            >
              {lang === "en"
                ? n.content_en || n.content
                : n.content}
            </p>
            <p style={{ fontSize: "0.8rem", color: isDark ? "#888" : "#999" }}>
              📅 {new Date(n.created_at).toLocaleDateString(lang === "en" ? "en-US" : "ko-KR")}
            </p>
            <div style={{ marginTop: "8px" }}>
              <button
                onClick={() => handleEdit(n)}
                style={{
                  ...editBtn,
                  backgroundColor: isDark ? "#378d57" : "#4caf50",
                  color: "#fff",
                }}
              >
                {t("edit")}
              </button>
              <button
                onClick={() => handleDelete(n.id)}
                style={{
                  ...deleteBtn,
                  backgroundColor: isDark ? "#e86363" : "#f44336",
                  color: "#fff",
                }}
              >
                {t("delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 스타일 오브젝트
const noticeBox = {
  border: "1px solid #eee",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "16px",
  backgroundColor: "#fff",
};
const editBtn = {
  padding: "6px 12px",
  marginRight: "8px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
const deleteBtn = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
