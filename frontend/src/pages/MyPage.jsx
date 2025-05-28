import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [allFeedbacks, setAllFeedbacks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  const fetchMyData = useCallback(async (student_id, role) => {
    try {
      const [expRes, logRes] = await Promise.all([
        fetch(`/api/lost-items/expiring-soon`),
        role === "admin" ? fetch(`/api/admin/activity-logs`) : Promise.resolve({ json: () => [] }),
      ]);
      setExpiringItems(await expRes.json());
      setActivityLogs(role === "admin" ? await logRes.json() : []);
    } catch (err) {
      console.error("❌ 데이터 불러오기 실패:", err);
    }
  }, []);

  useEffect(() => {
    if (user?.student_id && user?.role) {
      fetchMyData(user.student_id, user.role);

      fetch(`/api/messages/received/${user.student_id}`)
        .then((res) => res.json())
        .then((msgs) => {
          const unread = msgs.filter((m) => m.is_read == 0);
          setUnreadCount(unread.length);
        });

      if (user.role === "admin") {
        fetch("/api/feedbacks")
          .then((res) => res.json())
          .then(setAllFeedbacks);
      }
    }
  }, [user, fetchMyData]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return alert("내용을 입력해주세요.");
    try {
      await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: user?.student_id, content: feedback }),
      });
      setFeedback("");
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 3000);
    } catch {
      alert("피드백 전송 중 오류가 발생했습니다.");
    }
  };

  if (!user) return <div className="app-wrapper">⏳ 사용자 정보를 불러오는 중...</div>;

  return (
    <div className="app-wrapper" style={{ background: "#fdf9f5", minHeight: "100vh", padding: "20px 0" }}>
      <div style={{
        maxWidth: "400px",
        margin: "0 auto",
        background: "white",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
      }}>
        {/* 프로필 + 설정 아이콘 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="default"
              style={{ width: "48px", height: "48px", borderRadius: "50%", marginRight: "12px" }}
            />
            <div>
              <div style={{ fontWeight: "bold", fontSize: "1rem", textAlign: "left", color: "#222" }}>{user.name}</div>
              <div style={{ fontSize: "0.85rem", color: "#666" }}>학번: {user.student_id}</div>
            </div>
          </div>

          
            <button onClick={() => navigate("/settings")}>⚙️</button>
          
        </div>

        {/* 관리자 전용 상단 버튼 */}
        {user.role === "admin" && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <button
              onClick={() => navigate("/notices/manage")}
              style={{ padding: "6px 10px", backgroundColor: "#ffe082", border: "none", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer" }}
            >
              📢 공지사항 등록
            </button>
          </div>
        )}

        {/* 동그라미 버튼 */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "24px" }}>
          <CircleBtn label="내 글목록" icon="🗂️" onClick={() => navigate("/myposts")} />
          <CircleBtn label="문의 내역" icon="📨" onClick={() => user.role === "admin" ? navigate("/admin/inquiries") : navigate("/contact/history")} />
          <CircleBtn label="눌러봐봐" icon="🎁" onClick={() => navigate("/feedback")} />
        </div>

        {/* 사각형 버튼 */}
        <MenuItem label="📥 받은 쪽지함" onClick={() => navigate("/messages/inbox")} unreadCount={unreadCount} />
        <MenuItem label="📤 보낸 쪽지함" onClick={() => navigate("/messages/sent")} />

        {/* 보관기한 임박 */}
        {expiringItems.length > 0 && (
          <>
            <h3 style={titleStyle}>⏰ 보관기한 임박</h3>
            <ul style={ulStyle}>
              {expiringItems.map((item) => {
                const dDay = Math.ceil((new Date(item.expireDate) - Date.now()) / 86400000);
                return <li key={item.id}>{item.title} - D-{dDay <= 0 ? "day" : dDay}</li>;
              })}
            </ul>
          </>
        )}

        {/* 관리자 피드백 모음 */}
        {user.role === "admin" && (
          <>
            <h3 style={titleStyle}>📬 사용자 피드백 모음</h3>
            {allFeedbacks.length === 0
              ? <p style={emptyText}>등록된 피드백이 없습니다.</p>
              : allFeedbacks.map(fb => (
                  <div key={fb.id} style={feedbackBox}>
                    <div style={{ fontSize: "0.85rem", color: "#333" }}>
                      <strong>{fb.student_id}</strong> - {new Date(fb.created_at).toLocaleString("ko-KR")}
                    </div>
                    <div style={{ fontSize: "0.9rem", marginTop: "6px", whiteSpace: "pre-wrap" }}>{fb.content}</div>
                  </div>
                ))}
          </>
        )}

        {/* 사용자 피드백 작성 */}
        {user.role !== "admin" && (
          <>
            <h3 style={titleStyle}>💬 ReturnU에 대한 피드백</h3>
            <textarea
              value={feedback}
              rows={4}
              placeholder="건의사항이나 칭찬을 적어주세요!"
              onChange={(e) => setFeedback(e.target.value)}
              style={{ width: "100%", borderRadius: "10px", padding: "12px", border: "1px solid #ccc", resize: "vertical" }}
            />
            <button
              onClick={handleFeedbackSubmit}
              style={{ marginTop: "10px", width: "100%", padding: "10px", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "8px" }}
            >
              제출하기
            </button>
            {feedbackSent && <p style={{ color: "#4caf50", marginTop: "8px" }}>✅ 피드백이 전송되었습니다.</p>}
          </>
        )}

        {/* 관리자 활동 기록 */}
        {user.role === "admin" && (
          <>
            <h3 style={titleStyle}>🕓 최근 관리자 활동</h3>
            {activityLogs.length === 0
              ? <p style={emptyText}>최근 활동 내역 없음</p>
              : <ul style={ulStyle}>
                  {activityLogs.map((log, idx) => (
                    <li key={idx}>📌 {log.action} - {new Date(log.timestamp).toLocaleString("ko-KR")}</li>
                  ))}
                </ul>}
          </>
        )}
      </div>
    </div>
  );
}

const CircleBtn = ({ label, icon, onClick }) => (
  <button onClick={onClick} style={{
    width: "72px", height: "72px", borderRadius: "50%",
    background: "#fff7e6", border: "1px solid #f5c16c",
    fontSize: "0.8rem", fontWeight: "bold", cursor: "pointer",
    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
  }}>
    <span style={{ fontSize: "1.2rem", marginBottom: "2px" }}>{icon}</span>
    {label}
  </button>
);

const MenuItem = ({ label, onClick, unreadCount }) => (
  <div onClick={onClick} style={{
    background: "#f9f9f9", borderRadius: "12px", padding: "14px 16px",
    marginBottom: "10px", fontSize: "0.95rem", position: "relative",
    cursor: "pointer", fontWeight: "500"
  }}>
    {label}
    {unreadCount > 0 && (
      <span style={{
        position: "absolute", right: "14px", top: "50%",
        transform: "translateY(-50%)", backgroundColor: "red",
        color: "white", borderRadius: "50%", width: "18px", height: "18px",
        fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center"
      }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
    )}
  </div>
);

const titleStyle = { marginTop: "20px", fontSize: "1rem", fontWeight: "600", color: "#607d8b" };
const ulStyle = { paddingLeft: "20px", fontSize: "0.9rem", marginBottom: "10px" };
const emptyText = { fontSize: "0.9rem", color: "#999", fontStyle: "italic", marginBottom: "10px" };
const feedbackBox = {
  background: "#f5f5f5", padding: "10px 12px", borderRadius: "10px",
  marginBottom: "10px", border: "1px solid #ddd"
};
