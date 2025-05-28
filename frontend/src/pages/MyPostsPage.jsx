import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyPostsPage.css";

export default function MyPostsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("분실물");
  const [posts, setPosts] = useState({ lost: [], found: [], inquiry: [], feedback: [] });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert("로그인이 필요합니다.");
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
  }, [navigate]);

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

    if (!data.length) return <p className="my-posts-empty">게시물이 없습니다.</p>;

    return (
      <div className="my-posts-list">
        {data.map((item) => {
          const formattedDate = new Date(item.date || item.created_at).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={item.id} className="my-post-card">
              <div className="post-content">
                <h3 className="post-title">{item.title || item.content || item.message}</h3>
                <p className="post-date">{formattedDate}</p>
              </div>
              <div className="post-buttons">
                <button className="edit-btn" onClick={() => navigate(`/edit/${activeTab}/${item.id}`)}>✏ 수정</button>
                <button className="delete-btn" onClick={() => handleDelete(activeTab, item.id)}>🗑 삭제</button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const typeMap = {
      분실물: "lost-items",
      습득물: "lost_requests",
      문의하기: "inquiries",
      피드백: "feedbacks",
    };
    try {
      const res = await fetch(`/api/${typeMap[type]}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 실패");
      alert("삭제되었습니다.");
      fetchAllPosts(user.student_id);
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("삭제 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="app-wrapper my-posts-wrapper">
      <h1 className="my-posts-title-main">내 글 관리</h1>
      <div className="my-posts-tabs">
        {["분실물", "습득물", "문의하기", "피드백"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`my-posts-tab-btn ${activeTab === tab ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{renderList()}</div>
      <div className="my-posts-back-wrapper">
        <button className="back-btn" onClick={() => navigate(-1)}>🔙 뒤로가기</button>
      </div>
    </div>
  );
}
