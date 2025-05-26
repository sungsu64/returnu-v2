import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function MessageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:8090/api/messages/${id}`);
        if (!res.ok) throw new Error("불러오기 실패");
        const data = await res.json();
        setMessage(data);

        // 읽음 처리 (이미 읽은 메시지는 무시됨)
        await fetch(`http://localhost:8090/api/messages/read/${id}`, {
          method: "PATCH"
        });
      } catch {
        alert("쪽지 정보를 불러올 수 없습니다.");
      }
    }

    fetchData();
  }, [id]);

  if (!message) return <p style={{ textAlign: "center", marginTop: "2rem" }}>⏳ 불러오는 중...</p>;

  return (
    <div style={{ maxWidth: "480px", margin: "auto", padding: "24px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "10px" }}>← 뒤로가기</button>
      <h2 style={{ color: "#d19c66" }}>📨 쪽지 상세</h2>
      <p><strong>보낸 사람:</strong> {message.sender_id}</p>
      <p><strong>받는 사람:</strong> {message.receiver_id}</p>
      <p><strong>보낸 시간:</strong> {new Date(message.sent_at).toLocaleString()}</p>
      <p style={{ whiteSpace: "pre-line", marginTop: "16px" }}>{message.content}</p>
    </div>
  );
}
