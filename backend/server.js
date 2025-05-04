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
    console.error("\u274C MySQL \uc5f0\uacb0 \uc2e4\ud328:", err);
    return;
  }
  console.log("\u2705 MySQL \uc5f0\uacb0 \uc131\uacf5!");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

app.get("/api/lost-items", (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const query = `
    SELECT id, title, location, date, description, image, claimed_by
    FROM lost_items
    WHERE claimed_by IS NULL OR claimed_by = ''
    ORDER BY id DESC
    LIMIT ?
  `;
  connection.query(query, [limit], (err, results) => {
    if (err) return res.status(500).send("\uc11c\ubc84 \uc5d0\ub7ec");
    res.json(results);
  });
});

app.post("/api/lost-items", upload.single("image"), (req, res) => {
  const { title, location, date, description, category } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !location || !date || !category) {
    return res.status(400).json({ error: "\ud544\uc218 \ud56d\ubaa9\uc774 \ub204\ub77d\ub418\uc5c8\uc2b5\ub2c8\ub2e4." });
  }

  const sql = `
    INSERT INTO lost_items (title, location, date, description, category, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [title, location, date, description, category, imagePath];

  connection.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "\uc11c\ubc84 \uc624\ub958" });
    res.status(201).json({ message: "\ub4f1\ub85d \uc131\uacf5", id: result.insertId });
  });
});

app.get("/api/lost-items/search", (req, res) => {
  const query = req.query.query || "";
  const cat = req.query.cat || "전체";
  const order = req.query.order === "asc" ? "ASC" : "DESC";
  const status = req.query.status || "전체";

  const likeQuery = `%${query}%`;
  let sql = `
    SELECT id, title, location, date, claimed_by, image
    FROM lost_items
    WHERE title LIKE ?
  `;
  const values = [likeQuery];

  if (cat !== "전체") {
    sql += ` AND category = ?`;
    values.push(cat);
  }

  if (status === "미수령") {
    sql += ` AND (claimed_by IS NULL OR claimed_by = '')`;
  } else if (status === "수령완료") {
    sql += ` AND claimed_by IS NOT NULL AND claimed_by != ''`;
  }

  sql += ` ORDER BY date ${order}`;

  connection.query(sql, values, (err, results) => {
    if (err) return res.status(500).send("\uc11c\ubc84 \uc5d0\ub7ec");
    if (results.length === 0) return res.status(404).send("\ub370\uc774\ud130 \uc5c6\uc74c");
    res.json(results);
  });
});

app.get("/api/lost-items/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT id, title, location, date, description, image, claimed_by,
           IFNULL(created_at, NOW()) as created_at
    FROM lost_items
    WHERE id = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).send("\uc11c\ubc84 \uc5d0\ub7ec");
    if (results.length === 0) return res.status(404).send("\ub370\uc774\ud130 \uc5c6\uc74c");
    res.json(results[0]);
  });
});

app.post("/api/lost-items/claim/:id", (req, res) => {
  const { id } = req.params;
  const { claimed_by } = req.body;
  const query = `
    UPDATE lost_items
    SET claimed_by = ?, claimed_at = NOW()
    WHERE id = ?
  `;
  connection.query(query, [claimed_by, id], (err) => {
    if (err) return res.status(500).send("\uc11c\ubc84 \uc5d0\ub7ec");
    res.status(200).json({ message: "\uc218\ub839 \ucc98\ub9ac \uc644\ub8cc" });
  });
});

app.delete("/api/lost-items/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM lost_items WHERE id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) return res.status(500).send("\uc11c\ubc84 \uc5d0\ub7ec");
    if (result.affectedRows === 0) return res.status(404).send("\ub370\uc774\ud130 \uc5c6\uc74c");
    res.status(200).json({ message: "\uc0ad\uc81c \uc644\ub8cc" });
  });
});

app.post("/api/login", (req, res) => {
  const { student_id, password } = req.body;
  if (!student_id || !password) {
    return res.status(400).json({ error: "\ud559\ubc88\uacfc \ube44\ubc00\ubc88\ud638\ub97c \uc785\ub825\ud574\uc8fc\uc138\uc694." });
  }

  const query = `
    SELECT name, student_id, role
    FROM users
    WHERE student_id = ? AND password = ?
  `;

  connection.query(query, [student_id, password], (err, results) => {
    if (err) return res.status(500).json({ error: "\uc11c\ubc84 \uc624\ub958" });
    if (results.length === 0) {
      return res.status(401).json({ error: "\ud559\ubc88 \ub610\ub294 \ube44\ubc00\ubc88\ud638\uac00 \uc77c\uce58\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4." });
    }
    res.json({ user: results[0] });
  });
});

app.get("/api/notices", (req, res) => {
  const query = "SELECT id, title, content, created_at FROM notices ORDER BY created_at DESC";
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send("\uc11c\ubc84 \uc5d0\ub7ec");
    res.json(results);
  });
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(port, () => {
  console.log(`\ud83d\ude80 \uc11c\ubc84 \uc2e4\ud589 \uc911: http://localhost:${port}`);
});
