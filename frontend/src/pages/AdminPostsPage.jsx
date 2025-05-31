import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale"; // 추가
import "../styles/AdminPostsPage.css";

function AdminPostsPage() {
  const navigate = useNavigate();
  const { t } = useLang(); // 추가
  const [activeTab, setActiveTab] = useState("lost");
  const [lostItems, setLostItems] = useState([]);
  const [lostRequests, setLostRequests] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lostRes, requestRes, inquiryRes, feedbackRes] = await Promise.all([
          fetch(`/api/admin/lost-items`),
          fetch(`/api/admin/lost-requests`),
          fetch(`/api/admin/inquiries`),
          fetch(`/api/admin/feedbacks`),
        ]);

        const [lostData, requestData, inquiryData, feedbackData] = await Promise.all([
          lostRes.json(),
          requestRes.json(),
          inquiryRes.json(),
          feedbackRes.json(),
        ]);

        setLostItems(lostData);
        setLostRequests(requestData);
        setInquiries(inquiryData);
        setFeedbacks(feedbackData);
      } catch (err) {
        console.error(t("postsLoadError"), err);
      }
    };

    fetchData();
  }, [t]);

  const handleDelete = async (id, type) => {
    const confirmDelete = window.confirm(t("confirmDeleteRequest"));
    if (!confirmDelete) return;

    try {
      await fetch(`/api/admin/${type}/${id}`, { method: "DELETE" });
      if (type === "lost-items") {
        setLostItems((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "lost-requests") {
        setLostRequests((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "inquiries") {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "feedbacks") {
        setFeedbacks((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(t("deleteError"), err);
    }
  };

  const renderPosts = (posts, type) => (
    <ul className="admin-posts-list">
      {posts.map((post) => (
        <li key={post.id} className="admin-post-item">
          <div className="admin-post-title">{post.title || post.content}</div>
          <div className="admin-post-meta">
            {t("writer")}: {post.student_id} | {post.date || post.created_at}
          </div>
          <div className="admin-post-actions">
            <button
              className="edit-button"
              onClick={() => navigate(`/admin/edit/${type}/${post.id}`)}
            >
              {t("edit")}
            </button>
            <button
              className="delete-button"
              onClick={() => handleDelete(post.id, type)}
            >
              {t("delete")}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="admin-posts-wrapper">
      <h1>{t("adminPostsTitle")}</h1>
      <div className="admin-tabs">
        <button
          className={`admin-tab-button ${activeTab === "lost" ? "active" : ""}`}
          onClick={() => setActiveTab("lost")}
        >
          {t("tabLost")}
        </button>
        <button
          className={`admin-tab-button ${activeTab === "request" ? "active" : ""}`}
          onClick={() => setActiveTab("request")}
        >
          {t("tabRequest")}
        </button>
        <button
          className={`admin-tab-button ${activeTab === "inquiry" ? "active" : ""}`}
          onClick={() => setActiveTab("inquiry")}
        >
          {t("tabInquiry")}
        </button>
        <button
          className={`admin-tab-button ${activeTab === "feedback" ? "active" : ""}`}
          onClick={() => setActiveTab("feedback")}
        >
          {t("tabFeedback")}
        </button>
      </div>
      {activeTab === "lost" && renderPosts(lostItems, "lost-items")}
      {activeTab === "request" && renderPosts(lostRequests, "lost-requests")}
      {activeTab === "inquiry" && renderPosts(inquiries, "inquiries")}
      {activeTab === "feedback" && renderPosts(feedbacks, "feedbacks")}
    </div>
  );
}

export default AdminPostsPage;
