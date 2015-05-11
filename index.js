var express = require('express');
var app = express();
var urban = require('urban');
var bodyParser = require('body-parser')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send("Slack Slash home page");
});

app.post('/urban', function(request, response) {
	var word = urban(request.body.text);

	word.first(function(json) {
	    response.send(json.definition);
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
