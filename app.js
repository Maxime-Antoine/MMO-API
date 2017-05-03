'use strict';

const port = process.env.PORT || 3000;
const app = require('express')();
const bodyParser = require('body-parser');
const shortId = require('shortid');
const UserRepository = require('./Account/UserRepository');
const userRepository = new UserRepository();
const User = require('./Account/User');

//parse application/json
app.use(bodyParser.json());

app.listen(port, function(){
    console.log(`express started on port ${port}`);
});

// -------- Routes --------
app.get('/', function(req, res){
    res.send('Nothing here');
});

app.post('/login', function(req, res){
    var login = req.body.login;
    var pwd = req.body.pwd;
    var resContent = {};

    if (!login || !pwd) {
        resContent.error = 'Both login and pwd are required';
        return res.json(resContent);
    }
    else
        userRepository.findByUsername(login, (err, user) => {
            if (err || !user || !user.checkPassword(pwd)){
                console.log('Login request for ' + login + ' - ' + pwd + ' failed');
                
                resContent.result = 'NOK';
                resContent.reason = 'Incorrect credentials';
            } else {
                user.login();
                userRepository.update(user, (err) => { console.log('Cannot update user (for lastLoginDate)'); });

                console.log('Login request for ' + login + ' - ' + pwd + ' succeeded');

                resContent.result = 'OK';
                resContent.playerId = user.id;
                resContent.playerName = user.login;
            }

            res.json(resContent);
        });
});

app.get('/username', function(req, res){
    console.log('Usernames requested');

    userRepository.all((err, data) => {
        var result = {};
        result.names = [];

        if (data){
            data.forEach(function(a){
                result.names.push(a.username);
            });
        }

        res.json(result);
    });
});

app.post('/signup', function(req, res){
    var login = req.body.login;
    var pwd = req.body.pwd;
    var email = req.body.email;

    var user = User.create(login, pwd, email);

    console.log('Signup: ' + login + ', ' + pwd + ', ' + email + ', ' + user.id);

    userRepository.create(user, (err) => {
        if (err)
            return res.json('Cannot create user');

        res.json({ login: login, playerId: user.characterId });
    });
});
