// src/components/NoticeSlider.jsx
import React, { useEffect, useState } from "react";
import { useLang } from "../locale";
import "../styles/NoticeSlider.css";

export default function NoticeSlider({ notices }) {
  const { t, lang } = useLang();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (notices.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % notices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [notices.length]);

  if (!notices || notices.length === 0) return null;

  const current = notices[index];
  const title = lang === "en" ? current.title_en || current.title : current.title;
  const content = lang === "en" ? current.content_en || current.content : current.content;

  return (
    <div className="notice-slider">
      {t("noticeIcon")} <strong>{title}</strong><br />
      <span className="notice-content">{content}</span>
    </div>
  );
}
