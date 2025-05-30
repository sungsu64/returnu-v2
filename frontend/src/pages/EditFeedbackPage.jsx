// src/pages/EditFeedbackPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/EditFeedbackPage.css";

export default function EditFeedbackPage() {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/api/feedbacks/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(t("loadFeedbackError"));
        return res.json();
      })
      .then((data) => {
        setContent(data.content || "");
      })
      .catch((err) => {
        console.error(err);
        alert(t("loadFeedbackError"));
      });
  }, [id, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/feedbacks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(t("editFailed"));
      alert(t("editSuccess"));
      navigate("/myposts");
    } catch {
      alert(t("editError"));
    }
  };

  return (
    <div className="edit-feedback-wrapper">
      <h1 className="edit-feedback-title">📝 {t("editFeedbackTitle")}</h1>
      <form className="edit-feedback-form" onSubmit={handleSubmit}>
        <label>
          {t("messageLabel")}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
        <div className="edit-feedback-btns">
          <button type="submit" className="btn submit">
            ✅ {t("saveButton")}
          </button>
          <button
            type="button"
            className="btn back"
            onClick={() => navigate(-1)}
          >
            🔙 {t("back")}
          </button>
        </div>
      </form>
    </div>
  );
}
