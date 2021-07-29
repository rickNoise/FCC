// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
require('dotenv').config();
const mongoose = require('mongoose');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

/**/
/* above here is boilerplate */
/* below here is project code */
/**/

mongoose.connect(
  process.env.MONGO_URI, 
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

// allow access to files in the /public folder
app.use("/public", express.static(__dirname + "/public"));

// print requests to the console
app.use((req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

// not sure? Copied over from exercise Replit
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// your first API endpoint... (this was here on the boilerplate)
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// deal with requests to /api/:date?
app.get("/api/:date", (req, res) => {
  // raw user input string
  const rawDateInput = req.params.date;

  // regex to match unix timestamp input
  const timeStampRegex = /^\d+$/;

  // function to return required JSON output based on input
  const resultGen = (rawDateInput) => {
    // case for unix timestamp input
    if (timeStampRegex.test(rawDateInput)) {
      const unixTime = parseInt(rawDateInput);
      const utcTime = (new Date(unixTime)).toUTCString();
      return { "unix": unixTime, "utc": utcTime };
    // case for any other acceptable Date input
    } else if (Date.parse(rawDateInput)) {
      const unixTime = Date.parse(rawDateInput);
      const utcTime = (new Date(unixTime)).toUTCString();
      return { "unix": unixTime, "utc": utcTime };
    // case for non-acceptable date input
    } else {
      return { "error": "Invalid Date" };
    }
  };

  // attach desired JSON result to the server response
  res.json(resultGen(rawDateInput));
});

// deal with a request similar to above but with empty date param: `/api/`
app. get("/api", (req, res) => {
  // case for empty input
  res.json({ 
    "unix": Date.parse(new Date()), 
    "utc":  (new Date()).toUTCString() 
  });
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
