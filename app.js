const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
const InitializeServerAndDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is Running");
    });
  } catch (e) {
    console.log(`Db Error: ${e.message}`);
    process.exit(1);
  }
};

InitializeServerAndDb();

app.get("/movies/", async (request, response) => {
  const movieQuery = `SELECT * FROM movie;`;
  const dbResponse = await db.all(movieQuery);
  response.send(
    dbResponse.map((item) => {
      return { movieName: item.movie_name };
    })
  );
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const movieQuery = `INSERT INTO movie (director_id, movie_name, lead_actor)VALUES ( ${directorId},'${movieName}','${leadActor}');`;
  const dbResponse = await db.run(movieQuery);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieQuery = `SELECT * FROM movie WHERE movie_id = ${movieId};`;
  const player = await db.get(movieQuery);
  response.send({
    movieId: player.movie_id,
    directorId: player.director_id,
    movieName: player.movie_name,
    leadActor: player.lead_actor,
  });
});

app.put("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const movieQuery = `UPDATE movie SET director_id = ${directorId}, movie_name = '${movieName}', lead_actor = '${leadActor}' WHERE movie_id = ${movieId};`;
  const dbResponse = await db.run(movieQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `DELETE FROM movie WHERE movie_id = ${movieId};`;
  const dbResponse = await db.run(deleteQuery);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const directorQuery = `SELECT * FROM director;`;
  const dbResponse = await db.all(directorQuery);
  response.send(
    dbResponse.map((item) => {
      return { directorId: item.director_id, directorName: item.director_name };
    })
  );
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const directorsQuery = `SELECT movie_name FROM director NATURAL JOIN movie WHERE director_id = ${directorId};`;
  const dbResponse = await db.all(directorsQuery);
  response.send(dbResponse);
});

module.exports = app;
