import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mainImage from "./assets/main_illustration.png";
import NoticeSlider from "../components/NoticeSlider";
import FaqChatbot from "../components/FaqChatbot";
import "../styles/HomePage.css";

const CATEGORY_LIST = ["전체", "지갑", "휴대폰", "노트북", "이어폰", "열쇠", "기타"];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const [openCat, setOpenCat] = useState(false);
  const [selectedType, setSelectedType] = useState("분실물");
  const catRef = useRef();

  const [notices, setNotices] = useState([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setOpenCat(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/notices");
        if (!res.ok) throw new Error("공지사항을 불러오지 못했습니다.");
        const data = await res.json();
        setNotices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  const handleSearch = (e) => {
  e.preventDefault();
  if (!search.trim()) return;

  const path = selectedType === "분실물" ? "/lost/list" : "/requests";
  navigate(`${path}?query=${encodeURIComponent(search)}&cat=${encodeURIComponent(category)}`);
};


  return (
    <div className="app-wrapper">
      {notices.length > 0 && <NoticeSlider notices={notices} />}

      <div style={{
        textAlign: "center",
        margin: "24px 0 10px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
      }}>
        <img src="https://cdn-icons-png.flaticon.com/512/4783/4783110.png" alt="ReturnU Icon" style={{ width: "30px", height: "30px" }} />
        <h1 style={{ fontSize: "1.8rem", color: "#d19c66", margin: 0 }}>ReturnU</h1>
      </div>

      <form onSubmit={handleSearch} style={{ maxWidth: "90%", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <div
            ref={catRef}
            style={{
              padding: "0 12px",
              background: "#f0f0f0",
              color: "#333",
              fontSize: "0.9rem",
              height: "48px",
              lineHeight: "48px",
              border: "1px solid #ccc",
              borderRadius: "8px 0 0 8px",
              cursor: "pointer",
              userSelect: "none",
              boxSizing: "border-box"
            }}
            onClick={() => setOpenCat((o) => !o)}
          >
            {category} ▾
            {openCat && (
              <ul style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                background: "#fff",
                border: "1px solid #ccc",
                borderTop: "none",
                borderRadius: "0 0 8px 8px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 10,
                padding: 0,
                margin: 0,
                listStyle: "none",
              }}>
                {CATEGORY_LIST.map((cat) => (
                  <li
                    key={cat}
                    style={{ padding: "10px 12px", cursor: "pointer", fontSize: "0.9rem" }}
                    onClick={() => {
                      setCategory(cat);
                      setOpenCat(false);
                    }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ position: "relative", flex: 1, height: "48px" }}>
            <input
              type="text"
              className="input"
              placeholder="검색어 입력"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                padding: "0 48px 0 16px",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderLeft: "none",
                borderRadius: "0 8px 8px 0",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button type="submit" style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              color: "#888",
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}>🔍</button>
          </div>
        </div>
      </form>

      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "16px",
        padding: "4px",
        borderRadius: "16px",
        background: "#f2f2f2",
        width: "fit-content",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        {["분실물", "습득물"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: "8px 20px",
              borderRadius: "16px",
              border: "none",
              background: selectedType === type ? "#d19c66" : "transparent",
              color: selectedType === type ? "#fff" : "#555",
              fontWeight: "bold",
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="home-illustration">
        <img src={mainImage} alt="메인 일러스트" className="main-image" />
        <p className="guide-text">분실물을 찾고 있나요?</p>
        <p className="sub-guide-text">아래 내용을 꼭 읽어주세요!!</p>
      </div>

      <div className="usage-guide-box">
        🫁 <strong>ReturnU 사용 가이드</strong><br />
        🔍 <strong>검색창에</strong> 분실물을 검색해보세요.<br />
        ➕ 버튼을 누르면 <strong>분실물·습득물 등록</strong>도 할 수 있어요!
      </div>

      <FaqChatbot />
    </div>
  );
}
