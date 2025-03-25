import express from "express";
import chalk from "chalk";

import { query } from "./db/index.js";

const app = express();
const jsonParser = express.json();
app.use(jsonParser);

app.get("/", async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM posts;");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/blogposts", async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM posts;");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/blogposts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { rows, rowCount } = await query(
      "SELECT * FROM posts WHERE id = $1;",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Post not found :(" });
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/blogposts", async (req, res) => {
  const { title } = req.body;

  if (!title) return res.status(400).json({ message: "Title required" });

  try {
    const { rows, rowCount } = await query(
      "INSERT INTO posts (title) values ($1) RETURNING *;",
      [title]
    );

    // console.log({ rows, rowCount });

    res
      .status(201)
      .json({ message: "Post successfully created.", data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/blogposts/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const { rows, rowCount } = await query(
      `
        UPDATE posts
          SET title = COALESCE($1, title)
        WHERE id = $2
        RETURNING *;
      `,
      [title, id]
    );

    // console.log({ rows, rowCount });
    if (rowCount === 0) {
      return res.status(404).json({ message: "Post not found :(" });
    }

    res
      .status(200)
      .json({ message: "Post successfully updated.", data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/blogposts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows, rowCount } = await query(
      "DELETE FROM posts WHERE id = $1 RETURNING *;",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Post not found :(" });
    }

    res.json({ message: "Post successfully updated.", data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log(chalk.green("Server is running on http://localhost:3000"));
});
