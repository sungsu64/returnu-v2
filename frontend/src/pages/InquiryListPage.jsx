import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/InquiryListPage.css";

export default function InquiryListPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert(t("loginRequired"));
      navigate("/login");
      return;
    }

    const { student_id } = JSON.parse(stored);

    fetch(`/api/inquiries/by-student/${student_id}`)
      .then((res) => {
        if (!res.ok) throw new Error(t("serverError"));
        return res.json();
      })
      .then((data) => setInquiries(data))
      .catch((err) => {
        console.error("❌ 문의 목록 불러오기 실패:", err);
        setError(t("loadInquiriesFailed"));
      })
      .finally(() => setLoading(false));
  }, [navigate, t]);

  const handleWriteInquiry = () => navigate("/contact");

  const handleViewDetail = async (inq) => {
    const hasReply = typeof inq.reply === "string" && inq.reply.trim().length > 0;

    // ✅ 답변이 있고, reply_checked가 아직 0이면 읽음 처리
    if (hasReply && inq.reply_checked === 0) {
      try {
        await fetch(`/api/inquiries/${inq.id}/reply-read`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("✅ reply_checked 처리됨");
      } catch (err) {
        console.error("❌ 읽음 처리 실패:", err);
      }
    }

    navigate(`/contact/${inq.id}`);
  };

  const handleBack = () => navigate(-1);

  if (loading)
    return <div className="inquiry-wrapper">⏳ {t("loading")}</div>;
  if (error)
    return (
      <div className="inquiry-wrapper inquiry-status error">
        {error}
      </div>
    );

  return (
    <div className="inquiry-wrapper">
      <div className="inquiry-list-header">
        <h2 className="inquiry-header">📨 {t("myInquiries")}</h2>
        <button
          className="inquiry-write-btn"
          onClick={handleWriteInquiry}
        >
          ➕ {t("writeInquiry")}
        </button>
      </div>

      {inquiries.length === 0 ? (
        <p className="inquiry-status">{t("noInquiries")}</p>
      ) : (
        <div className="inquiry-list">
          {inquiries.map((inq) => {
            const hasReply = typeof inq.reply === "string" && inq.reply.trim().length > 0;

            return (
              <div
                key={inq.id}
                onClick={() => handleViewDetail(inq)}
                className="inquiry-card"
                style={{
                  position: "relative",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  marginBottom: "12px",
                  cursor: "pointer",
                }}
              >
                <div className="inquiry-card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="inquiry-title" style={{ fontWeight: "bold" }}>{inq.title}</div>
                  <div className="inquiry-date" style={{ fontSize: "0.85rem", color: "#888" }}>
                    {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                  </div>
                </div>
                <div className="inquiry-meta" style={{ fontSize: "0.9rem", color: "#444" }}>
                  📧 {inq.email}
                </div>

                {/* ✅ reply_checked가 0이면 미확인 상태, 1이면 완료 상태로 표시 */}
                {hasReply && inq.reply_checked === 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#f57c00",
                      color: "white",
                      fontSize: "0.75rem",
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    🟠 새 답변
                  </span>
                )}

                {hasReply && inq.reply_checked === 1 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#4caf50",
                      color: "white",
                      fontSize: "0.75rem",
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    ✅ 답변 완료
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="inquiry-back-wrapper">
        <button
          className="inquiry-back-btn"
          onClick={handleBack}
        >
          ⬅ {t("back")}
        </button>
      </div>
    </div>
  );
}
