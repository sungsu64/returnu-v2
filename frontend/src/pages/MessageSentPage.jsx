// src/pages/MessageSentPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";

export default function MessageSentPage() {
  const navigate = useNavigate();
  const { t } = useLang();

  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // 다크모드 감지
  const isDark = typeof document !== "undefined" && document.body.classList.contains("dark");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert(t("loginRequired"));
      navigate("/login");
    } else {
      setUser(JSON.parse(stored));
    }
  }, [navigate, t]);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/messages/sent/${user.student_id}`)
      .then((res) => {
        if (!res.ok) throw new Error(t("cannotLoadSentMessages"));
        return res.json();
      })
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [user, t]);

  const handleDelete = (id) => {
    if (!window.confirm(t("confirmDeleteMessage"))) return;

    fetch(`/api/messages/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error(t("deleteFailed"));
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      })
      .catch((err) => {
        alert("❌ " + t("deleteError") + ": " + err.message);
      });
  };

  if (error) {
    return (
      <div className="app-wrapper">
        ❌ {t("error")}: {error}
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <h2
        style={{
          margin: "16px",
          fontSize: "1.4rem",
          color: isDark ? "#ffd377" : "#1676b3"
        }}
      >
        📤 {t("sentMessages")}
      </h2>

      {messages.length === 0 ? (
        <p style={{ textAlign: "center", color: isDark ? "#aaa" : "#666" }}>
          {t("noSentMessages")}
        </p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              background: isDark ? "#232533" : "#f3faff",
              color: isDark ? "#e8f6fa" : "#222",
              margin: "16px",
              padding: "16px",
              borderRadius: "12px",
              boxShadow: isDark
                ? "0 2px 12px rgba(0,0,0,0.16)"
                : "0 1px 4px rgba(0,0,0,0.06)",
              position: "relative",
              transition: "background 0.18s, color 0.18s"
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                color: isDark ? "#ffe4ad" : "#1676b3"
              }}
            >
              {msg.content.split("\n")[0]}
            </p>
            <p style={{ margin: "8px 0", color: isDark ? "#fff" : "#333" }}>
              {msg.content.split("\n").slice(1).join("\n")}
            </p>
            <p style={{ fontSize: "0.8rem", color: isDark ? "#bbb" : "#888" }}>
              {t("recipient")}: {msg.receiver_id} /{" "}
              {new Date(msg.sent_at).toLocaleString("ko-KR")}
            </p>
            <button
              onClick={() => handleDelete(msg.id)}
              style={{
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.8rem",
                marginTop: "8px",
                boxShadow: isDark ? "0 1px 4px #101119" : undefined
              }}
            >
              {t("delete")}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
