// src/pages/EditInquiryPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/EditInquiryPage.css";

export default function EditInquiryPage() {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  useEffect(() => {
    fetch(`/api/inquiries/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(t("loadInquiryFailed"));
        return res.json();
      })
      .then((data) => {
        setForm({
          title: data.title || "",
          message: data.message || "",
        });
      })
      .catch((err) => {
        console.error("❌", err);
        alert(t("loadInquiryFailed"));
      });
  }, [id, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(t("editFailed"));
      alert(t("editSuccess"));
      navigate("/myposts");
    } catch {
      alert(t("editError"));
    }
  };

  const handleReset = () => {
    setForm({ title: "", message: "" });
  };

  return (
    <div className="edit-inquiry-wrapper">
      <h1 className="edit-inquiry-title">📩 {t("editInquiryTitle")}</h1>
      <form className="edit-inquiry-form" onSubmit={handleSubmit}>
        <label>
          {t("titleLabel")}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          {t("messageLabel")}
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          />
        </label>
        <div className="edit-inquiry-btns">
          <button type="submit" className="btn edit">
            ✅ {t("saveButton")}
          </button>
          <button
            type="button"
            className="btn reset"
            onClick={handleReset}
          >
            🌀 {t("resetButton")}
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
