// TODO: 'require' mongodb

const { request } = require("express");

// TODO: 'require' env file
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// TODO: read those env variables from process.env.VAR_NAME
const url = process.env.MONGODB_URL;
const databaseName = process.env.MONGODB_DATABASE;

// console.log(url);
// console.log(databaseName);

// TODO: Define all functions that talk to Database
const collectionName = "recipeBook";
const settings = {
  useUnifiedTopology: true,
};

let databaseClient;
let recipeName;

// -connect()
const connect = function () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, settings, (error, client) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      databaseClient = client.db(databaseName);
      recipeName = databaseClient.collection(collectionName);
      console.log("Successfully Connected to Database!");
      resolve();
    });
  });
};
// -findAll() documents (Read -R from CRUD)
const findAll = function () {
  const query = {};

  return new Promise((resolve, reject) => {
    recipeName.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      console.log(`Successfully found ${documents.length} Documents`);
      resolve(documents);
    });
  });
};

// -findOne() document (READ) optional
const findOne = function (query) {
  return new Promise((resolve, reject) => {
    recipeName.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      if (documents.length > 0) {
        console.log("Successfully Found Document!");
        const document = documents[0];
        resolve(document);
      } else {
        reject("No Document Found!");
      }
    });
  });
};

// -insertOne() document  (CREATE -C from CRUD)
const insertOne = function (recipe) {
  return new Promise((resolve, reject) => {
    recipeName.insertOne(recipe, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log("Successfully Inserted Document!");
      resolve();
    });
  });
};
// -updateOne() document (UPDATE - U from CRUD)
const updateOne = function (query, recipeList) {
  const recipeListQuery = {};

  if (recipeList.title) {
    recipeListQuery.title = recipeList.title;
  }

  if (recipeList.category) {
    recipeListQuery.category = recipeList.category;
  }

  return new Promise((resolve, reject) => {
    recipeName.updateOne(query, { $set: recipeListQuery }, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log("Successfully UPdated Document!");
      resolve();
    });
  });
};
// -deleteOne() document (DELETE - D from CRUD)
const deleteOne = function (query) {
  return new Promise((resolve, reject) => {
    recipeName.deleteOne(query, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log("Successfully Deleted Document!");
      resolve();
    });
  });
};

// TODO: module.exports = { connect, ... }
module.exports = { connect, insertOne, findAll, updateOne, deleteOne, findOne };

// Tests
// (async () => {
//   await connect();

//   // // Test insertOne
//   // const recipes = {
//   //   id: "3",
//   //   title: "Turkey Sub",
//   //   category: "Lunch",
//   // };
//   // await insertOne(recipes);

//   // Test findAll
//   // const recipe = await findAll();
//   // console.log(recipe);

//   // Test updateOne
//   // const recipeListQuery = {
//   //   _id: new ObjectId("5f5e6d8af00258134dbc8617"),
//   // };
//   // const recipeList = {
//   //   id: "15",
//   //   title: "Hot Chocolate",
//   // };
//   // await updateOne(recipeListQuery, recipeList);

//   // Test deleteOne
//   const recipeListQuery = {
//     _id: new ObjectId("5f5fb56ac775551b9ef7ef3f"),
//   };
//   await deleteOne(recipeListQuery);

//   console.log("END");
//   process.exit(0);
// })();
