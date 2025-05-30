// src/pages/MyPostsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyPostsPage.css";
import { useLang } from "../locale";

export default function MyPostsPage() {
  const navigate = useNavigate();
  const { t } = useLang();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("tabLost");
  const [posts, setPosts] = useState({
    lost: [],
    found: [],
    inquiry: [],
    feedback: [],
  });

  // ✨ 탭 타입 <-> 실제 라우터 경로 변환 (한글)
  const tabTypeMap = {
    tabLost: "분실물",
    tabFound: "습득물",
    tabInquiry: "문의하기",
    tabFeedback: "피드백",
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert(t("loginRequired"));
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    if (parsed.role === "admin") {
      navigate("/admin/posts");
      return;
    }

    fetchAllPosts(parsed.student_id);
    // eslint-disable-next-line
  }, [navigate, t]);

  const fetchAllPosts = async (student_id) => {
    try {
      const [lostRes, foundRes, inquiryRes, feedbackRes] = await Promise.all([
        fetch(`/api/lost-items/by-student/${student_id}`),
        fetch(`/api/lost_requests/by-student/${student_id}`),
        fetch(`/api/inquiries/by-student/${student_id}`),
        fetch(`/api/feedbacks/by-student/${student_id}`),
      ]);

      const [lost, found, inquiry, feedback] = await Promise.all([
        lostRes.json(),
        foundRes.json(),
        inquiryRes.json(),
        feedbackRes.json(),
      ]);

      setPosts({ lost, found, inquiry, feedback });
    } catch (err) {
      console.error("❌ 내 글 목록 불러오기 실패:", err);
      alert(t("postsLoadError"));
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(t("confirmDelete"))) return;
    const typeMap = {
      tabLost: "lost-items",
      tabFound: "lost_requests",
      tabInquiry: "inquiries",
      tabFeedback: "feedbacks",
    };
    try {
      const res = await fetch(`/api/${typeMap[type]}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제 실패");
      alert(t("deleted"));
      fetchAllPosts(user.student_id);
    } catch (err) {
      console.error("삭제 오류:", err);
      alert(t("deleteError"));
    }
  };

  const renderList = () => {
    const tabMap = {
      tabLost: posts.lost,
      tabFound: posts.found,
      tabInquiry: posts.inquiry,
      tabFeedback: posts.feedback,
    };
    const data = tabMap[activeTab] || [];

    if (!data.length) {
      return <p className="my-posts-empty">{t("noPosts")}</p>;
    }

    return (
      <div className="my-posts-list">
        {data.map((item) => {
          const formattedDate = new Date(
            item.date || item.created_at
          ).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={item.id} className="my-post-card upgraded">
              <div className="post-content">
                <h3 className="post-title">
                  📝{" "}
                  {item.title ||
                    item.content ||
                    item.message ||
                    t("noTitle")}
                </h3>
                <p className="post-date">📅 {formattedDate}</p>
              </div>
              <div className="post-buttons">
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/edit/${tabTypeMap[activeTab]}/${item.id}`)
                  }
                >
                  {t("edit")}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(activeTab, item.id)}
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="app-wrapper my-posts-wrapper">
      <h1 className="my-posts-title-main">{t("myPostsTitle")}</h1>
      <div className="my-posts-tabs">
        {[
          "tabLost",
          "tabFound",
          "tabInquiry",
          "tabFeedback",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`my-posts-tab-btn ${
              activeTab === tab ? "active" : ""
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>
      <div>{renderList()}</div>
      <div className="my-posts-back-wrapper">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          {t("back")}
        </button>
      </div>
    </div>
  );
}
