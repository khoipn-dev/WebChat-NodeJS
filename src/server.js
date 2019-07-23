var express = require('express');
var app = express();

var hostname = 'localhost';
var port = 3000;

app.get('/helloword', function (req, res) {
  res.send(`Hello World !!!`)
});

app.listen(port, hostname, () => console.log(`Server running on port: ${port}`));