'use strict';

const assert = require('assert');
const User = require('../Account/User');
const crypto = require('crypto');

describe('User should', () => {
    beforeEach(() => {
        this.testName = 'test';
        this.testPassword = 'test';
        this.testMail = 'test@test.com';
        this.user = User.create(this.testName, this.testPassword, this.testMail);
    });

    describe('be created with', () => {
        it('a creationDate', () =>{
            assert(this.user.creationDate);
        });

        it('a null lastLoginDate', () => {
            assert(this.user.lastLoginDate === null);
        });

        it('a unique character id', () => {
            assert(this.user.characterId);
        });

        it('a correct username and email', () => {
            assert(this.user.username === this.testName);
            assert(this.user.email === this.testMail);
        });

        it('with its hashed password', () => {
            let expectedHashedPwd = crypto.createHash('sha512')
                                        .update(this.testPassword)
                                        .digest('base64');

            assert(this.user.password === expectedHashedPwd);
        });
    });

    it('updates its loginLastDate when login', () => {
        assert(this.user.lastLoginDate === null);
        this.user.login();
        assert(this.user.lastLoginDate);
    });

    it('check its password', () => {
        assert(this.user.checkPassword(this.testPassword));
        assert(!this.user.checkPassword('random'));
    });
});
