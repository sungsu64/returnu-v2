// src/pages/InquiryDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/InquiryDetailPage.css";

export default function InquiryDetailPage() {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [replyInput, setReplyInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    async function fetchInquiry() {
      try {
        const res = await fetch(`/api/inquiries/${id}`);
        if (!res.ok) throw new Error(t("serverError"));
        const data = await res.json();
        setInquiry(data);
      } catch (err) {
        console.error("❌ 문의 상세 조회 실패:", err);
        setError(t("loadInquiryFailed"));
      } finally {
        setLoading(false);
      }
    }
    fetchInquiry();
  }, [id, t]);

  const handleReplySubmit = async () => {
    if (!replyInput.trim()) {
      alert(t("replyRequired"));
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`/api/inquiries/${id}/reply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyInput }),
      });
      if (!res.ok) throw new Error(t("serverError"));
      alert(t("replySuccess"));
      window.location.reload();
    } catch (err) {
      console.error("❌ 답변 등록 실패:", err);
      alert(t("replyFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="inquiry-detail-wrapper">⏳ {t("loading")}</div>;
  if (error)   return <div className="inquiry-detail-wrapper error">{error}</div>;
  if (!inquiry) return null;

  return (
    <div className="inquiry-detail-wrapper">
      <button className="inquiry-back-button" onClick={() => navigate(-1)}>
        ← {t("backToList")}
      </button>

      <div className="inquiry-detail-card">
        <h2 className="inquiry-detail-title">{inquiry.title}</h2>

        <div className="inquiry-info-grid">
          <div>
            <strong>👤 {t("nameLabel")}</strong>
            <p>{inquiry.name}</p>
          </div>
          <div>
            <strong>🎓 {t("studentIdLabel")}</strong>
            <p>{inquiry.student_id}</p>
          </div>
          <div>
            <strong>📧 {t("emailLabel")}</strong>
            <p>{inquiry.email}</p>
          </div>
          <div>
            <strong>📅 {t("createdAtLabel")}</strong>
            <p>{new Date(inquiry.created_at).toLocaleString("ko-KR")}</p>
          </div>
        </div>

        <hr className="inquiry-divider" />

        <div className="inquiry-message-section">
          <h3>📋 {t("inquiryContent")}</h3>
          <div className="inquiry-message">{inquiry.message}</div>
        </div>

        <div className="inquiry-reply-section">
          <h3>✅ {t("adminReply")}</h3>
          {inquiry.reply ? (
            <div className="inquiry-message">{inquiry.reply}</div>
          ) : user?.role === "admin" ? (
            <div style={{ marginTop: "12px" }}>
              <textarea
                rows={5}
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder={t("replyPlaceholder")}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "0.95rem",
                  resize: "vertical",
                }}
              />
              <button
                onClick={handleReplySubmit}
                disabled={submitting}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {submitting ? t("submitting") : t("submitReply")}
              </button>
            </div>
          ) : (
            <p className="inquiry-no-reply">{t("noReplyYet")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
