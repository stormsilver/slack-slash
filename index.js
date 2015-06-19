var express = require('express');
var app = express();
var urban = require('urban');
var bodyParser = require('body-parser');
var request = require('request')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send("Slack Slash home page");
});

app.post('/urban', function(req, res) {
	var word = urban('inboob');

    word.first(function(json) {
        var payload = [
            'Definitiion: ' + json.definition,
            'Example: ' + json.example,
            'Link: <' + json.permalink + '>'
        ];

        var channel = req.body.channel_name === 'directmessage' ?
            req.body.channel_id : '#' + req.body.channel_name;

        payload = {
            channel: channel,
            text: payload.join("\n")
        };

        request.post({
            url: 'https://hooks.slack.com/services/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',
            form: { payload: JSON.stringify(payload) }
            }, function (err, resp, body) {
            if (err) {
              return res.status(500).send({ success: false, error: err.message });
            }

            res.end();
        });
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
