"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = require("../../firebase");
var firebase_1 = require("../../firebase");
var auth;
(function (auth) {
    var Auth = (function () {
        function Auth() {
        }
        Auth.prototype.onAuthStateChanged = function (handler) {
            this.authStateChangedHandler = handler;
            console.log(">> added onAuthStateChanged handler");
        };
        ;
        Auth.prototype.signOut = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                firebase.logout()
                    .then(function () {
                    _this.currentUser = undefined;
                    _this.authStateChangedHandler && _this.authStateChangedHandler();
                    resolve();
                })
                    .catch(function (err) {
                    reject({
                        message: err
                    });
                });
            });
        };
        Auth.prototype.signInWithEmailAndPassword = function (email, password) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                firebase.login({
                    type: firebase_1.LoginType.PASSWORD,
                    passwordOptions: {
                        email: email,
                        password: password
                    }
                }).then(function (user) {
                    _this.currentUser = user;
                    _this.authStateChangedHandler && _this.authStateChangedHandler(user);
                    resolve();
                }, (function (err) {
                    reject({
                        message: err
                    });
                }));
            });
        };
        Auth.prototype.createUserWithEmailAndPassword = function (email, password) {
            return firebase.createUser({
                email: email,
                password: password
            });
        };
        Auth.prototype.signInAnonymously = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                firebase.login({
                    type: firebase_1.LoginType.ANONYMOUS
                }).then(function (user) {
                    _this.currentUser = user;
                    _this.authStateChangedHandler && _this.authStateChangedHandler(user);
                    resolve();
                }, (function (err) {
                    reject({
                        message: err
                    });
                }));
            });
        };
        Auth.prototype.fetchProvidersForEmail = function (email) {
            return firebase.fetchProvidersForEmail(email);
        };
        return Auth;
    }());
    auth.Auth = Auth;
})(auth = exports.auth || (exports.auth = {}));
