const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");
const { v4: uuidv4 } = require("uuid");

const app = express();
const db = new Database("database.sqlite");

app.use(cors());
app.use(express.json());

const SECRET_KEY = "ukrtwitch_secret";

// Створення таблиць, якщо їх ще немає
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT
)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS streams (
  id TEXT PRIMARY KEY,
  title TEXT,
  streamer TEXT
)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  streamId TEXT,
  username TEXT,
  message TEXT,
  timestamp INTEGER
)`).run();

// Реєстрація
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hashed = bcrypt.hashSync(password, 8);
  try {
    db.prepare("INSERT INTO users (id, username, password) VALUES (?, ?, ?)")
      .run(uuidv4(), username, hashed);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Username exists" });
  }
});

// Логін
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) return res.status(400).json({ error: "User not found" });
  if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ error: "Wrong password" });
  const token = jwt.sign({ id: user.id, username }, SECRET_KEY);
  res.json({ token });
});

// Список стрімів
app.get("/streams", (req, res) => {
  const streams = db.prepare("SELECT * FROM streams").all();
  res.json(streams);
});

// Додавання повідомлення (через API)
app.post("/messages", (req, res) => {
  const { streamId, username, message } = req.body;
  db.prepare("INSERT INTO messages (id, streamId, username, message, timestamp) VALUES (?, ?, ?, ?, ?)")
    .run(uuidv4(), streamId, username, message, Date.now());
  res.json({ success: true });
});

// Отримати повідомлення стріму
app.get("/messages/:streamId", (req, res) => {
  const { streamId } = req.params;
  const messages = db.prepare("SELECT * FROM messages WHERE streamId = ? ORDER BY timestamp ASC").all(streamId);
  res.json(messages);
});

// Запуск сервера
app.listen(4000, () => {
  console.log("API listening on 4000");
});
