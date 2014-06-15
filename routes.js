var step = require('step');
var mongodb = require('mongodb');
var validator = require('validator')

	module.exports = function (app, passport) {

	app.get('/', function (req, res) {

		res.redirect('/login');

	});

	app.post('/GetScripts', function (req, res) {

		var sortExpr = {
			author : -1
		};
		var sortParam = req.query.jtSorting;

		switch (sortParam) {
		case "note ASC":
			sortExpr = {
				note : 1
			};
			break;
		case "note DESC":
			sortExpr = {
				note : -1
			};
			break;
		case "author ASC":
			sortExpr = {
				author : 1
			};
			break;
		case "author DESC":
			sortExpr = {
				author : -1
			};
			break;
		case "title ASC":
			sortExpr = {
				title : 1
			};
			break;
		case "title DESC":
			sortExpr = {
				title : -1
			};
			break;
		default:
			sortExpr = {
				title : 1
			};
		}

		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var client = new mongodb.Db('find-script', server, {
				w : 1
			});

		
		client.open(function () {
			client.collection("scripts", function (err, collection) {

				var filteredNote = {};
				var filteredTitle = {};
				var filteredAuthor = {};

				if ((typeof req.body.note != "undefined") && (req.body.note != "")) {
					filteredNote = {
						note : { $regex: req.body.note, "$options": "i"  }
					};
				}

				if ((typeof req.body.title != "undefined") && (req.body.title != "")) {
					filteredTitle = {
						title : { $regex: req.body.title, "$options": "i"  }
					};
				}

				if ((typeof req.body.author != "undefined") && (req.body.author != "")) {
					filteredAuthor = {
						author : { $regex: req.body.author, "$options": "i" }
					};
				}

				var totalRecNum = 0;
				collection.find().toArray(function (err, results) {
					totalRecNum = results.length;

					collection.find({
						$and: [  filteredAuthor , filteredTitle, filteredNote ] 
						//$and   : [filteredAuthor, filteredNote, filteredTitle]
						//author: /filteredAuthor/
						
						//find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )
						
					}).sort(sortExpr).skip(parseInt(req.query.jtStartIndex, 10)).limit(parseInt(req.query.jtPageSize, 10)).toArray(function (err, results) {
						if (err)
							throw err;

						var data = {
							'Result' : 'OK',
							'Records' : results,
							'TotalRecordCount' : totalRecNum
						};

						res.writeHead(200, {
							"Content-Type" : "application/json"
						});
						var json = JSON.stringify(data);
						res.end(json);
					});

				});
				
			});
		});

	});

	app.post('/insertScript', function (req, res) {
		
		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var client = new mongodb.Db('find-script', server, {
				w : 1
			});

		
		var data = {
			'title' : validator.escape(req.body.title),
			'author' : validator.escape(req.body.author),
			'note' : validator.escape(req.body.note)
		};

		if (!validator.isLength(data.title, 1, 50)) {

			var retData = {
				'Message' : "Title is mandatory, 50 chars max!"
			};

			res.writeHead(200, {
				"Content-Type" : "application/json"
			});
			var json = JSON.stringify(retData);
			res.end(json);
			return;
		}

		if (!validator.isLength(data.author, 0, 50)) {

			var retData = {
				'Message' : "Author is 50 chars max!"
			};

			res.writeHead(200, {
				"Content-Type" : "application/json"
			});
			var json = JSON.stringify(retData);
			res.end(json);
			return;
		}

		if (!validator.isLength(data.note, 0, 100)) {

			var retData = {
				'Message' : "Note is 100 chars max!"
			};

			res.writeHead(200, {
				"Content-Type" : "application/json"
			});
			var json = JSON.stringify(retData);
			res.end(json);
			return;
		}

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
			'Record' : {
				'title' : data.title,
				'author' : data.author,
				'note' : data.note
			}
		};

		res.writeHead(200, {
			"Content-Type" : "application/json"
		});
		var json = JSON.stringify(retData);
		res.end(json);

	});

	app.post('/updateScript', function (req, res) {

		// ako u neko polje pošaljem '<script>alert("ds")</script>' onda mi se svejedno izvrši
		// unatoè sanitizaciji, za razliku od update-a, neznam zašto

		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var client = new mongodb.Db('find-script', server, {
				w : 1
			});

		var data = {
			'title' : validator.escape(req.body.title),
			'author' : validator.escape(req.body.author),
			'note' : validator.escape(req.body.note)
		};

		if (!validator.isLength(data.title, 1, 50)) {

			var retData = {
				'Message' : "Title is mandatory, 50 chars max!"
			};

			res.writeHead(200, {
				"Content-Type" : "application/json"
			});
			var json = JSON.stringify(retData);
			res.end(json);
			return;
		}

		if (!validator.isLength(data.author, 0, 50)) {

			var retData = {
				'Message' : "Author is 50 chars max!"
			};

			res.writeHead(200, {
				"Content-Type" : "application/json"
			});
			var json = JSON.stringify(retData);
			res.end(json);
			return;
		}

		if (!validator.isLength(data.note, 0, 100)) {

			var retData = {
				'Message' : "Note is 100 chars max!"
			};

			res.writeHead(200, {
				"Content-Type" : "application/json"
			});
			var json = JSON.stringify(retData);
			res.end(json);
			return;
		}

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

		res.writeHead(200, {
			"Content-Type" : "application/json"
		});
		var json = JSON.stringify(retData);
		res.end(json);

	});

	app.post('/deleteScript', function (req, res) {

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

		res.writeHead(200, {
			"Content-Type" : "application/json"
		});
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
			if (err)
				throw err;
			client.collection("scripts", this);
			
		},
			function getAllDocumentsFromCollection(err, collection) {
			if (err)
				throw err;
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

	app.get('/insertScript', function (req, res) {
		res.render('insert.jade', {
			layout : false,
			'title' : 'Monode-crud'
		});
	})

	app.post('/insertScript', function (req, res) {

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

	app.get('/updateScript/:id', function (req, res) {

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

	app.post('/updateScript', function (req, res) {

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

	app.get('/deleteScript/:id', function (req, res) {

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

	app.get('*', function (req, res) {
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
