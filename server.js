const fs = require('fs'); 
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use('/static', express.static('ocd_static'));

app.get('/', function (req, res) {
   res.send('Hello World');
})

// /app/control/
app.get('/aha/*', (req, res) => {
    console.log(req.baseUrl + ' | ' + req.url);
    res.send(req.url);
});

app.put('/ocd/*', (req, res, next) => {
    fs.writeFile('ocd_dynamic/samraj.json', JSON.stringify(req.body), (err) => {
	err && console.log('Error ' + err);
    });
    res.send('OK');
});

app.get('/ocd/*', (req, res) => {
    console.log(req.path);
    res.header("Content-Type", "application/json");
    res.send(fs.readFileSync('ocd_dynamic/samraj.json'));
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
});


function readJsonFile(name) {
    return fs.readFileSync(name);
}
