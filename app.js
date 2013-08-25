
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3306);
// app.set('ip', process.env.IP || '127.0.0.1');
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('Greybeard'));
app.use(express.session());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  app.set('port', 8080);
}


/**
 * Routes
 */

// serve index and view partials
app.get('/login', routes.login);
app.post('/login', routes.authenticate);
app.get('/logout', routes.logout);

app.post('/recover', routes.sendRecoveryEmail);

app.get('*', routes.authenticate);

app.get('/user', routes.getUser);

app.get('/', routes.index);


app.get('/partials/task/:taskId', routes.taskPartials);
app.get('/partials/*', routes.partials);

app.get('/csv/:tool', routes.csv);

app.get('/api/:tool', routes.getApi);
app.get('/api/:tool/:id', routes.getApi);
app.post('/api/:tool', routes.postApi);
app.post('/api/:tool/:id', routes.postApi);
app.put('/api/:tool', routes.putApi);
app.delete('/api/:tool/:id', routes.deleteApi);


// JSON API
// app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */


http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
