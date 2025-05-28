import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyPostsPage.css";

export default function AdminPostsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("분실물");
  const [posts, setPosts] = useState({ lost: [], found: [], inquiry: [], feedback: [] });

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const [lostRes, foundRes, inquiryRes, feedbackRes] = await Promise.all([
        fetch(`/api/lost-items/all`),
        fetch(`/api/lost_requests/all`),
        fetch(`/api/inquiries`),
        fetch(`/api/feedbacks`),
      ]);

      const [lost, found, inquiry, feedback] = await Promise.all([
        lostRes.json(),
        foundRes.json(),
        inquiryRes.json(),
        feedbackRes.json(),
      ]);

      setPosts({ lost, found, inquiry, feedback });
    } catch (err) {
      console.error("❌ 글 목록 불러오기 실패:", err);
      alert("글을 불러오지 못했습니다.");
    }
  };

  const renderList = () => {
    const tabMap = {
      분실물: posts.lost,
      습득물: posts.found,
      문의하기: posts.inquiry,
      피드백: posts.feedback,
    };
    const data = tabMap[activeTab];

    if (!data.length) return <p className="no-post">게시물이 없습니다.</p>;

    return (
      <ul className="post-list">
        {data.map((item) => (
          <li key={item.id} className="post-item">
            <strong className="post-title">{item.title || item.content || item.message}</strong>
            <div className="post-meta">👤 {item.student_id}</div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="app-wrapper">
      <h1 className="post-title-heading">📁 전체 글 목록 (관리자)</h1>
      <div className="tab-container">
        {["분실물", "습득물", "문의하기", "피드백"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">{renderList()}</div>
    </div>
  );
}
