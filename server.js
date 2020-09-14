const chalk = require("chalk");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { response, request } = require("express");

// Create the Server
const app = express();

// TODO: add in middleware: cors, body-parser
app.use(bodyParser.json());

let recipes = [];

try {
  recipes = JSON.parse(fs.readFileSync("recipe.json")).recipes;
} catch (error) {
  console.log("No Existing file");
}

// TODO: add the endpoints e.g. app.get('/path', () => { ... })
app.get("/api/recipe", async (request, response) => {
  console.log(recipes);
  response.send(recipes);
});

app.get("/api/recipe/:id", async (request, response) => {
  const recipeId = Number(request.params.id);

  const recipe = recipes.find((r) => {
    if (recipeId === r.id) {
      return true;
    }
  });

  if (!recipe) {
    response.send(`Recipe with ID ${recipeId} not found`);
    return;
  }

  response.send(recipe);
});

// Create a New Product
app.post("/api/recipe", (request, response) => {
  const body = request.body;

  if (!body.id || !body.title || !body.category) {
    response
      .status(400)
      .send("Bad Request. Validation Error. Missing title and/or category");
    return;
  }
  recipes.push(body);

  const jsonPayload = {
    recipes: recipes,
  };

  fs.writeFileSync("recipe.json", JSON.stringify(jsonPayload));

  response.send();
});

// Update existing product by ID
app.put("/api/recipe/:id", (request, response) => {
  const recipeId = Number(request.params.id);

  const recipe = recipes.find((r) => {
    return recipeId === r.id;
  });

  if (!recipe) {
    response.send(`Recipe with id ${recipeId} not found!`);
    return;
  }

  const body = request.body;

  if (body.title) {
    recipe.title = body.title;
  }

  if (body.category) {
    recipe.category = recipe.category;
  }

  const jsonPayload = {
    recipes: recipes,
  };

  fs.writeFileSync("recipe.JSON", JSON.stringify(jsonPayload));

  response.send();
});

// Delete existing product by id
app.delete("/api/recipe/:id", (request, response) => {
  const recipeId = Number(request.params.id);

  const recipeIndex = recipes.findIndex((r) => {
    return recipeId === r.id;
  });

  if (recipeIndex === -1) {
    response.send(`Recipe with ID ${recipeId} not found`);
    return;
  }

  recipes.splice(recipeIndex, 1);

  const jsonPayload = {
    recipes: recipes,
  };
  fs.writeFileSync("recipe.json", JSON.stringify(jsonPayload));
  response.send();
});

// Starting the Server
const port = process.eventNames.PORT ? process.eventNames.PORT : 3001;
app.listen(port, () => {
  console.log(chalk.blue.bold("API") + chalk.red.bold("STARTED!"));
});
