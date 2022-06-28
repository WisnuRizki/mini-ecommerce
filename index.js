require('dotenv').config();
const express = require('express')
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
const router = require('./routers')

app.use('/', router)

console.log('app listen on port ' + port)

app.listen(port);
  