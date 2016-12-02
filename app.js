(function(){
	var port = process.env.PORT || 3000;
	var app = require('express')();
	var bodyParser = require('body-parser');
	var shortId = require('shortid');
	
	//parse application/json
	app.use(bodyParser.json());
	
	//temp memory storage of users accounts
	var accounts = [ { login: 'Max', pwd: '123', email: 'max@test.com', playerId: 'eWRhpRV' } ];
	
	// -------- Routes --------
	app.get('/', function(req, res){
		res.send('Nothing here');
	})
	
	app.post('/login', function(req, res){
		var login = req.body.login;
		var pwd = req.body.pwd;
		var resContent = {};
		
		var player = null;
		accounts.forEach(function(a){
			if (a.login == login && a.pwd == pwd)
				player = a;
		})
		
		if (player){
			console.log('Login request for ' + login + ' - ' + pwd + ' succeeded');
			resContent.result = 'OK';
			resContent.playerId = player.playerId;
			resContent.playerName = player.login;
		}
		else {
			console.log('Login request for ' + login + ' - ' + pwd + 'failed');
			resContent.result = 'NOK';
			resContent.reason = 'Incorrect credentials';
		}
		res.json(resContent);
	})
	
	app.get('/username', function(req, res){
		var result = {};
		result.names = [];
		
		console.log('Usernames requested');
		
		accounts.forEach(function(a){
			result.names.push(a.login);
		});
		
		res.json(result);
	})
	
	app.post('/signup', function(req, res){		
		var login = req.body.login;
		var pwd = req.body.pwd;
		var email = req.body.email;
		var playerId = shortId.generate();
		
		console.log('Signup: ' + login + ', ' + pwd + ', ' + email + ', ' + playerId);
		
		accounts.push({ 
			login: login, 
			pwd: pwd, 
			email: email, 
			playerId: playerId 
		});
		
		res.json({ login: login, playerId: playerId });
	})
	
	app.listen(port, function(){
		console.log('express started');
	})
})()