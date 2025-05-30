// src/pages/ContactPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/ContactPage.css";

export default function ContactPage() {
  const navigate = useNavigate();
  const { t } = useLang();

  const [formData, setFormData] = useState({
    name: "",
    student_id: "",
    email: "",
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, student_id, email, title, message } = formData;
    if (!name || !student_id || !email || !title || !message) {
      alert(t("allFieldsRequired"));
      return;
    }
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert(t("inquirySuccess"));
        setFormData({ name: "", student_id: "", email: "", title: "", message: "" });
        navigate("/");
      } else {
        alert(`${t("inquiryFail")}: ${result.error || t("serverError")}`);
      }
    } catch (err) {
      console.error("문의 전송 중 오류:", err);
      alert(t("serverConnectionError"));
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">{t("contactTitle")}</h1>
      <p className="contact-description">{t("contactDescription")}</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">{t("nameLabel")}</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t("namePlaceholder")}
          required
        />

        <label htmlFor="student_id">{t("studentIdLabel")}</label>
        <input
          type="text"
          id="student_id"
          name="student_id"
          value={formData.student_id}
          onChange={handleChange}
          placeholder={t("studentIdPlaceholder")}
          required
        />

        <label htmlFor="email">{t("emailLabel")}</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t("emailPlaceholder")}
          required
        />

        <label htmlFor="title">{t("titleLabel")}</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={t("titlePlaceholder")}
          required
        />

        <label htmlFor="message">{t("messageLabel")}</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t("messagePlaceholder")}
          required
        />

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 16 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="contact-submit"
            style={{ backgroundColor: "#ccc" }}
          >
            ← {t("back")}
          </button>
          <button type="submit" className="contact-submit">
            {t("contactSubmit")}
          </button>
        </div>
      </form>
    </div>
  );
}
