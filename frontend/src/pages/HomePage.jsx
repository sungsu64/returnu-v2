// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLang } from "../locale";
import mainImage from "./assets/main_illustration.png";
import NoticeSlider from "../components/NoticeSlider";
import FaqChatbot from "../components/FaqChatbot";
import "../styles/HomePage.css";

const CATEGORY_LIST = ["분실물", "습득물"];

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("분실물");
  const [openCat, setOpenCat] = useState(false);
  const catRef = useRef();

  const [notices, setNotices] = useState([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);

  const [isDark, setIsDark] = useState(document.body.classList.contains("dark"));
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.body.classList.contains("dark"))
    );
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const qp = new URLSearchParams(location.search);
    setSearch(qp.get("query") || "");
    setCategory(qp.get("cat") || "분실물");
  }, [location.search]);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/notices");
        if (!res.ok) throw new Error(t("loadNoticesFailed"));
        const data = await res.json();
        setNotices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, [t]);

  const colors = {
    bg: isDark ? "#23242c" : "#fafafa",
    catBg: isDark ? "#35364b" : "#f0f0f0",
    catText: isDark ? "#ffe4ad" : "#333",
    catBorder: isDark ? "#393a4b" : "#ccc",
    dropBg: isDark ? "#232533" : "#fff",
    dropText: isDark ? "#ffe4ad" : "#333",
    dropHover: isDark ? "#35364b" : "#f4e7d1",
    inputBg: isDark ? "#232533" : "#fff",
    inputText: isDark ? "#ffe4ad" : "#333",
    inputBorder: isDark ? "#393a4b" : "#ccc",
    searchBtn: isDark ? "#ffc16c" : "#888",
  };

  const handleSearch = e => {
    e.preventDefault();
    if (!search.trim()) return;
    const path = category === "분실물" ? "/lost/list" : "/requests";
    navigate(`${path}?query=${encodeURIComponent(search)}&cat=${encodeURIComponent(category)}`);
  };

  return (
    <div className="app-wrapper" style={{ background: colors.bg, minHeight: "100vh" }}>
      {notices.length > 0 && <NoticeSlider notices={notices} />}

      <div style={{
        textAlign: "center",
        margin: "24px 0 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
      }}>
        <img src="https://cdn-icons-png.flaticon.com/512/4783/4783110.png" alt="Icon" style={{ width: 30, height: 30 }} />
        <h1 style={{ fontSize: "1.8rem", color: isDark ? "#ffc16c" : "#d19c66", margin: 0 }}>
          ReturnU
        </h1>
      </div>

      <form onSubmit={handleSearch} style={{ maxWidth: "90%", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <div
            ref={catRef}
            onClick={() => setOpenCat(prev => !prev)}
            style={{
              padding: "0 12px",
              background: colors.catBg,
              color: colors.catText,
              fontSize: "0.9rem",
              height: 48,
              lineHeight: "48px",
              border: `1px solid ${colors.catBorder}`,
              borderRadius: "8px 0 0 8px",
              cursor: "pointer",
              userSelect: "none",
              minWidth: 110,
              position: "relative",
              zIndex: 11
            }}
          >
            {category} ▾
            {openCat && (
              <ul style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                background: colors.dropBg,
                border: `1px solid ${colors.catBorder}`,
                borderTop: "none",
                borderRadius: "0 0 8px 8px",
                maxHeight: 220,
                overflowY: "auto",
                margin: 0,
                padding: 0,
                listStyle: "none",
                zIndex: 100
              }}>
                {CATEGORY_LIST.map(cat => (
                  <li
                    key={cat}
                    onMouseDown={() => {
                      setCategory(cat);
                      setOpenCat(false); // 드롭다운 닫힘 확실히 실행
                    }}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      color: colors.dropText,
                      background: category === cat ? colors.catBg : "transparent",
                      transition: "background 0.15s"
                    }}
                    onMouseOver={e => e.currentTarget.style.background = colors.dropHover}
                    onMouseOut={e => e.currentTarget.style.background = (category === cat ? colors.catBg : "transparent")}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ position: "relative", flex: 1, height: 48 }}>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                padding: "0 48px 0 16px",
                fontSize: "1rem",
                border: `1px solid ${colors.inputBorder}`,
                borderLeft: "none",
                borderRadius: "0 8px 8px 0",
                background: colors.inputBg,
                color: colors.inputText,
                outline: "none"
              }}
            />
            <button type="submit" style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              color: colors.searchBtn,
              fontSize: "1.2rem",
              cursor: "pointer",
            }}>🔍</button>
          </div>
        </div>
      </form>

      <div className="home-illustration">
        <img src={mainImage} alt={t("mainIllustrationAlt")} className="main-image" />
        <p className="guide-text">{t("guideLine1")}</p>
        <p className="sub-guide-text">{t("guideLine2")}</p>
      </div>

      <div className="usage-guide-box">
        🫁 <strong>{t("usageGuideTitle")}</strong><br />
        🔍 <strong>{t("usageGuideSearch")}</strong><br />
        ➕ {t("usageGuideRegister")}
      </div>

      <FaqChatbot />
    </div>
  );
}
