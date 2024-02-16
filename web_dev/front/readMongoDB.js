const mongoose = require("mongoose");
const temphumlogs = require("./models/readings");

// Connection URL
const url = 'mongodb://localhost:27017/TempLogs';

// Database Name
const dbName = 'yourDatabaseName';

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

// Use connect method to connect to the server
client.connect(function(err) {
  if (err) {
    console.error('An error occurred connecting to MongoDB: ', err);
    return;
  }
  console.log('Connected successfully to server');

  const db = client.db(dbName);

  // Get the documents collection
  const collection = db.collection('yourCollectionName');
  
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    if (err) {
      console.error('An error occurred fetching data: ', err);
      return;
    }
    console.log('Found the following records');
    console.log(docs);
  });

  client.close();
});