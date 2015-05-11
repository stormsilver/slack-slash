var express = require('express');
var app = express();
var urban = require('urban');
var bodyParser = require('body-parser');
var requestify = require('requestify');

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
		var payload = [
			'Definitiion: ' + json.definition,
			'Example: ' + json.example,
			'Link: <' + json.permalink + '>'
		];
		
	    requestify.post('https://hooks.slack.com/services/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', {
	        text: payload.join("\n"),
	        username: 'Urban Bot',
	        icon_emoji: ':lol:',
	        channel: request.body.channel_name
	    });
	    response.send('');
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
