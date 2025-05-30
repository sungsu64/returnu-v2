// src/pages/AdminPostsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/MyPostsPage.css";

export default function AdminPostsPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(t("tabLost"));
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
      console.error(err);
      alert(t("postsLoadError"));
    }
  };

  const renderList = () => {
    const tabMap = {
      [t("tabLost")]: posts.lost,
      [t("tabFound")]: posts.found,
      [t("tabInquiry")]: posts.inquiry,
      [t("tabFeedback")]: posts.feedback,
    };
    const data = tabMap[activeTab] || [];

    if (!data.length) {
      return <p className="no-post">{t("noPosts")}</p>;
    }
    return (
      <ul className="post-list">
        {data.map((item) => (
          <li key={item.id} className="post-item">
            <strong className="post-title">
              {item.title || item.content || item.message}
            </strong>
            <div className="post-meta">👤 {item.student_id}</div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="app-wrapper">
      <h1 className="post-title-heading">📁 {t("adminAllPosts")}</h1>
      <div className="tab-container">
        {[t("tabLost"), t("tabFound"), t("tabInquiry"), t("tabFeedback")].map((tab) => (
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
