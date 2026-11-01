# Lab 2: SQLite Database and CRUD Routes

**Name ·** _Your Full Name_  
**Registration Number ·** _Your Reg. No._  
**Section ·** _Your Section_

---

## Live Link

> Deployed on Render: **https://&lt;your-app-name&gt;.onrender.com**  
> _(Replace with your actual deployment URL, or write "Not applicable" and attach Postman screenshots.)_

---

## How to Run

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install Dependencies

```bash
npm install
```

### Environment Variables

This project does not require a `.env` file. The database file (`books.db`) is created automatically in the project root on first run.

> **Never commit `.env` or `node_modules`.**

### Start the Server

| Mode | Command | Notes |
|------|---------|-------|
| Development (auto-restart) | `npm run dev` | Uses **nodemon** |
| Production | `npm start` | Uses **node** |

The server starts at **http://localhost:3000/**.

---

## Seeding the Database

The `book` table is created automatically when the server starts.  
Insert the sample rows using the SQLite CLI:

```bash
sqlite3 books.db
```

```sql
INSERT INTO book (title, author, price, pages) VALUES
  ('The Pragmatic Programmer', 'David Thomas', 2150, 352),
  ('Clean Code', 'Robert C. Martin', 1800, 464),
  ('You Don''t Know JS', 'Kyle Simpson', 1200, 278),
  ('Eloquent JavaScript', 'Marijn Haverbeke', 999, 472),
  ('JavaScript: The Good Parts', 'Douglas Crockford', 899, 172),
  ('Learning Python', 'Mark Lutz', 2500, 1648),
  ('Design Patterns', 'Gang of Four', 2800, 395),
  ('Introduction to Algorithms', 'Cormen et al.', 3200, 1312),
  ('The Clean Coder', 'Robert C. Martin', 1650, 256),
  ('Refactoring', 'Martin Fowler', 2100, 448);
```

---

## Endpoints

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | GET | `/books/` | Return all books |
| 2 | GET | `/books/:bookId/` | Return one book by ID |
| 3 | POST | `/books/` | Add a new book |
| 4 | PUT | `/books/:bookId/` | Update an existing book |
| 5 | DELETE | `/books/:bookId/` | Remove a book |

### Request / Response Examples

#### GET /books/
```
GET http://localhost:3000/books/
```
Response 200 OK:
```json
[
  { "id": 1, "title": "The Pragmatic Programmer", "author": "David Thomas", "price": 2150, "pages": 352 },
  "..."
]
```

#### GET /books/:bookId/
```
GET http://localhost:3000/books/1/
```
Response 200 OK:
```json
{ "id": 1, "title": "The Pragmatic Programmer", "author": "David Thomas", "price": 2150, "pages": 352 }
```
Response 404 Not Found (invalid ID):
```json
{ "error": "Book not found" }
```

#### POST /books/
```
POST http://localhost:3000/books/
Content-Type: application/json
```
Body:
```json
{
  "title": "Node.js Design Patterns",
  "author": "Mario Casciaro",
  "price": 1999,
  "pages": 660
}
```
Response 201 Created:
```json
{ "id": 11, "message": "Book added successfully" }
```

#### PUT /books/:bookId/
```
PUT http://localhost:3000/books/1/
Content-Type: application/json
```
Body:
```json
{ "price": 1999 }
```
Response 200 OK:
```json
{ "message": "Book updated successfully" }
```

#### DELETE /books/:bookId/
```
DELETE http://localhost:3000/books/1/
```
Response 200 OK:
```json
{ "message": "Book removed successfully" }
```

---

## Screenshots

> Place your Postman screenshots in the `screenshots/` folder and reference them below.

![GET /books/ - all books](screenshots/get_all_books.png)
![GET /books/:bookId/ - single book](screenshots/get_one_book.png)
![POST /books/ - add a book](screenshots/post_book.png)
![PUT /books/:bookId/ - update a book](screenshots/put_book.png)
![DELETE /books/:bookId/ - delete a book](screenshots/delete_book.png)
![SQLite CLI - table view](screenshots/sqlite_cli.png)

---

## Notes - Problems Faced and How They Were Solved

| Problem | Solution |
|---------|----------|
| Server crashes if DB connection fails | `initializeDBAndServer()` catches the error, logs it, and calls `process.exit(1)` |
| Partial PUT overwrites columns with undefined | Destructure `req.body` using existing DB row values as defaults |
| `&&` not valid in PowerShell | Ran `npm install` commands separately |

---

## Viva Prep

**Why await the database call?**  
`db.all()`, `db.get()`, `db.run()` all return Promises. Without `await`, the route handler returns before the query completes, sending an empty or wrong response.

**What is SQL injection and how do placeholders prevent it?**  
SQL injection is when user-supplied input contains SQL syntax that alters the intended query (e.g., `' OR 1=1 --`). Placeholders (`?`) pass values to the driver separately from the query string so they are escaped and never interpreted as SQL commands.

**When is PUT used instead of POST?**  
POST creates a new resource; PUT replaces/updates an existing resource identified by its URL. Use PUT when you know the resource ID and want to modify it.
