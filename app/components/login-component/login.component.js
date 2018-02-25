"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var nativescript_snackbar_1 = require("nativescript-snackbar");
var ApplicationSettings = require("application-settings");
var firebase = require("nativescript-plugin-firebase");
var http_service_1 = require("../../http.service");
var appdata_service_1 = require("../../shared/appdata.service");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(router, http, appData) {
        this.router = router;
        this.http = http;
        this.appData = appData;
        this.input = {
            "email": "",
            "password": ""
        };
    }
    LoginComponent.prototype.ngOnInit = function () {
        if (ApplicationSettings.getBoolean("authenticated", false)) {
            this.router.navigate(['/secure'], { clearHistory: true });
        }
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        console.log("login in");
        if (this.input.email && this.input.password) {
            firebase.login({
                type: firebase.LoginType.PASSWORD,
                passwordOptions: {
                    email: this.input.email,
                    password: this.input.password
                }
            })
                .then(function (result) {
                firebase.query(function (firebase_result) {
                    console.log("FIREBASE RESULT:");
                    console.dir(firebase_result);
                    if (!firebase_result['value']) {
                        console.log("IN IF checkIfUserExists");
                        // add code for saving the data to new user
                        // this.createNewUser(fb_result, fb_access_token);
                    }
                    else {
                        console.log("IN ELSE");
                        for (var user_key in firebase_result.value) {
                            // save user's data locally
                            ApplicationSettings.setString('user_key', user_key);
                            ApplicationSettings.setString('user', JSON.stringify(firebase_result.value[user_key]));
                            ApplicationSettings.setString('uid', firebase_result.value[user_key]['uid']);
                            // console.dir(firebase_result.value[user_key]);
                        }
                        console.dir(firebase_result.value[Object.keys(firebase_result.value)[0]]);
                        var username = firebase_result.value[Object.keys(firebase_result.value)[0]]['user_name'];
                        var email = firebase_result.value[Object.keys(firebase_result.value)[0]]['email'];
                        _this.appData.updateUser({
                            'is_loggedin': true,
                            'username': firebase_result.value[Object.keys(firebase_result.value)[0]]['user_name'],
                            'email': firebase_result.value[Object.keys(firebase_result.value)[0]]['email'],
                        });
                        if (username)
                            ApplicationSettings.setString('username', username);
                        if (email)
                            ApplicationSettings.setString('email', email);
                    }
                }, '/users', {
                    singleEvent: true,
                    orderBy: {
                        type: firebase.QueryOrderByType.CHILD,
                        value: 'uid'
                    },
                    range: {
                        type: firebase.QueryRangeType.EQUAL_TO,
                        value: result.uid
                    },
                    limit: {
                        type: firebase.QueryLimitType.FIRST,
                        value: 1
                    }
                });
                ApplicationSettings.setBoolean("authenticated", true);
                _this.router.navigate(["/secure"], { clearHistory: true });
            }, function (errorMessage) {
                (new nativescript_snackbar_1.SnackBar()).simple("Incorrect Credentials!");
            });
        }
    };
    LoginComponent.prototype.doLoginByGoogle = function () {
        var _this = this;
        console.log("loggin in with GOOGLE!");
        firebase.login({
            // note that you need to enable Google auth in your firebase instance
            type: firebase.LoginType.GOOGLE
        }).then(function (result) {
            console.log("GOOGLE AUTH RESULT:");
            console.dir(result);
            firebase.query(function (firebase_result) {
                console.log("GOOGLE FIREBASE RESULT:");
                console.dir(firebase_result);
                if (!firebase_result['value']) {
                    console.log("IN IF checkIfUserExists");
                    var user_data = {
                        'uid': result.uid,
                        'user_name': result.name,
                        'profile_photo': result.profileImageURL,
                        'email': result.email
                    };
                    firebase.push('/users', user_data).then(function (result) {
                        var user = {};
                        user[result.key] = user_data; // the key is the property containing the user's data
                        // store user's data locally
                        ApplicationSettings.setString('user_key', result.key);
                        ApplicationSettings.setString('user', JSON.stringify(user));
                        ApplicationSettings.setString('uid', user_data.uid);
                        // console.dir(user);
                    });
                    _this.appData.updateUser(user_data);
                    // add code for saving the data to new user
                    // this.createNewUser(fb_result, fb_access_token);
                }
                else {
                    console.log("IN ELSE");
                    console.dir(firebase_result);
                    for (var user_key in firebase_result.value) {
                        // save user's data locally
                        ApplicationSettings.setString('user_key', user_key);
                        ApplicationSettings.setString('user', JSON.stringify(firebase_result.value[user_key]));
                        ApplicationSettings.setString('uid', result.uid);
                        if (firebase_result.value[user_key]['profile_photo']) {
                            ApplicationSettings.setString('profile_photo', firebase_result.value[user_key]['profile_photo']);
                        }
                        // console.dir(firebase_result.value[user_key]);
                    }
                    console.dir(firebase_result.value[Object.keys(firebase_result.value)[0]]);
                    var username = firebase_result.value[Object.keys(firebase_result.value)[0]]['user_name'];
                    var email = firebase_result.value[Object.keys(firebase_result.value)[0]]['email'];
                    _this.appData.updateUser({
                        'is_loggedin': true,
                        'username': firebase_result.value[Object.keys(firebase_result.value)[0]]['user_name'],
                        'email': firebase_result.value[Object.keys(firebase_result.value)[0]]['email'],
                        'profile_photo': firebase_result.value[Object.keys(firebase_result.value)[0]]['profile_photo']
                    });
                    if (username)
                        ApplicationSettings.setString('username', username);
                    if (email)
                        ApplicationSettings.setString('email', email);
                }
            }, '/users', {
                singleEvent: true,
                orderBy: {
                    type: firebase.QueryOrderByType.CHILD,
                    value: 'uid'
                },
                range: {
                    type: firebase.QueryRangeType.EQUAL_TO,
                    value: result.uid
                },
                limit: {
                    type: firebase.QueryLimitType.FIRST,
                    value: 1
                }
            });
            ApplicationSettings.setBoolean("authenticated", true);
            _this.router.navigate(["/secure"], { clearHistory: true });
        }, function (errorMessage) {
            (new nativescript_snackbar_1.SnackBar()).simple("Incorrect Credentials!");
        });
    };
    LoginComponent.prototype.loginFB = function () {
        var _this = this;
        console.log("loggin in with FACEBOOK!");
        firebase.login({
            type: firebase.LoginType.FACEBOOK,
            facebookOptions: {
                // scope: ['public_profile', 'email', 'user_birhtday', 'user_friends', 'user_location']
                scope: ['public_profile', 'email', 'user_friends']
            }
        })
            .then(function (fb_result) {
            console.log("FB RESULT:");
            console.dir(JSON.stringify(fb_result));
            var fbIndex = undefined;
            fb_result.providers.forEach(function (elem, i) {
                if (elem.id = "facebook.com")
                    fbIndex = i;
            });
            var fb_access_token = fb_result.providers[fbIndex]['token'];
            _this.checkIfUserExists(fb_result, fb_access_token);
            ApplicationSettings.setBoolean("authenticated", true);
            _this.router.navigate(["/secure"], { clearHistory: true });
        }, function (errorMessage) {
            console.log("FB ERROR:", errorMessage);
            // (new SnackBar()).simple(errorMessage);
        });
    };
    LoginComponent.prototype.checkIfUserExists = function (fb_result, fb_access_token) {
        var _this = this;
        // console.log("called checkIfUserExists");
        // console.dir(fb_result);
        firebase.query(function (firebase_result) {
            // console.log("FIREBASE RESULT:");
            // console.dir(firebase_result)
            if (!firebase_result['value']) {
                console.log("IN IF checkIfUserExists");
                // add code for saving the data to new user
                _this.createNewUser(fb_result, fb_access_token);
            }
            else {
                console.log("IN ELSE");
                for (var user_key in firebase_result.value) {
                    // save user's data locally
                    ApplicationSettings.setString('user_key', user_key);
                    ApplicationSettings.setString('user', JSON.stringify(firebase_result.value[user_key]));
                    // console.dir(firebase_result.value[user_key]);
                    ApplicationSettings.setString('fb_token', fb_access_token);
                }
                console.dir(firebase_result.value[Object.keys(firebase_result.value)[0]]);
                var username = firebase_result.value[Object.keys(firebase_result.value)[0]]['user_name'];
                var email = firebase_result.value[Object.keys(firebase_result.value)[0]]['email'];
                var fbID = firebase_result.value[Object.keys(firebase_result.value)[0]]['id'];
                var uid = firebase_result.value[Object.keys(firebase_result.value)[0]]['uid'];
                _this.appData.updateUser({
                    'is_loggedin': true,
                    'username': firebase_result.value[Object.keys(firebase_result.value)[0]]['user_name'],
                    'email': firebase_result.value[Object.keys(firebase_result.value)[0]]['email'],
                    'fbID': firebase_result.value[Object.keys(firebase_result.value)[0]]['id']
                });
                if (fbID)
                    ApplicationSettings.setString('fbID', fbID);
                if (username)
                    ApplicationSettings.setString('username', username);
                if (email)
                    ApplicationSettings.setString('email', email);
                if (uid)
                    ApplicationSettings.setString('uid', uid);
            }
        }, '/users', {
            singleEvent: true,
            orderBy: {
                type: firebase.QueryOrderByType.CHILD,
                value: 'uid'
            },
            range: {
                type: firebase.QueryRangeType.EQUAL_TO,
                value: fb_result.uid
            },
            limit: {
                type: firebase.QueryLimitType.FIRST,
                value: 1
            }
        });
    };
    LoginComponent.prototype.createNewUser = function (fb_result, fb_access_token) {
        console.log('called createNewUser');
        var user_data = {
            'uid': fb_result.uid,
            'user_name': fb_result.name,
            'profile_photo': fb_result.profileImageURL,
            'email': fb_result.email
        };
        this.appData.updateUser({
            'username': fb_result['name'],
            'email': fb_result['email']
        });
        this.http.getFaceBookUserInfo(fb_access_token).subscribe(function (r) {
            //  console.dir(r);
            user_data['id'] = r.id; // facebook user ID for this specific app
            // console.log("facebook answer");
            // console.dir(r);
            // create new user
            firebase.push('/users', user_data).then(function (result) {
                var user = {};
                user[result.key] = user_data; // the key is the property containing the user's data
                // store user's data locally
                ApplicationSettings.setString('user_key', result.key);
                ApplicationSettings.setString('user', JSON.stringify(user));
                // console.dir(user);
                ApplicationSettings.setString('fb_token', fb_access_token);
            });
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ns-login',
            templateUrl: 'login.component.html'
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions, http_service_1.HttpService, appdata_service_1.AppDataService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELHNEQUErRDtBQUMvRCwrREFBaUQ7QUFFakQsMERBQTREO0FBQzVELHVEQUF5RDtBQUV6RCxtREFBaUQ7QUFDakQsZ0VBQThEO0FBTzlEO0lBR0ksd0JBQTJCLE1BQXdCLEVBQVUsSUFBaUIsRUFBVSxPQUF1QjtRQUFwRixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQWE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUMzRyxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1QsT0FBTyxFQUFFLEVBQUU7WUFDWCxVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFDO0lBQ04sQ0FBQztJQUVNLGlDQUFRLEdBQWY7UUFDSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUMsWUFBWSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztJQUNMLENBQUM7SUFFTSw4QkFBSyxHQUFaO1FBQUEsaUJBeUVDO1FBeEVHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRTFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQ1gsSUFBSSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUTtnQkFDakMsZUFBZSxFQUFFO29CQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFD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QWM7UUFMMUIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsVUFBVTtZQUNwQixXQUFXLEVBQUUsc0JBQXNCO1NBQ3RDLENBQUM7eUNBSXFDLHlCQUFnQixFQUFnQiwwQkFBVyxFQUFtQixnQ0FBYztPQUh0RyxjQUFjLENBOFQxQjtJQUFELHFCQUFDO0NBQUEsQUE5VEQsSUE4VEM7QUE5VFksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgU25hY2tCYXIgfSBmcm9tICduYXRpdmVzY3JpcHQtc25hY2tiYXInO1xyXG5cclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tICdhcHBsaWNhdGlvbi1zZXR0aW5ncyc7XHJcbmltcG9ydCAqIGFzIGZpcmViYXNlIGZyb20gJ25hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2UnO1xyXG5cclxuaW1wb3J0IHsgSHR0cFNlcnZpY2UgfSBmcm9tICcuLi8uLi9odHRwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBcHBEYXRhU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvYXBwZGF0YS5zZXJ2aWNlXCI7XHJcbiBcclxuQENvbXBvbmVudCh7XHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgc2VsZWN0b3I6ICducy1sb2dpbicsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2xvZ2luLmNvbXBvbmVudC5odG1sJyBcclxufSlcclxuZXhwb3J0IGNsYXNzIExvZ2luQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBwdWJsaWMgaW5wdXQ6IGFueTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlcjogUm91dGVyRXh0ZW5zaW9ucywgcHJpdmF0ZSBodHRwOiBIdHRwU2VydmljZSwgcHJpdmF0ZSBhcHBEYXRhOiBBcHBEYXRhU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSB7XHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJcIixcclxuICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBcIlwiXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImF1dGhlbnRpY2F0ZWRcIiwgZmFsc2UpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnL3NlY3VyZSddLCB7Y2xlYXJIaXN0b3J5OiB0cnVlfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2dpbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luIGluXCIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pbnB1dC5lbWFpbCAmJiB0aGlzLmlucHV0LnBhc3N3b3JkKSB7XHJcblxyXG4gICAgICAgICAgICBmaXJlYmFzZS5sb2dpbih7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5Mb2dpblR5cGUuUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogdGhpcy5pbnB1dC5lbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogdGhpcy5pbnB1dC5wYXNzd29yZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyZWJhc2UucXVlcnkoIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJlYmFzZV9yZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGSVJFQkFTRSBSRVNVTFQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJlYmFzZV9yZXN1bHRbJ3ZhbHVlJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIElGIGNoZWNrSWZVc2VyRXhpc3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBjb2RlIGZvciBzYXZpbmcgdGhlIGRhdGEgdG8gbmV3IHVzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNyZWF0ZU5ld1VzZXIoZmJfcmVzdWx0LCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIEVMU0VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciB1c2VyX2tleSBpbiBmaXJlYmFzZV9yZXN1bHQudmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIHVzZXIncyBkYXRhIGxvY2FsbHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJfa2V5JywgdXNlcl9rZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcicsIEpTT04uc3RyaW5naWZ5KGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VpZCcsIGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV1bJ3VpZCddKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0LnZhbHVlW3VzZXJfa2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJuYW1lID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWyd1c2VyX25hbWUnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW1haWwgPSBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ2VtYWlsJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBEYXRhLnVwZGF0ZVVzZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNfbG9nZ2VkaW4nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndXNlcm5hbWUnOiAgZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWyd1c2VyX25hbWUnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2VtYWlsJzogZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydlbWFpbCddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VybmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJuYW1lJywgdXNlcm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWFpbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2VtYWlsJywgZW1haWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnL3VzZXJzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlRXZlbnQ6IHRydWUsIC8vIGZvciBjaGVja2luZyBpZiB0aGUgdmFsdWUgZXhpc3RzIChyZXR1cm4gdGhlIHdob2xlIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlckJ5OiB7IC8vIHRoZSBwcm9wZXJ0eSBpbiBlYWNoIG9mIHRoZSBvYmplY3RzIGluIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHF1ZXJ5IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLlF1ZXJ5T3JkZXJCeVR5cGUuQ0hJTEQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd1aWQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHsgLy8gdGhlIGNvbXBhcmlzb24gb3BlcmF0b3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeVJhbmdlVHlwZS5FUVVBTF9UTyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnVpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0OiB7IC8vIGxpbWl0IHRvIG9ubHkgcmV0dXJuIHRoZSBmaXJzdCByZXN1bHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeUxpbWl0VHlwZS5GSVJTVCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VjdXJlXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiSW5jb3JyZWN0IENyZWRlbnRpYWxzIVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRvTG9naW5CeUdvb2dsZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2dpbiBpbiB3aXRoIEdPT0dMRSFcIik7XHJcbiAgICAgICAgZmlyZWJhc2UubG9naW4oe1xyXG4gICAgICAgICAgICAvLyBub3RlIHRoYXQgeW91IG5lZWQgdG8gZW5hYmxlIEdvb2dsZSBhdXRoIGluIHlvdXIgZmlyZWJhc2UgaW5zdGFuY2VcclxuICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuTG9naW5UeXBlLkdPT0dMRVxyXG4gICAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgICAgIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdPT0dMRSBBVVRIIFJFU1VMVDpcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihyZXN1bHQpXHJcblxyXG4gICAgICAgICAgICAgICAgZmlyZWJhc2UucXVlcnkoIFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcmViYXNlX3Jlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR09PR0xFIEZJUkVCQVNFIFJFU1VMVDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJlYmFzZV9yZXN1bHRbJ3ZhbHVlJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSU4gSUYgY2hlY2tJZlVzZXJFeGlzdHNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXNlcl9kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1aWQnOiByZXN1bHQudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1c2VyX25hbWUnOiByZXN1bHQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncHJvZmlsZV9waG90byc6IHJlc3VsdC5wcm9maWxlSW1hZ2VVUkwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2VtYWlsJzogcmVzdWx0LmVtYWlsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyZWJhc2UucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnL3VzZXJzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2RhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1c2VyID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyW3Jlc3VsdC5rZXldID0gdXNlcl9kYXRhOyAvLyB0aGUga2V5IGlzIHRoZSBwcm9wZXJ0eSBjb250YWluaW5nIHRoZSB1c2VyJ3MgZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgdXNlcidzIGRhdGEgbG9jYWxseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJfa2V5JywgcmVzdWx0LmtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcicsIEpTT04uc3RyaW5naWZ5KHVzZXIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1aWQnLCB1c2VyX2RhdGEudWlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBEYXRhLnVwZGF0ZVVzZXIodXNlcl9kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBjb2RlIGZvciBzYXZpbmcgdGhlIGRhdGEgdG8gbmV3IHVzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuY3JlYXRlTmV3VXNlcihmYl9yZXN1bHQsIGZiX2FjY2Vzc190b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIEVMU0VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciB1c2VyX2tleSBpbiBmaXJlYmFzZV9yZXN1bHQudmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgdXNlcidzIGRhdGEgbG9jYWxseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VyX2tleScsIHVzZXJfa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcicsIEpTT04uc3RyaW5naWZ5KGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndWlkJywgcmVzdWx0LnVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV1bJ3Byb2ZpbGVfcGhvdG8nXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygncHJvZmlsZV9waG90bycsIGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV1bJ3Byb2ZpbGVfcGhvdG8nXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dKVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJuYW1lID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWyd1c2VyX25hbWUnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbWFpbCA9IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsnZW1haWwnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBEYXRhLnVwZGF0ZVVzZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc19sb2dnZWRpbic6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3VzZXJuYW1lJzogIGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsndXNlcl9uYW1lJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2VtYWlsJzogZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydlbWFpbCddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwcm9maWxlX3Bob3RvJzogZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydwcm9maWxlX3Bob3RvJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJuYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VybmFtZScsIHVzZXJuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWFpbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygnZW1haWwnLCBlbWFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICcvdXNlcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlRXZlbnQ6IHRydWUsIC8vIGZvciBjaGVja2luZyBpZiB0aGUgdmFsdWUgZXhpc3RzIChyZXR1cm4gdGhlIHdob2xlIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyQnk6IHsgLy8gdGhlIHByb3BlcnR5IGluIGVhY2ggb2YgdGhlIG9iamVjdHMgaW4gd2hpY2ggdG8gcGVyZm9ybSB0aGUgcXVlcnkgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeU9yZGVyQnlUeXBlLkNISUxELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd1aWQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7IC8vIHRoZSBjb21wYXJpc29uIG9wZXJhdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeVJhbmdlVHlwZS5FUVVBTF9UTyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQudWlkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0OiB7IC8vIGxpbWl0IHRvIG9ubHkgcmV0dXJuIHRoZSBmaXJzdCByZXN1bHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLlF1ZXJ5TGltaXRUeXBlLkZJUlNULCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9zZWN1cmVcIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJJbmNvcnJlY3QgQ3JlZGVudGlhbHMhXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9naW5GQigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2dpbiBpbiB3aXRoIEZBQ0VCT09LIVwiKTtcclxuICAgICAgICBmaXJlYmFzZS5sb2dpbih7XHJcbiAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLkxvZ2luVHlwZS5GQUNFQk9PSyxcclxuICAgICAgICAgICAgZmFjZWJvb2tPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAvLyBzY29wZTogWydwdWJsaWNfcHJvZmlsZScsICdlbWFpbCcsICd1c2VyX2Jpcmh0ZGF5JywgJ3VzZXJfZnJpZW5kcycsICd1c2VyX2xvY2F0aW9uJ11cclxuICAgICAgICAgICAgICAgIHNjb3BlOiBbJ3B1YmxpY19wcm9maWxlJywgJ2VtYWlsJywgJ3VzZXJfZnJpZW5kcyddXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAoZmJfcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZCIFJFU1VMVDpcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihKU09OLnN0cmluZ2lmeShmYl9yZXN1bHQpKTtcclxuICAgICAgICAgICAgICAgIGxldCBmYkluZGV4ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgZmJfcmVzdWx0LnByb3ZpZGVycy5mb3JFYWNoKChlbGVtLGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbS5pZCA9IFwiZmFjZWJvb2suY29tXCIpIGZiSW5kZXggPSBpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHZhciBmYl9hY2Nlc3NfdG9rZW4gPSBmYl9yZXN1bHQucHJvdmlkZXJzW2ZiSW5kZXhdWyd0b2tlbiddO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tJZlVzZXJFeGlzdHMoZmJfcmVzdWx0LCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9zZWN1cmVcIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGQiBFUlJPUjpcIiwgZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIC8vIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKGVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tJZlVzZXJFeGlzdHMoZmJfcmVzdWx0LCBmYl9hY2Nlc3NfdG9rZW4pIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNhbGxlZCBjaGVja0lmVXNlckV4aXN0c1wiKTtcclxuICAgICAgICAvLyBjb25zb2xlLmRpcihmYl9yZXN1bHQpO1xyXG4gICAgICAgIGZpcmViYXNlLnF1ZXJ5KCBcclxuICAgICAgICAgICAgZmlyZWJhc2VfcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRklSRUJBU0UgUkVTVUxUOlwiKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdClcclxuICAgICAgICAgICAgICAgIGlmICghZmlyZWJhc2VfcmVzdWx0Wyd2YWx1ZSddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTiBJRiBjaGVja0lmVXNlckV4aXN0c1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgY29kZSBmb3Igc2F2aW5nIHRoZSBkYXRhIHRvIG5ldyB1c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOZXdVc2VyKGZiX3Jlc3VsdCwgZmJfYWNjZXNzX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTiBFTFNFXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgdXNlcl9rZXkgaW4gZmlyZWJhc2VfcmVzdWx0LnZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSB1c2VyJ3MgZGF0YSBsb2NhbGx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VyX2tleScsIHVzZXJfa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXInLCBKU09OLnN0cmluZ2lmeShmaXJlYmFzZV9yZXN1bHQudmFsdWVbdXNlcl9rZXldKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygnZmJfdG9rZW4nLCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB1c2VybmFtZSA9IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsndXNlcl9uYW1lJ107XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVtYWlsID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydlbWFpbCddO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmYklEID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydpZCddO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB1aWQgPSBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ3VpZCddO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwRGF0YS51cGRhdGVVc2VyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2lzX2xvZ2dlZGluJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3VzZXJuYW1lJzogIGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsndXNlcl9uYW1lJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdlbWFpbCc6IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsnZW1haWwnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2ZiSUQnOiBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ2lkJ11cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmJJRClcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2ZiSUQnLCBmYklEKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlcm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VybmFtZScsIHVzZXJuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZW1haWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCdlbWFpbCcsIGVtYWlsKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodWlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndWlkJywgdWlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJy91c2VycycsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNpbmdsZUV2ZW50OiB0cnVlLCAvLyBmb3IgY2hlY2tpbmcgaWYgdGhlIHZhbHVlIGV4aXN0cyAocmV0dXJuIHRoZSB3aG9sZSBkYXRhKVxyXG4gICAgICAgICAgICAgICAgb3JkZXJCeTogeyAvLyB0aGUgcHJvcGVydHkgaW4gZWFjaCBvZiB0aGUgb2JqZWN0cyBpbiB3aGljaCB0byBwZXJmb3JtIHRoZSBxdWVyeSBcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeU9yZGVyQnlUeXBlLkNISUxELFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAndWlkJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJhbmdlOiB7IC8vIHRoZSBjb21wYXJpc29uIG9wZXJhdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlSYW5nZVR5cGUuRVFVQUxfVE8sXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZiX3Jlc3VsdC51aWRcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogeyAvLyBsaW1pdCB0byBvbmx5IHJldHVybiB0aGUgZmlyc3QgcmVzdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlMaW1pdFR5cGUuRklSU1QsIFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAxXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlTmV3VXNlcihmYl9yZXN1bHQsIGZiX2FjY2Vzc190b2tlbikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjYWxsZWQgY3JlYXRlTmV3VXNlcicpO1xyXG4gICAgICAgIHZhciB1c2VyX2RhdGEgPSB7XHJcbiAgICAgICAgICAgICd1aWQnOiBmYl9yZXN1bHQudWlkLFxyXG4gICAgICAgICAgICAndXNlcl9uYW1lJzogZmJfcmVzdWx0Lm5hbWUsXHJcbiAgICAgICAgICAgICdwcm9maWxlX3Bob3RvJzogZmJfcmVzdWx0LnByb2ZpbGVJbWFnZVVSTCxcclxuICAgICAgICAgICAgJ2VtYWlsJzogZmJfcmVzdWx0LmVtYWlsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBEYXRhLnVwZGF0ZVVzZXIoe1xyXG4gICAgICAgICAgICAndXNlcm5hbWUnOiAgZmJfcmVzdWx0WyduYW1lJ10sXHJcbiAgICAgICAgICAgICdlbWFpbCc6ZmJfcmVzdWx0WydlbWFpbCddXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5odHRwLmdldEZhY2VCb29rVXNlckluZm8oZmJfYWNjZXNzX3Rva2VuKS5zdWJzY3JpYmUoIChyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vICBjb25zb2xlLmRpcihyKTtcclxuICAgICAgICAgICAgICAgIHVzZXJfZGF0YVsnaWQnXSA9IHIuaWQ7IC8vIGZhY2Vib29rIHVzZXIgSUQgZm9yIHRoaXMgc3BlY2lmaWMgYXBwXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImZhY2Vib29rIGFuc3dlclwiKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKHIpO1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIG5ldyB1c2VyXHJcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAnL3VzZXJzJyxcclxuICAgICAgICAgICAgICAgICAgdXNlcl9kYXRhXHJcbiAgICAgICAgICAgICAgICApLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXIgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyW3Jlc3VsdC5rZXldID0gdXNlcl9kYXRhOyAvLyB0aGUga2V5IGlzIHRoZSBwcm9wZXJ0eSBjb250YWluaW5nIHRoZSB1c2VyJ3MgZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHVzZXIncyBkYXRhIGxvY2FsbHlcclxuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcl9rZXknLCByZXN1bHQua2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcicsIEpTT04uc3RyaW5naWZ5KHVzZXIpKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcih1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygnZmJfdG9rZW4nLCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdfQ==