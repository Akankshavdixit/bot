const admin = require("firebase-admin");
const fs = require("fs");
const {config} = require('dotenv');
config()



admin.initializeApp({
    credential: admin.credential.cert({
        type:process.env.TYPE,
        project_id:process.env.PROJECTID ,
        private_key_id:process.env.PRIVATEKEYID ,
        private_key:process.env.PRIVATEKEY.replace(/\\n/g, '\n'),
        client_email:process.env.CLIENTEMAIL,
        client_id:process.env.CLIENTID,
        auth_uri:process.env.AUTHURI,
        token_uri:process.env.TOKENURI,
        auth_provider_x509_cert_url:process.env.AUTHPROVIDERCERTURL,
        client_x509_cert_url:process.env.CLIENTCERTURL,
        universe_domain:process.env.UNIVERSEDOMAIN
        
    }),
    storageBucket: process.env.STORAGEBUCKET, 
});

const bucket = admin.storage().bucket();

module.exports = bucket;
