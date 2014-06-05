var step = require('step');
var mongodb = require('mongodb');

module.exports = function (app, passport) {

	app.get('/', function (req, res) {

		res.redirect('/login');

	});
	
	
	app.post('/test', function (req, res) {

		//console.log(req.body);
		//console.log(req.query.jtSorting);
		
		//console.log(req.query.jtSorting);
		
		var sortExpr = {author: -1};	
		var sortParam = req.query.jtSorting;
		
		switch (sortParam) {
			  case "note ASC":
				sortExpr = {note: 1};
				break;
			  case "note DESC":
				sortExpr = {note: -1};
				break;
			  case "author ASC":
				sortExpr = {author: 1};
				break;
			  case "author DESC":
				sortExpr = {author: -1};
				break;
			  case "title ASC":
				sortExpr = {title: 1};
				break;
			  case "title DESC":
				sortExpr = {title: -1};
				break;
			  default:
				sortExpr = {title: 1};
			}
		
		
		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var client = new mongodb.Db('find-script', server, {
				w : 1
			});

		step(
			function openDBConection() {
			client.open(this);
		},
			function getDBCollection(err) {
			client.collection("scripts", this);
		},
			function getAllDocumentsFromCollection(err, collection) {
			/*
			switch (sortParam) {
			  case "note ASC":
				collection.find().sort({'note':1}).skip(parseInt(req.query.jtStartIndex, 10)).limit(parseInt(req.query.jtPageSize, 10)).toArray(this);
				break;
			  case "note DESC":
				collection.find().sort({'note':-1}).skip(parseInt(req.query.jtStartIndex, 10)).limit(parseInt(req.query.jtPageSize, 10)).toArray(this);
				break;
			  case "author ASC":
				collection.find().sort({'author':1}).skip(parseInt(req.query.jtStartIndex, 10)).limit(parseInt(req.query.jtPageSize, 10)).toArray(this);
				break;
			  case "author DESC":
				collection.find().sort({'author':-1}).skip(parseInt(req.query.jtStartIndex, 10)).limit(parseInt(req.query.jtPageSize, 10)).toArray(this);
				break;
			  case "title ASC":
				collection.find().sort({'title':1}).skip(parseInt(req.query.jtStartIndex, 10)).limit(parseInt(req.query.jtPageSize, 10)).toArray(this);
				break;
			  case "title DESC":
				collection.find().sort({'title':-1}).skip(parseInt(req.query.jtStartIndex, 10)).limit(parseInt(req.query.jtPageSize, 10)).toArray(this);
				break;
			  default:
				collection.find().sort({'author':1}).skip(parseInt(req.query.jtStartIndex, 10)).limit(parseInt(req.query.jtPageSize, 10)).toArray(this);
			}
			*/
			/*
			var filterNoteWord = req.body.note;
			var filterQuery = { note: filterNoteWord }
			console.log(filterQuery)
			*/
			
			var filteredNote = {};
			var filteredTitle = {};
			var filteredAuthor = {};
			
			if((typeof req.body.note != "undefined") && (req.body.note != "")){
				filteredNote = { note: req.body.note };
			}
			
			if((typeof req.body.title != "undefined") && (req.body.title != "")){
				filteredTitle = { title: req.body.title };
			}
			
			if((typeof req.body.author != "undefined") && (req.body.author != "")){
				filteredAuthor = { author: req.body.author };
			}

			console.log({ $or: [ filteredAuthor, filteredNote, filteredTitle]});
			
			
			collection.find( { $and: [ filteredAuthor, filteredNote, filteredTitle]} ).sort(sortExpr).skip(parseInt(req.query.jtStartIndex, 10)).limit(parseInt(req.query.jtPageSize, 10)).toArray(this);
			//{ $or: [ { author: 'fafa'}, {note: 'ridikul' }]}
			
			
		},
			function displayAllScripts(err, results) {
			if (err)
				throw err;
			
			
			var data = {
				'Result' : 'OK',
				'Records': results,
				'TotalRecordCount': results.length
			};  
			  
			
		    res.writeHead(200, {"Content-Type": "application/json"});
		    var json = JSON.stringify(data);
		    res.end(json);
		});

	});
	
	app.post('/insert_test', function (req, res) {
		//console.log(req);
	
	
		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var client = new mongodb.Db('find-script', server, {
				w : 1
			});
		
		//var bla = JSON.parse(req.body);
		/*
		var data = {
			'Result' : 'OK',
			'Record': {
				'title' : req.body.title,
				'author' : req.body.author,
				'note' : req.body.note
		}};  
		*/
		
		var data = {
			'title' : req.body.title,
			'author' : req.body.author,
			'note' : req.body.note
		};
		
		step(

			function openDBConection() {
			client.open(this);
		},
			function (err) {
			client.collection('scripts', this);
		},
			function (err, collection) {
			if (err)
				throw err;

			collection.insert(data);
		});
		
		
		
		var retData = {
			'Result' : 'OK',
			'Record': {
				'title' : data.title,
				'author' : data.author,
				'note' : data.note
		}};  
		  
		
		
		res.writeHead(200, {"Content-Type": "application/json"});
		var json = JSON.stringify(retData);
		res.end(json);
		
		
		
		
		//res.redirect('/list');
	});
	
	
	
	app.post('/update_test', function (req, res) {

	
		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var client = new mongodb.Db('find-script', server, {
				w : 1
			});

		step(

			function () {
			client.open(this);
		},
			function (err) {
			client.collection('scripts', this);
		},
			function (err, collection) {
			var ObjectID = mongodb.ObjectID;
			var chosenId = new ObjectID(req.body._id);
			var data = {
				'title' : req.body.title,
				'author' : req.body.author,
				'note' : req.body.note
			};

			collection.update({
				_id : chosenId
			}, {
				$set : data
			}, {
				safe : true
			},
				this);
		},
			function (err) {
			if (err)
				throw err;
		});

		var retData = {
			'Result' : 'OK'
			};  
		  
		
		
		res.writeHead(200, {"Content-Type": "application/json"});
		var json = JSON.stringify(retData);
		res.end(json);
		
		
		

	});

	
	
	app.post('/delete_test', function (req, res) {

		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var client = new mongodb.Db('find-script', server, {
				w : 1
			});

		var ObjectID = mongodb.ObjectID;
		var chosenId = new ObjectID(req.body._id);

		step(
			function openConection() {
			client.open(this);
		},
			function (err) {
			client.collection("scripts", this);
		},
			function (err, collection) {
			collection.remove({
				_id : chosenId
			}, {
				safe : true
			}, this);
		},
			function (err) {
			if (err)
				throw err;
		});

		var retData = {
			'Result' : 'OK'
			};  
		  
		
		
		res.writeHead(200, {"Content-Type": "application/json"});
		var json = JSON.stringify(retData);
		res.end(json);
		
		

	});
	
	
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/list', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.get('/login', function (req, res) {

		res.render('login.ejs', {
			message : req.flash('loginMessage')
		});

	});

	app.get('/list', isLoggedIn, function (req, res) {

		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var client = new mongodb.Db('find-script', server, {
				w : 1
			});

		step(
			function openDBConection() {
			client.open(this);
		},
			function getDBCollection(err) {
			client.collection("scripts", this);
		},
			function getAllDocumentsFromCollection(err, collection) {
			collection.find().toArray(this);
		},
			function displayAllScripts(err, results) {
			if (err)
				throw err;
			res.render('list.ejs', {
				layout : false,
				'title' : 'find-script',
				'scripts' : results
			});
		});

	});

	app.get('/insert_record', function (req, res) {
		res.render('insert.jade', {
			layout : false,
			'title' : 'Monode-crud'
		});
	})

	app.post('/insert_record', function (req, res) {

		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var client = new mongodb.Db('find-script', server, {
				w : 1
			});

		var data = {
			'title' : req.body.title,
			'author' : req.body.author,
			'note' : req.body.author
		};

		step(

			function openDBConection() {
			client.open(this);
		},
			function (err) {
			client.collection('scripts', this);
		},
			function (err, collection) {
			if (err)
				throw err;

			collection.insert(data);
		});
		res.redirect('/script-list');
	});

	app.get('/update_record/:id', function (req, res) {

		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var client = new mongodb.Db('find-script', server, {
				w : 1
			});

		var ObjectID = mongodb.ObjectID;

		step(

			function () {
			client.open(this);
		},
			function (err) {
			client.collection('scripts', this);
		},
			function (err, collection) {
			var chosenId = new ObjectID(req.params.id);
			collection.findOne({
				'_id' : chosenId
			}, this);
		},
			function (err, results) {
			res.render('update.jade', {
				layout : false,
				'title' : 'Monode-crud',
				'results' : results
			});
		});

	});

	app.post('/update_record', function (req, res) {

		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var client = new mongodb.Db('find-script', server, {
				w : 1
			});

		step(

			function () {
			client.open(this);
		},
			function (err) {
			client.collection('scripts', this);
		},
			function (err, collection) {
			var ObjectID = mongodb.ObjectID;
			var chosenId = new ObjectID(req.body.id);
			var data = {
				'title' : req.body.title,
				'author' : req.body.author,
				'note' : req.body.note
			};

			collection.update({
				_id : chosenId
			}, {
				$set : data
			}, {
				safe : true
			},
				this);
		},
			function (err) {
			if (err)
				throw err;
		});

		res.redirect('/script-list');

	});

	app.get('/delete_record/:id', function (req, res) {

		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var client = new mongodb.Db('find-script', server, {
				w : 1
			});

		var ObjectID = mongodb.ObjectID;
		var chosenId = new ObjectID(req.params.id);

		step(
			function openConection() {
			client.open(this);
		},
			function (err) {
			client.collection("scripts", this);
		},
			function (err, collection) {
			collection.remove({
				_id : chosenId
			}, {
				safe : true
			}, this);
		},
			function (err) {
			if (err)
				throw err;
		});

		res.redirect('/script-list');

	});
	
	app.get('*', function(req, res){
		
		res.render('404.ejs', {});
	});
	
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
