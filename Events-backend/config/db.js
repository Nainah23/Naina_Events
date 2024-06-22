const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
});

let _db;

async function connectDB() {
  try {
    await client.connect();
    _db = client.db('events'); // Specify your database name if different from the default

    console.log("Yoooh!! Tuko Ndaani!!");

    // Optionally, send a ping to confirm successful connection
    await _db.command({ ping: 1 });

  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
}

function getDB() {
  if (!_db) {
    throw new Error('Database not connected!');
  }
  return _db;
}

module.exports = { connectDB, getDB };
