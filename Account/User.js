'use strict';

const shortId = require('shortid');
const crypto = require('crypto');

class User {
    static create(username, password, email){
        let user = new User();

        user.password = crypto.createHash('sha512')
                              .update(password)
                              .digest('base64');
        user.username = username;
        user.email = email;
        user.creationDate = Date.now();
        user.lastLoginDate = null;
        user.characterId = shortId.generate();

        return user;
    }

    login(){
        this.lastLoginDate = Date.now();
    }

    checkPassword(password){
        let hash = crypto.createHash('sha512')
                         .update(password)
                         .digest('base64');
        return this.password === hash;
    }
}

module.exports = User;
