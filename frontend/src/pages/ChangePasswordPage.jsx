import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("http://localhost:8090/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: user.student_id,
          currentPassword,
          newPassword,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/my"); // ✅ 성공 시 마이페이지 이동
      } else {
        alert(result.message || "비밀번호 변경 실패");
      }
    } catch (err) {
      alert("오류 발생: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>비밀번호 변경</h2>
      <input
        type="password"
        placeholder="현재 비밀번호"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <input
        type="password"
        placeholder="새 비밀번호"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <input
        type="password"
        placeholder="새 비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <button onClick={handleChangePassword} style={{ width: "100%", padding: "10px" }}>
        비밀번호 변경
      </button>
    </div>
  );
}
