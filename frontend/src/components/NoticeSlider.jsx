// src/components/NoticeSlider.jsx
import React, { useEffect, useState } from "react";
import { useLang } from "../locale";
import "../styles/NoticeSlider.css";

export default function NoticeSlider({ notices }) {
  const { t } = useLang();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % notices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [notices.length]);

  if (!notices || notices.length === 0) return null;

  return (
    <div className="notice-slider">
      {t("noticeIcon")} <strong>{notices[index].title}</strong><br />
      <span className="notice-content">{notices[index].content}</span>
    </div>
  );
}
