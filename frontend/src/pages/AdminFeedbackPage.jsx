import React, { useEffect, useState } from "react";
import { useLang } from "../locale"; // 추가!
import "../styles/AdminFeedbackPage.css";

export default function AdminFeedbackPage() {
  const { t } = useLang(); // 추가
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetch("/api/feedbacks")
      .then((res) => res.json())
      .then(setFeedbacks)
      .catch((err) => console.error(t("feedbackLoadError"), err)); // 언어반영
  }, [t]);

  const totalPages = Math.ceil(feedbacks.length / pageSize);
  const paginated = feedbacks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="admin-feedback-wrapper">
      <div className="admin-feedback-header">
        <h1>📬 {t("feedbackCollection")}</h1>
        <p>{t("adminFeedbackPageDesc")}</p>
      </div>

      <div className="admin-feedback-list">
        {paginated.map((fb) => (
          <div key={fb.id} className="admin-feedback-card">
            <div className="feedback-meta">
              <span className="student-id">👤 {fb.student_id}</span>
              <span className="date">
                {new Date(fb.created_at).toLocaleString(t("localeCode"))}
              </span>
            </div>
            <div className="feedback-text">{fb.content}</div>
          </div>
        ))}
      </div>

      <div className="admin-feedback-pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
