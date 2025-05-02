import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORY_LIST = [
  "전체",
  "지갑",
  "휴대폰",
  "노트북",
  "이어폰",
  "열쇠",
  "기타"
];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const [openCat, setOpenCat] = useState(false);
  const catRef = useRef();

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const onClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setOpenCat(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/lost/list?query=${encodeURIComponent(search)}&cat=${encodeURIComponent(category)}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.logo}>📦 ReturnU</h1>
      <p style={styles.subtitle}>학교 분실물 검색</p>

      <form onSubmit={handleSearch} style={styles.form}>
        <div style={styles.searchBox}>
          <div
            ref={catRef}
            style={styles.category}
            onClick={() => setOpenCat((o) => !o)}
          >
            {category} ▾
            {openCat && (
              <ul style={styles.dropdown}>
                {CATEGORY_LIST.map((cat) => (
                  <li
                    key={cat}
                    style={styles.dropItem}
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
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색어를 입력하세요"
            style={styles.input}
            autoFocus
          />
          <button type="submit" style={styles.searchBtn}>
            🔍
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    paddingTop: "80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    fontSize: "2rem",
    color: "#ff6f00",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#888",
    marginBottom: "24px",
  },
  form: {
    width: "100%",
    maxWidth: "360px",
  },
  searchBox: {
    display: "flex",
    position: "relative",
    alignItems: "center",
  },
  category: {
    position: "relative",
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
    boxSizing: "border-box",
  },
  dropdown: {
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
  },
  dropItem: {
    padding: "10px 12px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  input: {
    flex: 1,
    height: "48px",
    padding: "0 16px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    outline: "none",
    boxSizing: "border-box",
  },
  searchBtn: {
    height: "48px",
    width: "48px",
    border: "none",
    background: "#ff6f00",
    color: "#fff",
    fontSize: "1.2rem",
    borderRadius: "0 8px 8px 0",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
