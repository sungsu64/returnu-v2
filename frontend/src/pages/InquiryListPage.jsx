// src/pages/InquiryListPage.jsx
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
  const handleViewDetail = (id) => navigate(`/contact/${id}`);
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
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              onClick={() => handleViewDetail(inq.id)}
              className="inquiry-card"
            >
              <div className="inquiry-card-header">
                <div className="inquiry-title">{inq.title}</div>
                <div className="inquiry-date">
                  {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                </div>
              </div>
              <div className="inquiry-meta">
                📧 {inq.email}
              </div>
            </div>
          ))}
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
