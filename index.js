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
	var word = urban(req.body.text);

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

app.post('/fmsversion', function(req, res) {
    request.get({
        url: 'https://jenkins.rnl.io/job/FMS/view/FMS%20Production/job/fms-production/api/json',
        auth: {
                user: process.env.JENKINS_USER,
                pass: process.env.JENKINS_API_KEY
            }
        }, function (err, resp, body) {
            var jsonBody = JSON.parse(body);
            var latestSuccessfulBuild = jsonBody.lastSuccessfulBuild;
            request.get({
                url: latestSuccessfulBuild.url + 'api/json',
                auth: {
                        user: process.env.JENKINS_USER,
                        pass: process.env.JENKINS_API_KEY
                    }
                }, function (err, resp, body) {
                    var jsonBody = JSON.parse(body);
                    var parameters = jsonBody.actions[0].parameters;
                    var channel = req.body.channel_name === 'directmessage' ?
                        req.body.channel_id : '#' + req.body.channel_name;

                    payload = {
                        channel: channel,
                        text: "Branch: " + parameters[0].value
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
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
