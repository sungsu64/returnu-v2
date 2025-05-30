// src/pages/EasterEggPage.jsx
import React, { useEffect, useState } from "react";
import { useLang } from "../locale";
import "../styles/EasterEggPage.css";

export default function EasterEggPage() {
  const { t } = useLang();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const arr = t("easterMessages");
    const random = arr[Math.floor(Math.random() * arr.length)];
    setMsg(random);
  }, [t]);

  return (
    <div className="easter-egg-container">
      <div className="emoji">🎁</div>
      <p className="easter-msg">{msg}</p>
      <button className="back-btn" onClick={() => window.history.back()}>
        {t("back")}
      </button>
    </div>
  );
}
