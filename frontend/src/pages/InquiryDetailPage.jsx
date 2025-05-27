import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/InquiryDetailPage.css";

export default function InquiryDetailPage() {
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
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    async function fetchInquiry() {
      try {
        const res = await fetch(`/api/inquiries/${id}`);
        if (!res.ok) throw new Error("서버 오류");
        const data = await res.json();
        setInquiry(data);
      } catch (err) {
        console.error("❌ 문의 상세 조회 실패:", err);
        setError("문의 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchInquiry();
  }, [id]);

  const handleReplySubmit = async () => {
    if (!replyInput.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/inquiries/${id}/reply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyInput }),
      });

      if (!res.ok) throw new Error("서버 오류");
      alert("답변이 등록되었습니다.");
      window.location.reload();
    } catch (err) {
      console.error("❌ 답변 등록 실패:", err);
      alert("답변 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="inquiry-detail-wrapper">⏳ 로딩 중...</div>;
  if (error) return <div className="inquiry-detail-wrapper error">{error}</div>;
  if (!inquiry) return null;

  return (
    <div className="inquiry-detail-wrapper">
      <button className="inquiry-back-button" onClick={() => navigate(-1)}>
        ← 목록으로 돌아가기
      </button>

      <div className="inquiry-detail-card">
        <h2 className="inquiry-detail-title">{inquiry.title}</h2>

        <div className="inquiry-info-grid">
          <div>
            <strong>👤 이름</strong>
            <p>{inquiry.name}</p>
          </div>
          <div>
            <strong>🎓 학번</strong>
            <p>{inquiry.student_id}</p>
          </div>
          <div>
            <strong>📧 이메일</strong>
            <p>{inquiry.email}</p>
          </div>
          <div>
            <strong>📅 작성일</strong>
            <p>{new Date(inquiry.created_at).toLocaleString("ko-KR")}</p>
          </div>
        </div>

        <hr className="inquiry-divider" />

        <div className="inquiry-message-section">
          <h3>📋 문의 내용</h3>
          <div className="inquiry-message">{inquiry.message}</div>
        </div>

        <div className="inquiry-reply-section">
          <h3>✅ 관리자 답변</h3>
          {inquiry.reply ? (
            <div className="inquiry-message">{inquiry.reply}</div>
          ) : user?.role === "admin" ? (
            <div style={{ marginTop: "12px" }}>
              <textarea
                rows={5}
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="답변 내용을 입력해주세요"
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
                {submitting ? "등록 중..." : "답변 등록"}
              </button>
            </div>
          ) : (
            <p className="inquiry-no-reply">아직 답변이 등록되지 않았습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
