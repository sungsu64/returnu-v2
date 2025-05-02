// backend/server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const port = 8090;

app.use(cors());
app.use(express.json());

// ✅ MySQL 연결 설정
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",         // ← 본인 MySQL 사용자명
  password: "1234",     // ← 본인 비밀번호
  database: "returnu-v2" // ← 생성한 DB 이름
});

// ✅ 연결 테스트
connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL 연결 실패:", err);
    return;
  }
  console.log("✅ MySQL 연결 성공!");
});

// ✅ 최근 분실물 가져오기 API
app.get("/api/lost-items", (req, res) => {
  const limit = parseInt(req.query.limit) || 4;

  const query = `
    SELECT id, title, location, date, description, created_at 
    FROM lost_items 
    ORDER BY id DESC 
    LIMIT ?
  `;

  connection.query(query, [limit], (err, results) => {
    if (err) {
      console.error("❌ 분실물 목록 조회 실패:", err);
      return res.status(500).send("서버 에러");
    }
    res.json(results);
  });
});

// ✅ 서버 실행
app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});
