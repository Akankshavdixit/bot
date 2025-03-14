const admin = require("firebase-admin");
const { config } = require("dotenv");
config();

const serviceAccount = require("../config/firebaseServiceAccountKey.json"); 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGEBUCKET, 
});

const bucket = admin.storage().bucket();

module.exports = bucket;
