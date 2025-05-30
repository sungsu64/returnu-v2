const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8090;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend/build")));

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "1234",
  database: process.env.DB_NAME || "returnu-v2",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL 연결 실패:", err);
    return;
  }
  console.log("✅ MySQL 연결 성공!");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

app.post("/api/users/change-password", (req, res) => {
  const { student_id, currentPassword, newPassword } = req.body;

  connection.query(
    "SELECT * FROM users WHERE student_id = ? AND password = ?",
    [student_id, currentPassword],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB 오류" });
      if (results.length === 0)
        return res.status(400).json({ message: "현재 비밀번호가 올바르지 않습니다." });

      connection.query(
        "UPDATE users SET password = ? WHERE student_id = ?",
        [newPassword, student_id],
        (err2) => {
          if (err2) return res.status(500).json({ message: "비밀번호 업데이트 실패" });
          res.json({ message: "비밀번호 변경 성공" });
        }
      );
    }
  );
});

app.get("/api/lost-items", (req, res) => {
  // 예시: 전체 분실물 반환
  const sql = "SELECT * FROM lost_items ORDER BY date DESC";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});
// 🔽 이하 동일한 API들 그대로 유지 (생략 없음)
// ✅ 아래 라우트 하나만 남기세요 (필터 한글/영문 모두 커버)
app.get("/api/lost-items/search", (req, res) => {
  const query = req.query.query || "";
  const cat = req.query.cat || "전체";
  const status = req.query.status || "전체";
  const order = req.query.order === "asc" ? "ASC" : "DESC";
  const likeQuery = `%${query}%`;
  let sql = `
    SELECT id, title, location, date, claimed_by, image, created_at
    FROM lost_items
    WHERE title LIKE ?
  `;
  const values = [likeQuery];

  // 카테고리 필터 (all/전체 제외)
  if (cat !== "전체" && cat !== "all") {
    sql += ` AND category = ?`;
    values.push(cat);
  }

  // 상태 필터 (영문/한글 모두 지원)
  if (
    status === "미수령" ||
    status.toLowerCase() === "unclaimed"
  ) {
    sql += ` AND (claimed_by IS NULL OR claimed_by = '')`;
  } else if (
    status === "수령완료" ||
    status.toLowerCase() === "claimed"
  ) {
    sql += ` AND claimed_by IS NOT NULL AND claimed_by != ''`;
  }

  sql += ` ORDER BY date ${order}`;

  connection.query(sql, values, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

// 분실물 등록(POST) 라우트 -- 반드시 추가!
app.post("/api/lost-items", upload.single("image"), (req, res) => {
  const { title, location, date, description, category, student_id } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  // 필수 값 체크
  if (!title || !location || !date || !category) {
    return res.status(400).json({ error: "필수 항목이 누락되었습니다." });
  }

  const sql = `
    INSERT INTO lost_items (title, location, date, description, category, image, student_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [title, location, date, description, category, imagePath, student_id];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ 분실물 등록 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.status(201).json({ message: "등록 성공", id: result.insertId });
  });
});

// 분실물 상세 조회
app.get("/api/lost-items/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT id, title, location, date, description, image, claimed_by, created_at, category, student_id
    FROM lost_items WHERE id = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    if (results.length === 0) return res.status(404).send("데이터 없음");
    res.json(results[0]);
  });
});


// ✅ 쪽지 전송 API (is_read 포함)
app.post("/api/messages", (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ error: "필수 항목 누락" });
  }

  const query = `
    INSERT INTO messages (sender_id, receiver_id, content, is_read)
    VALUES (?, ?, ?, 0)
  `;
  connection.query(query, [sender_id, receiver_id, content], (err, result) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    res.status(201).json({ message: "쪽지 전송 완료", id: result.insertId });
  });
});

app.get("/api/messages/received/:studentId", (req, res) => {
  const { studentId } = req.params;
  const query = `
    SELECT * FROM messages WHERE receiver_id = ? ORDER BY sent_at DESC
  `;
  connection.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    res.json(results);
  });
});

app.get("/api/messages/sent/:studentId", (req, res) => {
  const { studentId } = req.params;
  const query = `
    SELECT * FROM messages WHERE sender_id = ? ORDER BY sent_at DESC
  `;
  connection.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    res.json(results);
  });
});

app.get("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM messages WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).send("서버 오류");
    if (results.length === 0) return res.status(404).send("쪽지 없음");
    res.json(results[0]);
  });
});

app.patch("/api/messages/read/:id", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE messages SET is_read = 1 WHERE id = ?";
  connection.query(query, [id], (err) => {
    if (err) return res.status(500).send("서버 오류");
    res.status(200).json({ message: "읽음 처리 완료" });
  });
});

app.delete("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM messages WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("서버 오류");
    res.status(200).json({ message: "삭제 완료" });
  });
});

// 🔽 요청 전체 조회
app.get("/api/lost-requests", (req, res) => {
  const query = `SELECT * FROM lost_requests ORDER BY date DESC`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});
// 🔽 요청글 삭제 API (admin만 사용 가정)
app.delete("/api/lost-requests/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM lost_requests WHERE id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ 요청 삭제 오류:", err);
      return res.status(500).json({ error: "삭제 실패" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "해당 글이 없습니다." });
    }
    res.status(200).json({ message: "삭제 완료" });
  });
});

// 🔽 요청 상세 조회
app.get("/api/lost-requests/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT id, title, date, location, description, category, phone, email, image, student_id, created_at
    FROM lost_requests
    WHERE id = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    if (results.length === 0) return res.status(404).json({ error: "해당 요청 없음" });
    res.json(results[0]);
  });
});

// 🔽 분실물 요청 등록 (student_id 포함)
app.post("/api/lost-requests", upload.single("image"), (req, res) => {
  const {
    title, date, location, description,
    category, phone, email, student_id
  } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !date || !location || !description || (!phone && !email)) {
    return res.status(400).json({ error: "필수 항목 누락" });
  }

  const sql = `
    INSERT INTO lost_requests 
    (title, date, location, description, category, phone, email, image, student_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [title, date, location, description, category, phone, email, imagePath, student_id];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ 분실물 요청 등록 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.status(201).json({ message: "요청 등록 성공", id: result.insertId });
  });
});



// 🔽 로그인
app.post("/api/login", (req, res) => {
  const { student_id, password } = req.body;
  if (!student_id || !password) {
    return res.status(400).json({ error: "학번과 비밀번호를 입력해주세요." });
  }
  const query = `
    SELECT name, student_id, role
    FROM users
    WHERE student_id = ? AND password = ?
  `;
  connection.query(query, [student_id, password], (err, results) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    if (results.length === 0) {
      return res.status(401).json({ error: "학번 또는 비밀번호가 일치하지 않습니다." });
    }
    res.json({ user: results[0] });
  });
});

// 🔽 공지사항 관련
app.get("/api/notices", (req, res) => {
  const query = `SELECT id, title, content, created_at FROM notices ORDER BY created_at DESC`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

app.get("/api/notices/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT id, title, content FROM notices WHERE id = ?`;
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    if (results.length === 0) return res.status(404).send("공지 없음");
    res.json(results[0]);
  });
});

app.post("/api/notices", (req, res) => {
  const { title, content } = req.body;
  connection.query(
    "INSERT INTO notices (title, content) VALUES (?, ?)",
    [title, content],
    (err, result) => {
      if (err) return res.status(500).send("서버 에러");
      res.status(201).json({ id: result.insertId });
    }
  );
});

app.put("/api/notices/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  connection.query(
    "UPDATE notices SET title = ?, content = ? WHERE id = ?",
    [title, content, id],
    (err) => {
      if (err) return res.status(500).send("서버 에러");
      res.json({ message: "수정 완료" });
    }
  );
});

app.delete("/api/notices/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM notices WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("서버 에러");
    res.json({ message: "삭제 완료" });
  });
});

// 🔽 마이페이지 관련
app.get("/api/users/:studentId/lost-items", (req, res) => {
  const { studentId } = req.params;
  const query = `
    SELECT id, title, location, date
    FROM lost_items
    WHERE student_id = ?
    ORDER BY date DESC
  `;
  connection.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

app.get("/api/users/:studentId/lost-requests", (req, res) => {
  const { studentId } = req.params;
  const query = `
    SELECT id, title, location, date
    FROM lost_requests
    WHERE student_id = ?
    ORDER BY date DESC
  `;
  connection.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

// 🔽 유효기간 D-3
app.get("/api/lost-items/expiring-soon", (req, res) => {
  const query = `
    SELECT id, title, location, DATE_ADD(created_at, INTERVAL 14 DAY) AS expireDate
    FROM lost_items
    WHERE (claimed_by IS NULL OR claimed_by = '')
      AND DATE_ADD(created_at, INTERVAL 14 DAY) <= DATE_ADD(NOW(), INTERVAL 3 DAY)
    ORDER BY created_at ASC
  `;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

app.get("/api/admin/activity-logs", (req, res) => {
  const query = `
    SELECT id, action, timestamp
    FROM admin_logs
    ORDER BY timestamp DESC
    LIMIT 10
  `;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

app.get("/api/inquiries/by-student/:student_id", (req, res) => {
  const { student_id } = req.params;
  const query = `
    SELECT id, title, created_at, email
    FROM inquiries
    WHERE student_id = ?
    ORDER BY created_at DESC
  `;
  connection.query(query, [student_id], (err, results) => {
    if (err) {
      console.error("❌ 문의 목록 조회 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.json(results);
  });
});

app.post("/api/inquiries", (req, res) => {
  const { name, student_id, email, title, message } = req.body;

  if (!name || !student_id || !email || !title || !message) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  const query = `
    INSERT INTO inquiries (name, student_id, email, title, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(query, [name, student_id, email, title, message], (err, result) => {
    if (err) {
      console.error("❌ 문의 등록 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.status(201).json({ message: "문의가 등록되었습니다.", id: result.insertId });
  });
});

// 🔽 문의 상세 조회
app.get("/api/inquiries/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM inquiries WHERE id = ?`;
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    if (results.length === 0) return res.status(404).json({ error: "해당 문의 없음" });
    res.json(results[0]);
  });
});

app.post("/api/feedbacks", (req, res) => {
  const { student_id, content } = req.body;

  if (!student_id || !content) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  const query = `
    INSERT INTO feedbacks (student_id, content)
    VALUES (?, ?)
  `;

  connection.query(query, [student_id, content], (err, result) => {
    if (err) {
      console.error("❌ 피드백 등록 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.status(201).json({ message: "피드백이 저장되었습니다." });
  });
});

app.get("/api/feedbacks", (req, res) => {
  const query = `
    SELECT id, student_id, content, created_at
    FROM feedbacks
    ORDER BY created_at DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ 피드백 조회 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.json(results);
  });
});

app.get("/api/inquiries", (req, res) => {
  const query = `
    SELECT id, title, student_id, email, created_at
    FROM inquiries
    ORDER BY created_at DESC
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ 전체 문의 조회 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.json(results);
  });
});

app.get("/api/lost-items/by-student/:student_id", (req, res) => {
  const { student_id } = req.params;
  const query = `
    SELECT id, title, location, date
    FROM lost_items
    WHERE student_id = ?
    ORDER BY date DESC
  `;
  connection.query(query, [student_id], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

app.get("/api/feedbacks/by-student/:student_id", (req, res) => {
  const { student_id } = req.params;
  const query = `
    SELECT id, content, created_at
    FROM feedbacks
    WHERE student_id = ?
    ORDER BY created_at DESC
  `;
  connection.query(query, [student_id], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});


// server.js
app.get("/api/lost_requests/by-student/:student_id", (req, res) => {
  const { student_id } = req.params;
  const query = `
    SELECT id, title, location, date
    FROM lost_requests
    WHERE student_id = ?
    ORDER BY date DESC
  `;
  connection.query(query, [student_id], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});



app.patch("/api/inquiries/:id/reply", (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  if (!reply) {
    return res.status(400).json({ error: "답변 내용을 입력해주세요." });
  }

  const query = `UPDATE inquiries SET reply = ? WHERE id = ?`;
  connection.query(query, [reply, id], (err, result) => {
    if (err) {
      console.error("❌ 답변 저장 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.json({ message: "답변이 등록되었습니다." });
  });
});


// 🔽 관리자용 전체 분실물 글 조회
app.get("/api/lost-items/all", (req, res) => {
  const query = `
    SELECT id, title, location, date, student_id
    FROM lost_items
    ORDER BY date DESC
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ 분실물 전체 조회 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.json(results);
  });
});

// 🔽 관리자용 전체 습득물 요청 글 조회
app.get("/api/lost_requests/all", (req, res) => {
  const query = `
    SELECT id, title, location, date, student_id
    FROM lost_requests
    ORDER BY date DESC
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ 습득물 전체 조회 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.json(results);
  });
});

// 사용자 내 글 관리 삭제
app.delete("/api/inquiries/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM inquiries WHERE id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ 문의 삭제 오류:", err);
      return res.status(500).json({ error: "삭제 실패" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "해당 글이 없습니다." });
    }
    res.status(200).json({ message: "삭제 완료" });
  });
});

app.delete("/api/feedbacks/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM feedbacks WHERE id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ 피드백 삭제 오류:", err);
      return res.status(500).json({ error: "삭제 실패" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "해당 피드백이 없습니다." });
    }
    res.status(200).json({ message: "삭제 완료" });
  });
});

app.delete("/api/lost_requests/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM lost_requests WHERE id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ 습득물 삭제 오류:", err);
      return res.status(500).json({ error: "삭제 실패" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "해당 요청이 없습니다." });
    }
    res.status(200).json({ message: "삭제 완료" });
  });
});

//사용자 내 글 관리 피드백 수정
app.get("/api/feedbacks/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT id, student_id, content, created_at FROM feedbacks WHERE id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    if (results.length === 0) return res.status(404).json({ error: "피드백 없음" });
    res.json(results[0]);
  });
});

app.patch("/api/feedbacks/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) return res.status(400).json({ error: "내용이 비어있습니다." });

  const query = `UPDATE feedbacks SET content = ? WHERE id = ?`;
  connection.query(query, [content, id], (err, result) => {
    if (err) {
      console.error("❌ 피드백 수정 오류:", err);
      return res.status(500).json({ error: "수정 실패" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "피드백 없음" });
    }
    res.status(200).json({ message: "수정 완료" });
  });
});

//사용자 내 글 관리 문의하기 수정
app.patch("/api/inquiries/:id", (req, res) => {
  const { id } = req.params;
  const { title, message } = req.body;
  if (!title || !message) return res.status(400).json({ error: "필드 누락" });

  const query = "UPDATE inquiries SET title = ?, message = ? WHERE id = ?";
  connection.query(query, [title, message, id], (err, result) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "해당 글 없음" });
    res.status(200).json({ message: "수정 완료" });
  });
});

//사용자 내 글 관리 습득물 수정
app.patch("/api/lost-items/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const {
    title, location, date, description, category
  } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  let sql = `
    UPDATE lost_items
    SET title = ?, location = ?, date = ?, description = ?, category = ?
  `;
  const values = [title, location, date, description, category];

  if (imagePath) {
    sql += `, image = ?`;
    values.push(imagePath);
  }

  sql += ` WHERE id = ?`;
  values.push(id);

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ 습득물 수정 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.json({ message: "수정 완료" });
  });
});

app.put("/api/lost_requests/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { title, date, location, description, category, phone, email } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  let sql = `
    UPDATE lost_requests
    SET title = ?, date = ?, location = ?, description = ?, category = ?, phone = ?, email = ?
  `;
  const values = [title, date, location, description, category, phone, email];

  if (imagePath) {
    sql += `, image = ?`;
    values.push(imagePath);
  }

  sql += ` WHERE id = ?`;
  values.push(id);

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ 습득물 수정 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.status(200).json({ message: "수정 완료" });
  });
});

app.get("/api/lost_requests/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM lost_requests WHERE id = ?`;
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).send("서버 오류");
    if (results.length === 0) return res.status(404).send("없음");
    res.json(results[0]);
  });
});



// 🔚 React fallback
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});
