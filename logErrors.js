var MongoDB = require('winston-mongodb').MongoDB;
var winston = require('winston');

var logger = new (winston.Logger)({
transports: [
    new(winston.transports.MongoDB)({
            db : 'logs',
            host : 'localhost',
			collection: 'erorrs', 
			port: '27017'
        })
]
});



module.exports = function (err, req, res, next) {


	//console.log("#################################################################");
	//console.log(err.stack);
	
    logger.error(err.stack);
	res.send(500, 'Server error!');

};