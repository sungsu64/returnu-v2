import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mainImage from "./assets/main_illustration.png"; // 메인용 일러스트 이미지
import "../mobile-ui.css";

const CATEGORY_LIST = ["전체", "지갑", "휴대폰", "노트북", "이어폰", "열쇠", "기타"];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const [openCat, setOpenCat] = useState(false);
  const catRef = useRef();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const res = await fetch("http://localhost:8090/api/notices");
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
    navigate(`/lost/list?query=${encodeURIComponent(search)}&cat=${encodeURIComponent(category)}`);
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">📦 ReturnU</h1>
      <p style={{ textAlign: "center", color: "#607d8b", marginBottom: "24px" }}>학교 분실물 검색 서비스</p>

      {/* 🔍 검색창 */}
      <form onSubmit={handleSearch} style={{ maxWidth: "90%", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          {/* 카테고리 드롭다운 */}
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

          {/* 검색 입력창 */}
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

      {/* 🎨 일러스트 안내 */}
      <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "24px" }}>
        <img
          src={mainImage}
          alt="메인 일러스트"
          style={{ width: "180px", opacity: 0.9 }}
        />
        <p style={{ fontSize: "1.1rem", color: "#555", marginTop: "12px" }}>
          분실물을 찾고 있나요?
        </p>
        <p style={{ color: "#888" }}>아래 공지사항을 꼭 확인해주세요!</p>
      </div>

      {/* 📢 공지사항 카드들 */}
      <div style={{ padding: "0 16px" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "12px", color: "#009688" }}>
          📢 공지사항
        </h2>

        {loading && <p>불러오는 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {notices.length === 0 && !loading && (
          <p style={{ color: "#888" }}>등록된 공지사항이 없습니다.</p>
        )}

        {notices.map((notice) => (
          <div key={notice.id} className="notice-card">
            <div className="notice-title">{notice.title}</div>
            <div className="notice-content">{notice.content}</div>
            <div className="notice-date">
              📅 {new Date(notice.created_at).toLocaleDateString("ko-KR")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}