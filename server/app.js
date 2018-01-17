require('babel-register')({ ignore: /\/(build|node_modules)\//, presets: ['react-app'] });

const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');


const crypto = require('crypto');

const app = express();

app.set('json spaces', 2);

// Support Gzip
app.use(compression())

// Suport post requests with body data (doesn't support multipart, use multer)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors());


// Setup logger
app.use(morgan('combined'))


// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')))

const api = require('./routes/api')
app.use('/api', api)






module.exports = app