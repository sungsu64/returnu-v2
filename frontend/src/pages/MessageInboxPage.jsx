import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MessageInboxPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    } else {
      setUser(JSON.parse(stored));
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/messages/received/${user.student_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("쪽지를 불러올 수 없습니다.");
        return res.json();
      })
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [user]);

  const handleDelete = (id) => {
    if (!window.confirm("정말로 이 쪽지를 삭제하시겠습니까?")) return;

    fetch(`/api/messages/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("삭제 실패");
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      })
      .catch((err) => {
        alert("❌ 삭제 중 오류: " + err.message);
      });
  };

  if (error) return <div>❌ 오류: {error}</div>;

  return (
    <div className="app-wrapper">
      <h2 style={{ margin: "16px", fontSize: "1.4rem" }}>📥 받은 쪽지함</h2>

      {messages.length === 0 ? (
        <p style={{ textAlign: "center", color: "#aaa" }}>받은 쪽지가 없습니다.</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} style={cardStyle}>
            <p style={{ fontWeight: "bold" }}>{msg.content.split("\n")[0]}</p>
            <p style={{ margin: "8px 0" }}>{msg.content.split("\n").slice(1).join("\n")}</p>
            <p style={{ fontSize: "0.8rem", color: "#888" }}>
              보낸 사람: {msg.sender_id} / {new Date(msg.sent_at).toLocaleString("ko-KR")}
            </p>

            <div style={{ marginTop: "8px" }}>
              <button onClick={() => handleDelete(msg.id)} style={deleteBtnStyle}>
                삭제
              </button>
              <button
                onClick={() => navigate(`/send-message?receiver_id=${msg.sender_id}`)}
                style={replyBtnStyle}
              >
                답장하기
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const cardStyle = {
  background: "#fff8f0",
  margin: "16px",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  position: "relative",
};

const deleteBtnStyle = {
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.8rem",
};

const replyBtnStyle = {
  backgroundColor: "#2196f3",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.8rem",
  marginLeft: "8px",
};
