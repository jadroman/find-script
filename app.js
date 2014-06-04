var flash = require('connect-flash');
var express = require('express');
var passport = require('passport');
var app = express();
var http = require('http');
var mongoose = require('mongoose');
var ejs = require('ejs');
var logError = require('./logErrors.js');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);




app.configure(function () {
	app.set('port', process.env.PORT || 3000);

	app.use(express.favicon());
	app.use(express.cookieParser());
	app.use(express.bodyParser({ keepExtensions: true }));
	
	app.use(badMiddleware)
	
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(app.router);
	
	app.use("/css", express.static(__dirname + '/css'));
	app.use("/img", express.static(__dirname + '/img'));
	app.use("/fonts", express.static(__dirname + '/fonts'));
	app.use("/js", express.static(__dirname + '/js'));
	//app.use("/js/jquery-ui/js", express.static(__dirname + '/js/jquery-ui/js'));

	
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	
	app.use(logError)
		
	app.locals.pretty = true;
});


require('./config/passport')(passport); // pass passport for configuration

require('./routes.js')(app, passport);

http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});



function badMiddleware(req, res, next) {
	
  next(new Error('Bad middleware makes error'));
}
/*
function logError(err, req, res, next) {
  
	console.log("#################################################################");
	res.send(500, 'Something broke!');
  
}
*/
