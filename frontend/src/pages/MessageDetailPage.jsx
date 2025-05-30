// src/pages/MessageDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "../locale";

export default function MessageDetailPage() {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:8090/api/messages/${id}`);
        if (!res.ok) throw new Error(t("loadFailed"));
        const data = await res.json();
        setMessage(data);

        // 읽음 처리
        await fetch(`http://localhost:8090/api/messages/read/${id}`, {
          method: "PATCH",
        });
      } catch {
        alert(t("cannotLoadMessageInfo"));
      }
    }
    fetchData();
  }, [id, t]);

  if (!message) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        ⏳ {t("loadingDetail")}
      </p>
    );
  }

  return (
    <div style={{ maxWidth: "480px", margin: "auto", padding: "24px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "10px" }}>
        ← {t("back")}
      </button>
      <h2 style={{ color: "#d19c66" }}>📨 {t("messageDetail")}</h2>
      <p>
        <strong>{t("sender")}:</strong> {message.sender_id}
      </p>
      <p>
        <strong>{t("recipient")}:</strong> {message.receiver_id}
      </p>
      <p>
        <strong>{t("sentAt")}:</strong>{" "}
        {new Date(message.sent_at).toLocaleString()}
      </p>
      <p style={{ whiteSpace: "pre-line", marginTop: "16px" }}>
        {message.content}
      </p>
    </div>
  );
}
