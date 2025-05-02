import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function ClaimPage() {
  const { id } = useParams();
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("이름을 입력해주세요.");

    // ✅ 백엔드로 보내는 자리 (지금은 콘솔)
    console.log("📦 수령 처리:", {
      itemId: id,
      claimantName: name,
    });

    alert("수령이 기록되었습니다! (임시)");
    setName("");
  };

  return (
    <>
      <h1 className="title">수령자 정보 입력</h1>

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="본인 이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="btn-primary" type="submit">
          ✅ 수령 처리하기
        </button>
      </form>
    </>
  );
}
