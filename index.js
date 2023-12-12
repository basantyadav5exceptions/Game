const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require('./routes/router');
const app = express();
const env = require("node-env-file");
env(".env");

// Global URLS

global.base_url = "http://182.70.252.166:5000/";
global.files_url = base_url + "images/";

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

//files url
app.use(express.static(path.join(__dirname, "files")));


app.use('/api', indexRouter);


// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});
app.listen(3000, () => console.log('Server is running on port 3000'));
