const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");

const db = null;
const InitializeServerAndDb = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3011, () => {
      console.log("server is Running");
    });
  } catch (e) {
    console.log(`Db Error: ${e.message}`);
    process.exit(1);
  }
};

InitializeServerAndDb();

app.get("/movies/", async (request, response) => {
  const movieQuery = `SELECT 
    *
    FROM 
    movie
    ORDER BY
    movie_id
    ;`;
  const outlet = await db.all(movieQuery);
  response.send(outlet);
});
