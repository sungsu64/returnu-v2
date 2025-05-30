// src/pages/ChangePasswordPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";

export default function ChangePasswordPage() {
  const { t } = useLang();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert(t("allFieldsRequired"));
      return;
    }
    if (newPassword !== confirmPassword) {
      alert(t("passwordMismatch"));
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch(
        "http://localhost:8090/api/users/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: user.student_id,
            currentPassword,
            newPassword,
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        alert(t("passwordChangeSuccess"));
        navigate("/my");
      } else {
        alert(result.message || t("passwordChangeFail"));
      }
    } catch (err) {
      alert(t("errorOccurred") + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>{t("changePasswordTitle")}</h2>
      <input
        type="password"
        placeholder={t("currentPasswordPlaceholder")}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <input
        type="password"
        placeholder={t("newPasswordPlaceholder")}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <input
        type="password"
        placeholder={t("confirmPasswordPlaceholder")}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <button
        onClick={handleChangePassword}
        style={{ width: "100%", padding: "10px" }}
      >
        {t("changePasswordButton")}
      </button>
    </div>
  );
}
