// src/pages/AdminInquiryListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/AdminInquiryListPage.css";

export default function AdminInquiryListPage() {
  const { t } = useLang();
  const navigate = useNavigate();
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
    const { role } = JSON.parse(stored);
    if (role !== "admin") {
      alert(t("adminOnly"));
      navigate("/");
      return;
    }

    fetch(`/api/inquiries`)
      .then((res) => {
        if (!res.ok) throw new Error(t("serverError"));
        return res.json();
      })
      .then((data) => setInquiries(data))
      .catch(() => setError(t("loadInquiriesFailed")))
      .finally(() => setLoading(false));
  }, [navigate, t]);

  const handleViewDetail = (id) => {
    navigate(`/contact/${id}`);
  };

  if (loading) return <div className="admin-inquiry-wrapper">⏳ {t("loading")}</div>;
  if (error) return <div className="admin-inquiry-wrapper error">{error}</div>;

  return (
    <div className="admin-inquiry-wrapper">
      <h2 className="admin-inquiry-title">📋 {t("adminAllInquiries")}</h2>

      {inquiries.length === 0 ? (
        <p className="admin-inquiry-status">{t("noInquiries")}</p>
      ) : (
        <div className="admin-inquiry-list">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              onClick={() => handleViewDetail(inq.id)}
              className="admin-inquiry-card"
            >
              <div className="admin-inquiry-card-header">
                <span className="admin-inquiry-title-text">{inq.title}</span>
                <span className="admin-inquiry-date">
                  {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <div className="admin-inquiry-meta">
                👤 {inq.student_id} | 📧 {inq.email}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
