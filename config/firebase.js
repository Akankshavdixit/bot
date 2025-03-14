const admin = require("firebase-admin");
const fs = require("fs");
const {config} = require('dotenv');
config()

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;

if (!serviceAccountPath) {
    throw new Error("Firebase service account file path not set.");
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGEBUCKET, 
});

const bucket = admin.storage().bucket();

module.exports = bucket;
