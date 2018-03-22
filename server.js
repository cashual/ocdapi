const fs = require('fs'); 
const express = require('express');
const bodyParser = require('body-parser');
const sp = require('./status_processor');

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

app.get('/control/:app/:ctrl', (req, res) => {
    const appId = req.params.app;
    const ctrl = req.params.ctrl;
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(sp.getControlInfo(appId, ctrl)));
});

app.get('/reds/:app', (req, res) => {
    const appId = req.params.app;
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(sp.getReds(appId)));
});

app.put('/control/:app/:ctrl', (req, res) => {
    const appId = req.params.app;
    const ctrl = req.params.ctrl;
    const info = req.body;
    sp.updateControl({ ...info, applicationId: appId, controlId: ctrl});
    res.header("Content-Type", "application/json");
    res.send(sp.getControlInfo(appId, ctrl));
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
});


function readJsonFile(name) {
    return fs.readFileSync(name);
}
