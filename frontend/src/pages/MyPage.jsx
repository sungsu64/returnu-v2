import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const fortunes = [
  "오늘은 좋은 일이 생길 거예요! 😊",
  "작은 행운이 당신을 기다리고 있어요! 🍀",
  "도전해보세요, 생각보다 잘 풀릴 거예요! 💪",
  "쉬어가는 것도 좋은 선택이에요. ☕",
  "예상치 못한 곳에서 반가운 소식을 듣게 될 거예요! ✉️"
];

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fortune, setFortune] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [allFeedbacks, setAllFeedbacks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  const fetchMyData = useCallback(async (student_id, role) => {
    try {
      const [expRes, logRes] = await Promise.all([
        fetch(`/api/lost-items/expiring-soon`),
        role === "admin"
          ? fetch(`/api/admin/activity-logs`)
          : Promise.resolve({ json: () => [] }),
      ]);

      const expiring = await expRes.json();
      const logs = role === "admin" ? await logRes.json() : [];

      setExpiringItems(expiring);
      setActivityLogs(logs);
    } catch (err) {
      console.error("❌ 데이터 불러오기 실패:", err);
    }
  }, []);

  useEffect(() => {
    if (user?.student_id && user?.role) {
      fetchMyData(user.student_id, user.role);

      fetch(`/api/messages/received/${user.student_id}`)
        .then((res) => {
          if (!res.ok) throw new Error("쪽지 API 응답 실패");
          return res.json();
        })
        .then((msgs) => {
          const unread = msgs.filter((m) => m.is_read == 0);
          setUnreadCount(unread.length);
        })
        .catch((err) => {
          console.error("❌ 쪽지 불러오기 실패:", err);
        });

      const random = fortunes[Math.floor(Math.random() * fortunes.length)];
      setFortune(random);

      if (user.role === "admin") {
        fetch("/api/feedbacks")
          .then(res => res.json())
          .then(setAllFeedbacks)
          .catch(err => console.error("❌ 피드백 조회 실패:", err));
      }
    }
  }, [user, fetchMyData]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  const handleSettings = () => {
    alert("⚙️ 설정 기능은 추후 지원될 예정입니다.");
  };

  const handleContact = () => {
    navigate("/contact/history");
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: user?.student_id,
          content: feedback,
        }),
      });

      if (!res.ok) throw new Error("전송 실패");

      setFeedback("");
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 3000);
    } catch (err) {
      console.error("❌ 피드백 전송 오류:", err);
      alert("피드백 전송 중 오류가 발생했습니다.");
    }
  };

  if (!user) return <div className="app-wrapper">⏳ 사용자 정보를 불러오는 중...</div>;

  return (
    <div className="app-wrapper">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", padding: "0 16px" }}>
        <h1 className="title" style={{ fontSize: "1.6rem" }}>👤 내 정보</h1>
      <div>
  {user.role === "admin" ? (
    <>
      <button onClick={() => navigate("/notices/manage")} style={actionBtnStyle}>
        공지사항 등록
      </button>
      <button onClick={() => navigate("/admin/inquiries")} style={{ ...actionBtnStyle, marginLeft: "8px" }}>
  문의내역
</button>

    </>
  ) : (
    <button onClick={handleContact} style={actionBtnStyle}>
      문의하기
    </button>
  )}
</div>

      </div>

      <section style={sectionStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={sectionTitleStyle}>내 프로필</h2>
          <div>
            <button onClick={() => navigate("/myposts")} style={{ ...actionBtnStyle, marginLeft: "8px" }}>
  내 글 관리
</button>

            <button onClick={handleLogout} style={logoutBtnStyle}>로그아웃</button>
          </div>
        </div>
        <p>이름: {user?.name}</p>
        <p>학번: {user?.student_id}</p>

        <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
          <button style={{ ...miniBtnStyle, position: "relative" }} onClick={() => navigate("/messages/inbox")}>📥 받은 쪽지함
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: "-4px", right: "-4px", backgroundColor: "red", color: "white", borderRadius: "50%", width: "16px", height: "16px", fontSize: "10px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>
          <button style={miniBtnStyle} onClick={() => navigate("/messages/sent")}>📤 보낸 쪽지함</button>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>🔮 오늘의 운세</h2>
        <p style={{ fontSize: "1rem", color: "#333" }}>{fortune}</p>
      </section>

      {user.role === "admin" ? (
        <section style={sectionStyle}>
  <h2 style={sectionTitleStyle}>📬 사용자 피드백 모음</h2>

  {allFeedbacks.length === 0 ? (
    <p style={{ color: "#999", fontStyle: "italic" }}>아직 등록된 피드백이 없습니다.</p>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {allFeedbacks.map((fb) => (
        <div
          key={fb.id}
          style={{
            background: "#ffffff",
            border: "1px solid #e0e0e0",
            borderLeft: "5px solid #4caf50",
            borderRadius: "12px",
            padding: "16px 20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            transition: "transform 0.2s",
          }}
        >
          <div style={{ marginBottom: "8px", fontSize: "0.9rem", color: "#555" }}>
            <strong>학번:</strong> {fb.student_id}
            <span style={{ marginLeft: "12px", color: "#999", fontSize: "0.85rem" }}>
              {new Date(fb.created_at).toLocaleString("ko-KR")}
            </span>
          </div>
          <div style={{ fontSize: "1rem", lineHeight: "1.5", color: "#333", whiteSpace: "pre-wrap" }}>
            {fb.content}
          </div>
        </div>
      ))}
    </div>
  )}
</section>

      ) : (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>💬 ReturnU에 대한 피드백</h2>
          <div style={{ background: "#f9f9f9", border: "1px solid #ccc", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <textarea rows={5} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="서비스에 대한 건의사항이나 칭찬을 자유롭게 작성해주세요!" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #bbb", fontSize: "0.95rem", fontFamily: "inherit", resize: "vertical", backgroundColor: "#fffefc" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <button onClick={handleFeedbackSubmit} style={{ padding: "8px 16px", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.9rem", cursor: "pointer" }}>제출하기</button>
            </div>
            {feedbackSent && (<p style={{ color: "#4caf50", marginTop: "8px", fontSize: "0.9rem" }}>✅ 피드백이 전송되었습니다. 감사합니다!</p>)}
          </div>
        </section>
      )}

      {expiringItems.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>⏰ 보관기한 임박</h2>
          <ul>
            {expiringItems.map((item) => {
              const dDay = Math.ceil((new Date(item.expireDate) - Date.now()) / 86400000);
              return (
                <li key={item.id}>{item.title || "제목없음"} - D-{dDay <= 0 ? "day" : dDay} 남음</li>
              );
            })}
          </ul>
        </section>
      )}

      {user?.role === "admin" && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🕓 최근 관리자 활동</h2>
          {activityLogs.length === 0 ? (
            <p style={{ color: "#aaa" }}>최근 활동 내역 없음</p>
          ) : (
            <ul>
              {activityLogs.map((log, idx) => (
                <li key={idx}>📌 {log.action} - {new Date(log.timestamp).toLocaleString("ko-KR")}</li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

/* 버튼 및 스타일 정의 생략 - 기존 동일 */


const sectionStyle = {
  margin: "16px",
  padding: "16px",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const sectionTitleStyle = {
  fontSize: "1.1rem",
  marginBottom: "10px",
  color: "#607d8b",
};

const logoutBtnStyle = {
  fontSize: "0.8rem",
  padding: "4px 8px",
  marginLeft: "8px",
  backgroundColor: "#ccc",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const settingBtnStyle = {
  fontSize: "0.8rem",
  padding: "4px 8px",
  backgroundColor: "#f0f0f0",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
};

const actionBtnStyle = {
  fontSize: "0.85rem",
  padding: "6px 12px",
  backgroundColor: "#ffd54f",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const miniBtnStyle = {
  fontSize: "0.75rem",
  padding: "6px 10px",
  backgroundColor: "#e1f5fe",
  border: "1px solid #81d4fa",
  borderRadius: "6px",
  cursor: "pointer",
  position: "relative",
};
