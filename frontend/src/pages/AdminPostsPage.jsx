import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPostsPage.css";

function AdminPostsPage() {
  const navigate = useNavigate();
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
        console.error("글을 불러오는 중 오류 발생:", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id, type) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
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
      console.error("삭제 중 오류 발생:", err);
    }
  };

  const renderPosts = (posts, type) => (
    <ul className="admin-posts-list">
      {posts.map((post) => (
        <li key={post.id} className="admin-post-item">
          <div className="admin-post-title">{post.title || post.content}</div>
          <div className="admin-post-meta">
            작성자: {post.student_id} | {post.date || post.created_at}
          </div>
          <div className="admin-post-actions">
  <button
    className="edit-button"
    onClick={() => navigate(`/admin/edit/${type}/${post.id}`)}
  >
    수정
  </button>
  <button
    className="delete-button"
    onClick={() => handleDelete(post.id, type)}
  >
    삭제
  </button>
</div>

        </li>
      ))}
    </ul>
  );

  return (
    <div className="admin-posts-wrapper">
      <h1>전체 글 관리</h1>
      <div className="admin-tabs">
        <button
          className={`admin-tab-button ${activeTab === "lost" ? "active" : ""}`}
          onClick={() => setActiveTab("lost")}
        >
          분실물
        </button>
        <button
          className={`admin-tab-button ${activeTab === "request" ? "active" : ""}`}
          onClick={() => setActiveTab("request")}
        >
          요청글
        </button>
        <button
          className={`admin-tab-button ${activeTab === "inquiry" ? "active" : ""}`}
          onClick={() => setActiveTab("inquiry")}
        >
          문의글
        </button>
        <button
          className={`admin-tab-button ${activeTab === "feedback" ? "active" : ""}`}
          onClick={() => setActiveTab("feedback")}
        >
          피드백
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
