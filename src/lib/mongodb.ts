import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in your .env.local file");
}

// Global is used here to persist the MongoClient across hot reloads in development
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In dev, use a global variable so the client is reused across reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In prod, no need to store it on global
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
