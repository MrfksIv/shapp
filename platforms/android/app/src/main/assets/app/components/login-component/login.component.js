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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELHNEQUErRDtBQUMvRCwrREFBaUQ7QUFFakQsMERBQTREO0FBQzVELHVEQUF5RDtBQUd6RCxtREFBaUQ7QUFDakQsZ0VBQThEO0FBTzlEO0lBR0ksd0JBQTJCLE1BQXdCLEVBQVUsSUFBaUIsRUFBVSxPQUF1QjtRQUFwRixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQWE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUMzRyxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1QsT0FBTyxFQUFFLEVBQUU7WUFDWCxVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFDO0lBQ04sQ0FBQztJQUVNLGlDQUFRLEdBQWY7UUFDSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUMsWUFBWSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztJQUNMLENBQUM7SUFFTSw4QkFBSyxHQUFaO1FBQUEsaUJBd0VDO1FBdkVHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRTFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQ1gsSUFBSSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUTtnQkFDakMsZUFBZSxFQUFFO29CQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFD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QyxrQkFBa0I7WUFDbEIsa0JBQWtCO1lBQ2xCLFFBQVEsQ0FBQyxJQUFJLENBQ1gsUUFBUSxFQUNSLFNBQVMsQ0FDVixDQUFDLElBQUksQ0FDSixVQUFVLE1BQU07Z0JBRWQsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMscURBQXFEO2dCQUNuRiw0QkFBNEI7Z0JBQzVCLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN0RCxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDNUQscUJBQXFCO2dCQUNyQixtQkFBbUIsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzdELENBQUMsQ0FDRixDQUFDO1FBRVYsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBdlRRLGNBQWM7UUFMMUIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsVUFBVTtZQUNwQixXQUFXLEVBQUUsc0JBQXNCO1NBQ3RDLENBQUM7eUNBSXFDLHlCQUFnQixFQUFnQiwwQkFBVyxFQUFtQixnQ0FBYztPQUh0RyxjQUFjLENBd1QxQjtJQUFELHFCQUFDO0NBQUEsQUF4VEQsSUF3VEM7QUF4VFksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgU25hY2tCYXIgfSBmcm9tICduYXRpdmVzY3JpcHQtc25hY2tiYXInO1xyXG5cclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tICdhcHBsaWNhdGlvbi1zZXR0aW5ncyc7XHJcbmltcG9ydCAqIGFzIGZpcmViYXNlIGZyb20gJ25hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2UnO1xyXG5pbXBvcnQgKiBhcyB0bnNPQXV0aE1vZHVsZSBmcm9tICduYXRpdmVzY3JpcHQtb2F1dGgnO1xyXG5cclxuaW1wb3J0IHsgSHR0cFNlcnZpY2UgfSBmcm9tICcuLi8uLi9odHRwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBcHBEYXRhU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvYXBwZGF0YS5zZXJ2aWNlXCI7XHJcbiBcclxuQENvbXBvbmVudCh7XHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgc2VsZWN0b3I6ICducy1sb2dpbicsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2xvZ2luLmNvbXBvbmVudC5odG1sJyBcclxufSlcclxuZXhwb3J0IGNsYXNzIExvZ2luQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBwdWJsaWMgaW5wdXQ6IGFueTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlcjogUm91dGVyRXh0ZW5zaW9ucywgcHJpdmF0ZSBodHRwOiBIdHRwU2VydmljZSwgcHJpdmF0ZSBhcHBEYXRhOiBBcHBEYXRhU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSB7XHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJcIixcclxuICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBcIlwiXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImF1dGhlbnRpY2F0ZWRcIiwgZmFsc2UpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnL3NlY3VyZSddLCB7Y2xlYXJIaXN0b3J5OiB0cnVlfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2dpbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luIGluXCIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pbnB1dC5lbWFpbCAmJiB0aGlzLmlucHV0LnBhc3N3b3JkKSB7XHJcblxyXG4gICAgICAgICAgICBmaXJlYmFzZS5sb2dpbih7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5Mb2dpblR5cGUuUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogdGhpcy5pbnB1dC5lbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogdGhpcy5pbnB1dC5wYXNzd29yZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyZWJhc2UucXVlcnkoIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJlYmFzZV9yZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGSVJFQkFTRSBSRVNVTFQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJlYmFzZV9yZXN1bHRbJ3ZhbHVlJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIElGIGNoZWNrSWZVc2VyRXhpc3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBjb2RlIGZvciBzYXZpbmcgdGhlIGRhdGEgdG8gbmV3IHVzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNyZWF0ZU5ld1VzZXIoZmJfcmVzdWx0LCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIEVMU0VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciB1c2VyX2tleSBpbiBmaXJlYmFzZV9yZXN1bHQudmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIHVzZXIncyBkYXRhIGxvY2FsbHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJfa2V5JywgdXNlcl9rZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcicsIEpTT04uc3RyaW5naWZ5KGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0LnZhbHVlW3VzZXJfa2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJuYW1lID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWyd1c2VyX25hbWUnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW1haWwgPSBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ2VtYWlsJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBEYXRhLnVwZGF0ZVVzZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNfbG9nZ2VkaW4nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndXNlcm5hbWUnOiAgZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWyd1c2VyX25hbWUnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2VtYWlsJzogZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydlbWFpbCddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VybmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJuYW1lJywgdXNlcm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWFpbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2VtYWlsJywgZW1haWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnL3VzZXJzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlRXZlbnQ6IHRydWUsIC8vIGZvciBjaGVja2luZyBpZiB0aGUgdmFsdWUgZXhpc3RzIChyZXR1cm4gdGhlIHdob2xlIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlckJ5OiB7IC8vIHRoZSBwcm9wZXJ0eSBpbiBlYWNoIG9mIHRoZSBvYmplY3RzIGluIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHF1ZXJ5IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLlF1ZXJ5T3JkZXJCeVR5cGUuQ0hJTEQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd1aWQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHsgLy8gdGhlIGNvbXBhcmlzb24gb3BlcmF0b3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeVJhbmdlVHlwZS5FUVVBTF9UTyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnVpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0OiB7IC8vIGxpbWl0IHRvIG9ubHkgcmV0dXJuIHRoZSBmaXJzdCByZXN1bHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeUxpbWl0VHlwZS5GSVJTVCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VjdXJlXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiSW5jb3JyZWN0IENyZWRlbnRpYWxzIVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRvTG9naW5CeUdvb2dsZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2dpbiBpbiB3aXRoIEdPT0dMRSFcIik7XHJcbiAgICAgICAgZmlyZWJhc2UubG9naW4oe1xyXG4gICAgICAgICAgICAvLyBub3RlIHRoYXQgeW91IG5lZWQgdG8gZW5hYmxlIEdvb2dsZSBhdXRoIGluIHlvdXIgZmlyZWJhc2UgaW5zdGFuY2VcclxuICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuTG9naW5UeXBlLkdPT0dMRVxyXG4gICAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgICAgIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdPT0dMRSBBVVRIIFJFU1VMVDpcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihyZXN1bHQpXHJcblxyXG4gICAgICAgICAgICAgICAgZmlyZWJhc2UucXVlcnkoIFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcmViYXNlX3Jlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR09PR0xFIEZJUkVCQVNFIFJFU1VMVDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJlYmFzZV9yZXN1bHRbJ3ZhbHVlJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSU4gSUYgY2hlY2tJZlVzZXJFeGlzdHNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXNlcl9kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1aWQnOiByZXN1bHQudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1c2VyX25hbWUnOiByZXN1bHQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncHJvZmlsZV9waG90byc6IHJlc3VsdC5wcm9maWxlSW1hZ2VVUkwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2VtYWlsJzogcmVzdWx0LmVtYWlsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyZWJhc2UucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnL3VzZXJzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2RhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1c2VyID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyW3Jlc3VsdC5rZXldID0gdXNlcl9kYXRhOyAvLyB0aGUga2V5IGlzIHRoZSBwcm9wZXJ0eSBjb250YWluaW5nIHRoZSB1c2VyJ3MgZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgdXNlcidzIGRhdGEgbG9jYWxseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJfa2V5JywgcmVzdWx0LmtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcicsIEpTT04uc3RyaW5naWZ5KHVzZXIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBEYXRhLnVwZGF0ZVVzZXIodXNlcl9kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBjb2RlIGZvciBzYXZpbmcgdGhlIGRhdGEgdG8gbmV3IHVzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuY3JlYXRlTmV3VXNlcihmYl9yZXN1bHQsIGZiX2FjY2Vzc190b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIEVMU0VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciB1c2VyX2tleSBpbiBmaXJlYmFzZV9yZXN1bHQudmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgdXNlcidzIGRhdGEgbG9jYWxseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VyX2tleScsIHVzZXJfa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcicsIEpTT04uc3RyaW5naWZ5KGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlyZWJhc2VfcmVzdWx0LnZhbHVlW3VzZXJfa2V5XVsncHJvZmlsZV9waG90byddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCdwcm9maWxlX3Bob3RvJywgZmlyZWJhc2VfcmVzdWx0LnZhbHVlW3VzZXJfa2V5XVsncHJvZmlsZV9waG90byddKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0LnZhbHVlW3VzZXJfa2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV0pXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXNlcm5hbWUgPSBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ3VzZXJfbmFtZSddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVtYWlsID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydlbWFpbCddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcERhdGEudXBkYXRlVXNlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzX2xvZ2dlZGluJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndXNlcm5hbWUnOiAgZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWyd1c2VyX25hbWUnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZW1haWwnOiBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ2VtYWlsJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Byb2ZpbGVfcGhvdG8nOiBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ3Byb2ZpbGVfcGhvdG8nXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodXNlcm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJuYW1lJywgdXNlcm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtYWlsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCdlbWFpbCcsIGVtYWlsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJy91c2VycycsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaW5nbGVFdmVudDogdHJ1ZSwgLy8gZm9yIGNoZWNraW5nIGlmIHRoZSB2YWx1ZSBleGlzdHMgKHJldHVybiB0aGUgd2hvbGUgZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJCeTogeyAvLyB0aGUgcHJvcGVydHkgaW4gZWFjaCBvZiB0aGUgb2JqZWN0cyBpbiB3aGljaCB0byBwZXJmb3JtIHRoZSBxdWVyeSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLlF1ZXJ5T3JkZXJCeVR5cGUuQ0hJTEQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ3VpZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHsgLy8gdGhlIGNvbXBhcmlzb24gb3BlcmF0b3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLlF1ZXJ5UmFuZ2VUeXBlLkVRVUFMX1RPLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC51aWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXQ6IHsgLy8gbGltaXQgdG8gb25seSByZXR1cm4gdGhlIGZpcnN0IHJlc3VsdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlMaW1pdFR5cGUuRklSU1QsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJhdXRoZW50aWNhdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NlY3VyZVwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShcIkluY29ycmVjdCBDcmVkZW50aWFscyFcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2dpbkZCKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibG9nZ2luIGluIHdpdGggRkFDRUJPT0shXCIpO1xyXG4gICAgICAgIGZpcmViYXNlLmxvZ2luKHtcclxuICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuTG9naW5UeXBlLkZBQ0VCT09LLFxyXG4gICAgICAgICAgICBmYWNlYm9va09wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIC8vIHNjb3BlOiBbJ3B1YmxpY19wcm9maWxlJywgJ2VtYWlsJywgJ3VzZXJfYmlyaHRkYXknLCAndXNlcl9mcmllbmRzJywgJ3VzZXJfbG9jYXRpb24nXVxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IFsncHVibGljX3Byb2ZpbGUnLCAnZW1haWwnLCAndXNlcl9mcmllbmRzJ11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgIChmYl9yZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRkIgUkVTVUxUOlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKEpTT04uc3RyaW5naWZ5KGZiX3Jlc3VsdCkpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGZiSW5kZXggPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBmYl9yZXN1bHQucHJvdmlkZXJzLmZvckVhY2goKGVsZW0saSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtLmlkID0gXCJmYWNlYm9vay5jb21cIikgZmJJbmRleCA9IGlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZiX2FjY2Vzc190b2tlbiA9IGZiX3Jlc3VsdC5wcm92aWRlcnNbZmJJbmRleF1bJ3Rva2VuJ107XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0lmVXNlckV4aXN0cyhmYl9yZXN1bHQsIGZiX2FjY2Vzc190b2tlbik7XHJcbiAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJhdXRoZW50aWNhdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NlY3VyZVwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZCIEVSUk9SOlwiLCBlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgLy8gKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja0lmVXNlckV4aXN0cyhmYl9yZXN1bHQsIGZiX2FjY2Vzc190b2tlbikge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2FsbGVkIGNoZWNrSWZVc2VyRXhpc3RzXCIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUuZGlyKGZiX3Jlc3VsdCk7XHJcbiAgICAgICAgZmlyZWJhc2UucXVlcnkoIFxyXG4gICAgICAgICAgICBmaXJlYmFzZV9yZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJGSVJFQkFTRSBSRVNVTFQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgaWYgKCFmaXJlYmFzZV9yZXN1bHRbJ3ZhbHVlJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIElGIGNoZWNrSWZVc2VyRXhpc3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCBjb2RlIGZvciBzYXZpbmcgdGhlIGRhdGEgdG8gbmV3IHVzZXJcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU5ld1VzZXIoZmJfcmVzdWx0LCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIEVMU0VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciB1c2VyX2tleSBpbiBmaXJlYmFzZV9yZXN1bHQudmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIHVzZXIncyBkYXRhIGxvY2FsbHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJfa2V5JywgdXNlcl9rZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcicsIEpTT04uc3RyaW5naWZ5KGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0LnZhbHVlW3VzZXJfa2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCdmYl90b2tlbicsIGZiX2FjY2Vzc190b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJuYW1lID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWyd1c2VyX25hbWUnXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZW1haWwgPSBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ2VtYWlsJ107XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZiSUQgPSBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ2lkJ107XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBEYXRhLnVwZGF0ZVVzZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnaXNfbG9nZ2VkaW4nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAndXNlcm5hbWUnOiAgZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWyd1c2VyX25hbWUnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2VtYWlsJzogZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydlbWFpbCddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZmJJRCc6IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsnaWQnXVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmYklEKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygnZmJJRCcsIGZiSUQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VybmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJuYW1lJywgdXNlcm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbWFpbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2VtYWlsJywgZW1haWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnL3VzZXJzJyxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2luZ2xlRXZlbnQ6IHRydWUsIC8vIGZvciBjaGVja2luZyBpZiB0aGUgdmFsdWUgZXhpc3RzIChyZXR1cm4gdGhlIHdob2xlIGRhdGEpXHJcbiAgICAgICAgICAgICAgICBvcmRlckJ5OiB7IC8vIHRoZSBwcm9wZXJ0eSBpbiBlYWNoIG9mIHRoZSBvYmplY3RzIGluIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHF1ZXJ5IFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLlF1ZXJ5T3JkZXJCeVR5cGUuQ0hJTEQsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd1aWQnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmFuZ2U6IHsgLy8gdGhlIGNvbXBhcmlzb24gb3BlcmF0b3JcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeVJhbmdlVHlwZS5FUVVBTF9UTyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZmJfcmVzdWx0LnVpZFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGxpbWl0OiB7IC8vIGxpbWl0IHRvIG9ubHkgcmV0dXJuIHRoZSBmaXJzdCByZXN1bHRcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeUxpbWl0VHlwZS5GSVJTVCwgXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVOZXdVc2VyKGZiX3Jlc3VsdCwgZmJfYWNjZXNzX3Rva2VuKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NhbGxlZCBjcmVhdGVOZXdVc2VyJyk7XHJcbiAgICAgICAgdmFyIHVzZXJfZGF0YSA9IHtcclxuICAgICAgICAgICAgJ3VpZCc6IGZiX3Jlc3VsdC51aWQsXHJcbiAgICAgICAgICAgICd1c2VyX25hbWUnOiBmYl9yZXN1bHQubmFtZSxcclxuICAgICAgICAgICAgJ3Byb2ZpbGVfcGhvdG8nOiBmYl9yZXN1bHQucHJvZmlsZUltYWdlVVJMLFxyXG4gICAgICAgICAgICAnZW1haWwnOiBmYl9yZXN1bHQuZW1haWxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFwcERhdGEudXBkYXRlVXNlcih7XHJcbiAgICAgICAgICAgICd1c2VybmFtZSc6ICBmYl9yZXN1bHRbJ25hbWUnXSxcclxuICAgICAgICAgICAgJ2VtYWlsJzpmYl9yZXN1bHRbJ2VtYWlsJ11cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmh0dHAuZ2V0RmFjZUJvb2tVc2VySW5mbyhmYl9hY2Nlc3NfdG9rZW4pLnN1YnNjcmliZSggKHI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gIGNvbnNvbGUuZGlyKHIpO1xyXG4gICAgICAgICAgICAgICAgdXNlcl9kYXRhWydpZCddID0gci5pZDsgLy8gZmFjZWJvb2sgdXNlciBJRCBmb3IgdGhpcyBzcGVjaWZpYyBhcHBcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZmFjZWJvb2sgYW5zd2VyXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIocik7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgbmV3IHVzZXJcclxuICAgICAgICAgICAgICAgIGZpcmViYXNlLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICcvdXNlcnMnLFxyXG4gICAgICAgICAgICAgICAgICB1c2VyX2RhdGFcclxuICAgICAgICAgICAgICAgICkudGhlbihcclxuICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdXNlciA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJbcmVzdWx0LmtleV0gPSB1c2VyX2RhdGE7IC8vIHRoZSBrZXkgaXMgdGhlIHByb3BlcnR5IGNvbnRhaW5pbmcgdGhlIHVzZXIncyBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgdXNlcidzIGRhdGEgbG9jYWxseVxyXG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VyX2tleScsIHJlc3VsdC5rZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VyJywgSlNPTi5zdHJpbmdpZnkodXNlcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCdmYl90b2tlbicsIGZiX2FjY2Vzc190b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59Il19