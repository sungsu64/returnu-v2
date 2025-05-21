import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myLostItems, setMyLostItems] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);

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
      const [lostRes, reqRes, expRes, logRes] = await Promise.all([
        fetch(`/api/users/${student_id}/lost-items`),
        fetch(`/api/users/${student_id}/lost-requests`),
        fetch(`/api/lost-items/expiring-soon`),
        role === "admin"
          ? fetch(`/api/admin/activity-logs`)
          : Promise.resolve({ json: () => [] }),
      ]);

      const lostItems = await lostRes.json();
      const requests = await reqRes.json();
      const expiring = await expRes.json();
      const logs = role === "admin" ? await logRes.json() : [];

      setMyLostItems(lostItems);
      setMyRequests(requests);
      setExpiringItems(expiring);
      setActivityLogs(logs);
    } catch (err) {
      console.error("❌ 데이터 불러오기 실패:", err);
    }
  }, []);

  useEffect(() => {
    if (user?.student_id && user?.role) {
      fetchMyData(user.student_id, user.role);
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
    alert("📩 문의는 이메일 또는 앱 내 문의하기를 통해 가능합니다.");
  };

  if (!user) return <div className="app-wrapper">⏳ 사용자 정보를 불러오는 중...</div>;

  return (
    <div className="app-wrapper">
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "16px", padding: "0 16px"
      }}>
        <h1 className="title">👤 내 정보</h1>
        <div>
          {user.role === "admin" ? (
            <button onClick={() => navigate("/notices/manage")} style={actionBtnStyle}>공지사항 등록</button>
          ) : (
            <button onClick={handleContact} style={actionBtnStyle}>문의하기</button>
          )}
        </div>
      </div>

      <section style={sectionStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={sectionTitleStyle}>내 프로필</h2>
          <div>
            <button onClick={handleSettings} style={settingBtnStyle}>설정</button>
            <button onClick={handleLogout} style={logoutBtnStyle}>로그아웃</button>
          </div>
        </div>
        <p>이름: {user?.name}</p>
        <p>학번: {user?.student_id}</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>📦 내 분실물 등록 내역</h2>
        {myLostItems.length === 0 ? (
          <p style={{ color: "#888" }}>아직 등록한 분실물이 없습니다.</p>
        ) : (
          <ul>
            {myLostItems.map((item, idx) => {
              const dateStr = item.date ? new Date(item.date).toLocaleDateString("ko-KR") : "날짜없음";
              return (
                <li key={item.id || idx}>
                  🧾 {item.title || "제목없음"} ({item.location || "위치없음"}) - {dateStr}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>📮 내 요청글 내역</h2>
        {myRequests.length === 0 ? (
          <p style={{ color: "#888" }}>등록한 요청글이 없습니다.</p>
        ) : (
          <ul>
            {myRequests.map((r, idx) => (
              <li key={r.id || idx}>
                📝 {r.title || "제목없음"} ({r.location || "위치없음"}) - {r.date ? new Date(r.date).toLocaleDateString("ko-KR") : "날짜없음"}
              </li>
            ))}
          </ul>
        )}
      </section>

      {expiringItems.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>⏰ 보관기한 임박</h2>
          <ul>
            {expiringItems.map((item) => {
              const dDay = Math.ceil((new Date(item.expireDate) - Date.now()) / 86400000);
              return (
                <li key={item.id}>
                  {item.title || "제목없음"} - D-{dDay <= 0 ? "day" : dDay} 남음
                </li>
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
                <li key={idx}>
                  📌 {log.action} - {new Date(log.timestamp).toLocaleString("ko-KR")}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

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
