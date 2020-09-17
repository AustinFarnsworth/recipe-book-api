const chalk = require("chalk");
const express = require("express");
const bodyParser = require("body-parser");
const { response, request } = require("express");
const dataAccessLayer = require("./dataAccessLayer");
const { ObjectId } = require("mongodb");
const cors = require("cors");
dataAccessLayer.connect();

// Create the Server
const app = express();

app.use(cors());

// TODO: add in middleware: cors, body-parser
app.use(bodyParser.json());

// TODO: add the endpoints e.g. app.get('/path', () => { ... })
app.get("/api/recipe", async (request, response) => {
  const recipes = await dataAccessLayer.findAll();

  // console.log(recipes);
  response.send(recipes);
});

app.get("/api/recipe/:id", async (request, response) => {
  const recipeName = request.params.id;

  const recipeQuery = {
    _id: new ObjectId(recipeId),
  };
  let recipes = await dataAccessLayer.findOne();

  try {
    recipes = await dataAccessLayer.findOne();
  } catch (error) {
    response.send(`Recipe with ID ${recipeId} not found `);
    return;
  }

  if (!recipe) {
    response.send(`Recipe with ID ${recipeId} not found`);
    return;
  }

  response.send(recipe);
});

// Create a New Product
app.post("/api/recipe", async (request, response) => {
  const body = request.body;

  if (!body.name || !body.ingredients || !body.instructions || !body.category) {
    response
      .status(400)
      .send("Bad Request. Validation Error. Missing title and/or category");
    return;
  }

  await dataAccessLayer.insertOne(body);

  response.send();
});

// Update existing product by ID
app.put("/api/recipe/:id", async (request, response) => {
  const recipeId = request.params.id;
  const body = request.body;

  const recipeQuery = {
    _id: new ObjectId(recipeId),
  };
  await dataAccessLayer.updateOne(recipeQuery, body);

  response.send();
});

// Delete existing product by id
app.delete("/api/recipe/:id", async (request, response) => {
  const recipeId = request.params.id;

  const recipeQuery = {
    _id: new ObjectId(recipeId),
  };

  await dataAccessLayer.deleteOne(recipeQuery);

  response.send();
});

// Starting the Server
const port = process.env.PORT ? process.env.PORT : 3003;
app.listen(port, () => {
  console.log(chalk.blue.bold("API") + chalk.red.bold("STARTED!"));
});
