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

    fetch(`/api/messages/received/${user.student_id}`)
      .then((res) => {
        if (!res.ok) throw new Error(t("cannotLoadMessages"));
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
      <h2 style={{ margin: "16px", fontSize: "1.4rem" }}>
        📥 {t("inbox")}
      </h2>

      {messages.length === 0 ? (
        <p style={{ textAlign: "center", color: "#aaa" }}>
          {t("noInboxMessages")}
        </p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} style={cardStyle}>
            <p style={{ fontWeight: "bold" }}>
              {msg.content.split("\n")[0]}
            </p>
            <p style={{ margin: "8px 0" }}>
              {msg.content.split("\n").slice(1).join("\n")}
            </p>
            <p style={{ fontSize: "0.8rem", color: "#888" }}>
              {t("sender")}: {msg.sender_id} /{" "}
              {new Date(msg.sent_at).toLocaleString("ko-KR")}
            </p>

            <div style={{ marginTop: "8px" }}>
              <button onClick={() => handleDelete(msg.id)} style={deleteBtnStyle}>
                {t("delete")}
              </button>
              <button
                onClick={() =>
                  navigate(`/send-message?receiver_id=${msg.sender_id}`)
                }
                style={replyBtnStyle}
              >
                {t("reply")}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const cardStyle = {
  background: "#fff8f0",
  margin: "16px",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  position: "relative",
};

const deleteBtnStyle = {
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.8rem",
};

const replyBtnStyle = {
  backgroundColor: "#2196f3",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.8rem",
  marginLeft: "8px",
};
