(function(){
	var port = process.env.PORT || 3000;
	var app = require('express')();
	var bodyParser = require('body-parser');
	app.use(bodyParser.json());
	
	app.get('/', function(req, res){
		res.send('Nothing here');
	})
	
	app.post('/login', function(req, res){
		var login = req.body.login;
		var pwd = req.body.pwd;
		
		if (login === "Max" && pwd === "123")
			res.send('OK');
		else
			res.send('Error');
	})
	
	app.listen(port, function(){
		console.log('express started');
	})
})()