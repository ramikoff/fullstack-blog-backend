import express from "express";
import chalk from "chalk";
import fs from "fs";

const blogposts = JSON.parse(fs.readFileSync("./data.json", "utf8"));

const app = express();
const jsonParser = express.json();
app.use(jsonParser);

app.get("/", (req, res) => {
  //   res.send("Hello from express!");
  const data = {
    message: "Hello from express!",
  };
  res.json(data);
});

app.post("/", (req, res) => {
  res.status(201).json({
    message: "Data created!",
  });
});

app.get("/blogposts", (req, res) => {
  res.json(blogposts);
});

app.get("/blogposts/:id", (req, res) => {
  const { id } = req.params; // req.params is an object storing all the parameters
  const blogpost = blogposts.find((blogpost) => blogpost.id === parseInt(id)); // parseInt converts string to number
  res.json(blogpost);
});

app.post("/blogposts", (req, res) => {
  req.body.id = blogposts.length + 1;
  blogposts.push(req.body);
  res.status(201).json({
    message: "Data created!",
    data: blogposts,
  });
});

app.put("/blogposts/:id", (req, res) => {
  const { id } = req.params; // req.params is an object storing all the parameters
  const body = req.body;
  const blogpostInd = blogposts.findIndex(
    (blogpost) => blogpost.id === parseInt(id)
  ); // parseInt converts string to number
  blogposts.splice(blogpostInd, 1, { ...body, id: parseInt(id) });

  res.json(blogposts);
});

app.delete("/blogposts/:id", (req, res) => {
  const { id } = req.params; // req.params is an object storing all the parameters

  const blogpostInd = blogposts.findIndex(
    (blogpost) => blogpost.id === parseInt(id)
  ); // parseInt converts string to number
  blogposts.splice(blogpostInd, 1);

  res.json(blogposts);
});

app.listen(3000, () => {
  console.log(chalk.green("Server is running on http://localhost:3000"));
});
