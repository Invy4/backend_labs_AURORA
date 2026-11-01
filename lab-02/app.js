const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.run(`
      CREATE TABLE IF NOT EXISTS book (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        title   TEXT    NOT NULL,
        author  TEXT    NOT NULL,
        price   INTEGER NOT NULL,
        pages   INTEGER NOT NULL
      )
    `);

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/books/", async (req, res) => {
  try {
    const books = await db.all("SELECT * FROM book");
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );
    if (book === undefined) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/books/", async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;

    if (!title || !author || price === undefined || pages === undefined) {
      return res
        .status(400)
        .json({ error: "title, author, price and pages are required" });
    }

    const result = await db.run(
      "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)",
      [title, author, price, pages]
    );

    res.status(201).json({ id: result.lastID, message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;

    const existing = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );
    if (existing === undefined) {
      return res.status(404).json({ error: "Book not found" });
    }

    const {
      title  = existing.title,
      author = existing.author,
      price  = existing.price,
      pages  = existing.pages,
    } = req.body;

    await db.run(
      "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?",
      [title, author, price, pages, bookId]
    );

    res.json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;

    const existing = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );
    if (existing === undefined) {
      return res.status(404).json({ error: "Book not found" });
    }

    await db.run("DELETE FROM book WHERE id = ?", [bookId]);
    res.json({ message: "Book removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
