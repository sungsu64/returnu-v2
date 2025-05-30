// src/pages/MessageSendPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLang } from "../locale";

export default function MessageSendPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [params] = useSearchParams();
  const receiver_id = params.get("to");

  const [senderId, setSenderId] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setSenderId(user.student_id);
    } else {
      alert(t("loginRequired"));
      navigate("/login");
    }
  }, [navigate, t]);

  const handleSend = async () => {
    if (!content.trim()) {
      setError(t("contentRequired"));
      return;
    }

    try {
      const res = await fetch("http://localhost:8090/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: senderId, receiver_id, content }),
      });

      if (!res.ok) throw new Error(t("sendFailed"));

      alert(t("messageSent"));
      navigate(-1);
    } catch (e) {
      setError(t("sendError"));
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "auto", padding: "24px" }}>
      <h2 style={{ color: "#d19c66", marginBottom: "16px" }}>
        📬 {t("sendMessage")}
      </h2>

      <p>
        <strong>{t("receiverIdLabel")}</strong> {receiver_id}
      </p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("messagePlaceholder")}
        rows={6}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          resize: "none",
          marginTop: "12px",
          marginBottom: "8px",
        }}
      />

      {error && (
        <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>
      )}

      <button
        onClick={handleSend}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#d19c66",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer",
          marginTop: "12px",
        }}
      >
        {t("sendButton")}
      </button>
    </div>
  );
}
