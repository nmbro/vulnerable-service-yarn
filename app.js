const express = require('express');
const dust = require('dustjs-linkedin');
const helpers = require('dustjs-helpers');
const fs = require('fs');

const app = express();
const port = 3000;

app.get('/', renderTemplate);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function renderTemplate(req, res) {
  var src = fs.readFileSync('./templates/main.dust', 'utf8');
  var compiled = dust.compile(src, 'hello');
  dust.loadSource(compiled);
  dust.render('hello', { device: req.query.device }, function(err, out) {
    // `out` contains the rendered output.
    console.log(out);
    res.send(out);
  });
}
