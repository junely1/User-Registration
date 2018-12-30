
var express = require('express');
var cors = require('cors');
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 3000;
//var database = require('db/db');
var cors = require('cors')
var jwt = require('jsonwebtoken');
var token;
//users.use(cors());
process.env.SECRET_KEY = "";  //insert secret key
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

var users = express.Router();
var mysql = require('mysql');


var con = mysql.createConnection({  //change accordingly
  host: "localhost",
  user: "root",
  password: "",
  database: "userLog"
});

con.connect(function(err) {
  if (err) throw err;

  con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});


users.post('/register', function(req, res) {

    var today = new Date();
    var appData = {
        "error": 1,
        "data": ""
    };
    var userData = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "password": req.body.password,
        "created": today
    }


    con.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {


            con.query('INSERT INTO users SET ?', userData, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "User registered successfully!";
                    res.status(201).json(appData);
                } else {
                    appData["data"] = "Error Occured!";
                    res.status(400).json(appData);
                }
            });
            con.release();
        }
    });
});
