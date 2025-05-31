// src/pages/MessageInboxPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";

export default function MessageInboxPage() {
  const navigate = useNavigate();
  const { t } = useLang();

  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

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

  const fetchMessages = () => {
    if (!user) return;
    fetch(`/api/messages/received/${user.student_id}`)
      .then((res) => {
        if (!res.ok) throw new Error(t("cannotLoadMessages"));
        return res.json();
      })
      .then(setMessages)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchMessages();
  }, [user, t]);

  const handleDelete = (id) => {
    if (!window.confirm(t("confirmDeleteMessage"))) return;
    fetch(`/api/messages/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error(t("deleteFailed"));
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      })
      .catch((err) => {
        alert("❌ " + t("deleteError") + ": " + err.message);
      });
  };

  const markAsRead = async (msgId) => {
    try {
      await fetch(`/api/messages/${msgId}/read`, { method: "PATCH" });
      fetchMessages(); // 다시 불러서 is_read 반영
    } catch (err) {
      console.error("읽음 처리 실패", err);
    }
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
      {/* 🔙 뒤로가기 버튼 추가 */}
      <button
        onClick={() => navigate(-1)}
        style={{
          margin: "12px 16px 0",
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          background: "#f9f9f9",
          cursor: "pointer",
        }}
      >
        ← 뒤로가기
      </button>

      <h2 style={{ margin: "16px", fontSize: "1.4rem", color: isDark ? "#ffd377" : "#d19c66" }}>
        📥 {t("inbox")}
      </h2>

      {messages.length === 0 ? (
        <p style={{ textAlign: "center", color: isDark ? "#999" : "#aaa" }}>{t("noInboxMessages")}</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              background: isDark ? "#232533" : msg.is_read ? "#f5f5f5" : "#fff1e6",
              color: isDark ? "#ffe8ad" : "#222",
              margin: "16px",
              padding: "16px",
              borderRadius: "12px",
              boxShadow: isDark
                ? "0 2px 12px rgba(0,0,0,0.16)"
                : "0 1px 4px rgba(0,0,0,0.06)",
              position: "relative",
              transition: "background 0.18s, color 0.18s",
            }}
          >
            <p style={{ fontWeight: "bold", color: isDark ? "#ffd377" : "#222" }}>
              {msg.content.split("\n")[0]}
            </p>
            <p style={{ margin: "8px 0", color: isDark ? "#fff" : "#333" }}>
              {msg.content.split("\n").slice(1).join("\n")}
            </p>
            <p style={{ fontSize: "0.82rem", color: isDark ? "#bbb" : "#888" }}>
              {t("sender")}: {msg.sender_id} /{" "}
              {new Date(msg.sent_at).toLocaleString("ko-KR")}
            </p>

            <div style={{ marginTop: "8px" }}>
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
                  boxShadow: isDark ? "0 1px 4px #101119" : undefined,
                }}
              >
                {t("delete")}
              </button>
              <button
                onClick={() => navigate(`/send-message?receiver_id=${msg.sender_id}`)}
                style={{
                  backgroundColor: "#2196f3",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  marginLeft: "8px",
                  boxShadow: isDark ? "0 1px 4px #101119" : undefined,
                }}
              >
                {t("reply")}
              </button>
              {!msg.is_read && (
                <button
                  onClick={() => markAsRead(msg.id)}
                  style={{
                    marginLeft: "8px",
                    backgroundColor: "#ffa000",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  ✅ {t("markAsRead")}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
