var express = require('express');
var app = express();

app.use(express.static(__dirname));

var port = process.env.PORT || 3000;

console.log('Serving "' + __dirname + '" at port ' + port);

app.listen(port);
