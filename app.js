(function(){
	var port = process.env.PORT || 3000;
	var app = require('express')();
	var bodyParser = require('body-parser');
	
	//parse application/json
	app.use(bodyParser.json());
	
	app.get('/', function(req, res){
		res.send('Nothing here');
	})
	
	app.post('/login', function(req, res){
		var login = req.body.login;
		var pwd = req.body.pwd;
		var resContent = {};
		
		console.log('Login request for ' + login + ' - ' + pwd);
		
		if (login === "Max" && pwd === "123"){
			resContent.result = 'OK';
			resContent.playerId = 'eWRhpRV';
		}
		else {
			resContent.result = 'NOK';
			resContent.reason = 'Incorrect credentials';
		}
		res.json(resContent);
	})
	
	app.listen(port, function(){
		console.log('express started');
	})
})()