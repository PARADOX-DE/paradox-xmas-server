import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';

import auth from './routes/auth';
import present from './routes/present';
import https from 'https'
import fs from 'fs'

const app = express();

app.use(cors());
app.use(bodyparser.json()); 
app.use(bodyparser.urlencoded({ extended: false })); 

app.use("/v1/auth", auth);
app.use("/v1/present", present);

var privateKey = fs.readFileSync('/etc/ssl/key.pem');
var certificate = fs.readFileSync('/etc/ssl/cert.pem');

var options = {
  key: privateKey,
  cert: certificate,

  requestCert: false,
  rejectUnauthorized: false
};

https.createServer(options, app).listen(8443, () => {
  console.log("[API] Ready.")
});