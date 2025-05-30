// src/pages/SendMessagePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLang } from "../locale";

export default function SendMessagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();

  const [receiverId, setReceiverId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const senderId = storedUser.student_id;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const rid = params.get("receiver_id");
    if (rid) {
      setReceiverId(rid);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!receiverId || !senderId || !title || !content) {
      setError(t("allFieldsRequired"));
      return;
    }

    const fullMessage = `제목: ${title}\n\n내용: ${content}`;

    try {
      const res = await fetch("http://localhost:8090/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: senderId,
          receiver_id: receiverId,
          content: fullMessage,
        }),
      });

      if (!res.ok) throw new Error("fail");
      alert(t("messageSent"));
      navigate("/my");
    } catch (err) {
      console.error(err);
      setError(t("messageSendError"));
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "auto", padding: "24px" }}>
      <h2 style={{ color: "#d33", marginBottom: "16px" }}>
        📨 {t("sendMessage")}
      </h2>
      {error && <p style={{ color: "crimson" }}>❌ {error}</p>}
      <form onSubmit={handleSubmit}>
        <label>{t("receiverId")}</label>
        <input
          type="text"
          value={receiverId}
          disabled
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />

        <label>{t("title")}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />

        <label>{t("content")}</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#ffb347",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {t("send")}
        </button>
      </form>
    </div>
  );
}
