'use strict';

const firebaseCertificate = require('../MMOF-0179c0b56559');
const User = require('../Account/User');

class UserRepository {
    constructor(){
        const firebase = require('firebase-admin');

        firebase.initializeApp({
            databaseURL: 'https://mmof-f9dec.firebaseio.com',
            credential: firebase.credential.cert(firebaseCertificate)
        });

        this.db = firebase.database();
    }

    all(callback){
        this.db.ref('users')
               .once('value', (snap) => {
                   let users = createUsersFromDb(snap.val());
                   callback(null, users);
               });
    }

    findByUsername(username, callback){
        this.db.ref(`users/${username}`)
               .once('value', (snap) => {
                   let data = snap.val();
                   if (data){
                       let user = createUserFromDb(username, data[username])
                       callback(null, user);
                    } else
                        callback(null, null);
               });
    }

    createOrUpdate(user, callback){
        this.findByUsername(user.username, (err, data) => {
            if (err || data){
                if (callback)
                    callback('An user already exists with this username');
            }
            else {
                this.db.ref(`users/${user.username}`)
                       .set({
                           password: user.password,
                           email: user.email,
                           creationDate: user.creationDate,
                           lastLoginDate: user.lastLoginDate,
                           characterId: user.characterId
                       });
                if(callback) callback();
            }
        });
    }

    delete(username){
        this.db.ref(`users/${username}`)
               .remove();
    }
}

function createUserFromDb(username, snapshot){
    let user = new User();
    user.username = username;
    if (snapshot) Object.assign(user, snapshot);

    return user;
}

function createUsersFromDb(snapshot){
    let users = [];

    Object.keys(snapshot).forEach((username) => {
        users.push(createUserFromDb(username, snapshot[username]));
    });

    return users;
}

module.exports = UserRepository;
