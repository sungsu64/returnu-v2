import React, { useEffect, useState } from "react";
import "../styles/AdminFeedbackPage.css";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetch("/api/feedbacks")
      .then((res) => res.json())
      .then(setFeedbacks)
      .catch((err) => console.error("피드백 불러오기 실패:", err));
  }, []);

  const totalPages = Math.ceil(feedbacks.length / pageSize);
  const paginated = feedbacks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="admin-feedback-wrapper">
      <div className="admin-feedback-header">
        <h1>📬 피드백 모음</h1>
        <p>관리자 전용 피드백 확인 페이지입니다.</p>
      </div>

      <div className="admin-feedback-list">
        {paginated.map((fb) => (
          <div key={fb.id} className="admin-feedback-card">
            <div className="feedback-meta">
              <span className="student-id">👤 {fb.student_id}</span>
              <span className="date">{new Date(fb.created_at).toLocaleString("ko-KR")}</span>
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
