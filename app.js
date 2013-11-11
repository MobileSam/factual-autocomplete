
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , Factual = require('factual-api')
  , _ = require('underscore');

var app = express()
  , factual = new Factual('YOUR_KEY', 'YOUR_SECRET');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  res.render('index', { title: 'Express' });
});

app.get('/autocomplete/:query', function(req, res) {
  var query = req.params.query
    , filters = { "name": { "$bw": query} }
    , geo = { "$circle": { "$center": [req.query.lat, req.query.lng], "$meters": 20000 } };

  factual.get('/t/places', { filters: filters, geo: geo }, function (err, places) {
    if (err) {
      res.json(500, err);
      return;
    }

    var results = []
      , distance;

    _.each(places.data, function(item) {
      distance = item['$distance'];

      if (distance < 1000) {
        distance = Math.round(distance) + 'm';
      } else {
        distance = (Math.round(distance / 100) / 10) + 'km';
      }

      results.push({
        id: item.factual_id
      , name: item.name
      , address: item.address
      , latitude: item.latitude
      , longitude: item.longitude
      , distance: distance
      });
    });

    res.json(results);
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
