import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";

export default function MyPage() {
  const navigate = useNavigate();
  const { t } = useLang();

  const [user, setUser] = useState(null);
  const [expiringItems, setExpiringItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminUnreadInquiryCount, setAdminUnreadInquiryCount] = useState(0);
  const [studentAnsweredUnreadCount, setStudentAnsweredUnreadCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      alert(t("loginRequired"));
      navigate("/login");
    }
  }, [navigate, t]);

  const fetchMyData = useCallback(async () => {
    try {
      const expRes = await fetch(`/api/lost-items/expiring-soon`);
      setExpiringItems(await expRes.json());
    } catch (err) {
      console.error(t("dataLoadError"), err);
    }
  }, [t]);

  useEffect(() => {
    if (user?.student_id && user?.role) {
      fetchMyData();

      fetch(`/api/messages/received/${user.student_id}`)
        .then((res) => res.json())
        .then((msgs) => {
          const unread = msgs.filter((m) => m.is_read === 0);
          setUnreadCount(unread.length);
        });

      if (user.role === "admin") {
        fetch("/api/inquiries")
          .then((res) => res.json())
          .then((inqs) => {
            const unread = inqs.filter((q) => q.is_checked === 0);
            setAdminUnreadInquiryCount(unread.length);
          })
          .catch((err) => console.error("문의 리스트 로딩 실패", err));
      } else {
        fetch(`/api/inquiries/by-student/${user.student_id}`)
          .then((res) => res.json())
          .then((inqs) => {
            const unreadReplies = inqs.filter(
              (q) =>
                typeof q.reply === "string" &&
                q.reply.trim().length > 0 &&
                q.reply_checked === 0
            );
            setStudentAnsweredUnreadCount(unreadReplies.length);
          })
          .catch((err) => {
            console.error("문의 알림 로딩 오류:", err);
            setStudentAnsweredUnreadCount(0);
          });
      }
    }
  }, [user, fetchMyData, t]);

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      alert(t("feedbackRequired"));
      return;
    }
    try {
      await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: user.student_id,
          content: feedback,
        }),
      });
      setFeedback("");
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 3000);
    } catch {
      alert(t("feedbackError"));
    }
  };

  if (!user) return <div className="app-wrapper">⏳ {t("loadingUser")}</div>;

  const isDark = typeof document !== "undefined" && document.body.classList.contains("dark");

  return (
    <div
      className="app-wrapper"
      style={{
        background: "var(--color-bg-desktop)",
        minHeight: "100vh",
        padding: "20px 0",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          background: "var(--color-bg-app)",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="default"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                marginRight: "12px",
              }}
            />
            <div>
              <div style={{ fontWeight: "bold", fontSize: "1rem", textAlign: "left" }}>{user.name}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                {t("studentId")}: {user.student_id}
              </div>
            </div>
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
            onClick={() => navigate("/settings")}
            aria-label={t("settings")}
          >
            ⚙️
          </button>
        </div>

        {user.role === "admin" && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <button
              onClick={() => navigate("/notices/manage")}
              style={{
                padding: "6px 10px",
                backgroundColor: isDark ? "#ffc964" : "#ffe082",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.95rem",
                cursor: "pointer",
                color: isDark ? "#242424" : "#444",
                fontWeight: 600,
              }}
            >
              📢 {t("createNotice")}
            </button>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "24px" }}>
          <CircleBtn label={t("myPosts")} icon="🗂️" onClick={() => navigate("/myposts")} />
          <CircleBtn
            label={t("inquiryHistory")}
            icon="📨"
            unreadCount={
              user.role === "admin" ? adminUnreadInquiryCount : studentAnsweredUnreadCount
            }
            onClick={() =>
              user.role === "admin" ? navigate("/admin/inquiries") : navigate("/contact/history")
            }
          />
         <CircleBtn
  label={user.role === "admin" ? "피드백 모음" : "클릭해봐"}
  icon="🎁"
  onClick={() =>
    user.role === "admin" ? navigate("/admin/feedback") : navigate("/easter-egg")
  }
/>


        </div>

        <MenuItem
          label={t("inbox")}
          onClick={() => navigate("/messages/inbox")}
          unreadCount={unreadCount}
        />
        <MenuItem
          label={t("sent")}
          onClick={() => navigate("/messages/sent")}
        />

        {expiringItems.length > 0 && (
          <>
            <h3 style={titleStyle}>⏰ {t("expiringSoon")}</h3>
            <ul style={ulStyle}>
              {expiringItems.map((item) => {
                const dDay = Math.ceil((new Date(item.expireDate) - Date.now()) / 86400000);
                return (
                  <li key={item.id}>
                    {item.title} – D-{dDay <= 0 ? t("dDay") : dDay}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {user.role !== "admin" && (
          <>
            <h3 style={titleStyle}>💬 {t("feedbackHeading")}</h3>
            <textarea
              value={feedback}
              rows={4}
              placeholder={t("feedbackPlaceholder")}
              onChange={(e) => setFeedback(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "10px",
                padding: "12px",
                border: "1px solid var(--color-border)",
                resize: "vertical",
                background: "var(--color-bg-app)",
                color: "var(--color-text)",
              }}
            />
            <button
              onClick={handleFeedbackSubmit}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "10px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              {t("submit")}
            </button>
            {feedbackSent && (
              <p style={{ color: "#4caf50", marginTop: "8px" }}>
                ✅ {t("feedbackSentSuccess")}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const CircleBtn = ({ label, icon, onClick, unreadCount }) => (
  <div style={{ position: "relative" }}>
    <button
      onClick={onClick}
      style={{
        width: "72px",
        height: "72px",
        borderRadius: "50%",
        background: "var(--color-card-bg, #fff7e6)",
        border: "1px solid #f5c16c",
        fontSize: "0.8rem",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "var(--color-text)",
      }}
    >
      <span style={{ fontSize: "1.2rem", marginBottom: "2px" }}>{icon}</span>
      {label}
    </button>
    {unreadCount > 0 && (
      <span
        style={{
          position: "absolute",
          top: -4,
          right: -4,
          backgroundColor: "red",
          color: "white",
          borderRadius: "50%",
          width: "18px",
          height: "18px",
          fontSize: "11px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    )}
  </div>
);

const MenuItem = ({ label, onClick, unreadCount }) => (
  <div
    onClick={onClick}
    style={{
      background: "var(--color-bg-muted, #f9f9f9)",
      borderRadius: "12px",
      padding: "14px 16px",
      marginBottom: "10px",
      fontSize: "0.95rem",
      position: "relative",
      cursor: "pointer",
      fontWeight: "500",
      color: "var(--color-text)",
    }}
  >
    {label}
    {unreadCount > 0 && (
      <span
        style={{
          position: "absolute",
          right: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "red",
          color: "white",
          borderRadius: "50%",
          width: "18px",
          height: "18px",
          fontSize: "11px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    )}
  </div>
);

const titleStyle = {
  marginTop: "20px",
  fontSize: "1rem",
  fontWeight: "600",
  color: "var(--color-muted)",
};
const ulStyle = {
  paddingLeft: "20px",
  fontSize: "0.9rem",
  marginBottom: "10px",
  color: "var(--color-text)",
};
