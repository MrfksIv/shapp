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
            firebase.query(function (firebase_result) {
                // console.log("FIREBASE RESULT:");
                // console.dir(firebase_result)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELHNEQUErRDtBQUMvRCwrREFBaUQ7QUFFakQsMERBQTREO0FBQzVELHVEQUF5RDtBQUd6RCxtREFBaUQ7QUFDakQsZ0VBQThEO0FBTzlEO0lBR0ksd0JBQTJCLE1BQXdCLEVBQVUsSUFBaUIsRUFBVSxPQUF1QjtRQUFwRixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQWE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUMzRyxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1QsT0FBTyxFQUFFLEVBQUU7WUFDWCxVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFDO0lBQ04sQ0FBQztJQUVNLGlDQUFRLEdBQWY7UUFDSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUMsWUFBWSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztJQUNMLENBQUM7SUFFTSw4QkFBSyxHQUFaO1FBQUEsaUJBd0VDO1FBdkVHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRTFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQ1gsSUFBSSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUTtnQkFDakMsZUFBZSxFQUFFO29CQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFD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RyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMscURBQXFEO2dCQUNuRiw0QkFBNEI7Z0JBQzVCLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN0RCxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDNUQscUJBQXFCO2dCQUNyQixtQkFBbUIsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzdELENBQUMsQ0FDRixDQUFDO1FBRVYsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBelJRLGNBQWM7UUFMMUIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsVUFBVTtZQUNwQixXQUFXLEVBQUUsc0JBQXNCO1NBQ3RDLENBQUM7eUNBSXFDLHlCQUFnQixFQUFnQiwwQkFBVyxFQUFtQixnQ0FBYztPQUh0RyxjQUFjLENBMFIxQjtJQUFELHFCQUFDO0NBQUEsQUExUkQsSUEwUkM7QUExUlksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgU25hY2tCYXIgfSBmcm9tICduYXRpdmVzY3JpcHQtc25hY2tiYXInO1xyXG5cclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tICdhcHBsaWNhdGlvbi1zZXR0aW5ncyc7XHJcbmltcG9ydCAqIGFzIGZpcmViYXNlIGZyb20gJ25hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2UnO1xyXG5pbXBvcnQgKiBhcyB0bnNPQXV0aE1vZHVsZSBmcm9tICduYXRpdmVzY3JpcHQtb2F1dGgnO1xyXG5cclxuaW1wb3J0IHsgSHR0cFNlcnZpY2UgfSBmcm9tICcuLi8uLi9odHRwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBcHBEYXRhU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvYXBwZGF0YS5zZXJ2aWNlXCI7XHJcbiBcclxuQENvbXBvbmVudCh7XHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgc2VsZWN0b3I6ICducy1sb2dpbicsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2xvZ2luLmNvbXBvbmVudC5odG1sJyBcclxufSlcclxuZXhwb3J0IGNsYXNzIExvZ2luQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBwdWJsaWMgaW5wdXQ6IGFueTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlcjogUm91dGVyRXh0ZW5zaW9ucywgcHJpdmF0ZSBodHRwOiBIdHRwU2VydmljZSwgcHJpdmF0ZSBhcHBEYXRhOiBBcHBEYXRhU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSB7XHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJcIixcclxuICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBcIlwiXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImF1dGhlbnRpY2F0ZWRcIiwgZmFsc2UpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnL3NlY3VyZSddLCB7Y2xlYXJIaXN0b3J5OiB0cnVlfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2dpbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luIGluXCIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pbnB1dC5lbWFpbCAmJiB0aGlzLmlucHV0LnBhc3N3b3JkKSB7XHJcblxyXG4gICAgICAgICAgICBmaXJlYmFzZS5sb2dpbih7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5Mb2dpblR5cGUuUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogdGhpcy5pbnB1dC5lbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogdGhpcy5pbnB1dC5wYXNzd29yZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyZWJhc2UucXVlcnkoIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJlYmFzZV9yZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGSVJFQkFTRSBSRVNVTFQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJlYmFzZV9yZXN1bHRbJ3ZhbHVlJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIElGIGNoZWNrSWZVc2VyRXhpc3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBjb2RlIGZvciBzYXZpbmcgdGhlIGRhdGEgdG8gbmV3IHVzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNyZWF0ZU5ld1VzZXIoZmJfcmVzdWx0LCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIEVMU0VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciB1c2VyX2tleSBpbiBmaXJlYmFzZV9yZXN1bHQudmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIHVzZXIncyBkYXRhIGxvY2FsbHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJfa2V5JywgdXNlcl9rZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcicsIEpTT04uc3RyaW5naWZ5KGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0LnZhbHVlW3VzZXJfa2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJuYW1lID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWyd1c2VyX25hbWUnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW1haWwgPSBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ2VtYWlsJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBEYXRhLnVwZGF0ZVVzZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNfbG9nZ2VkaW4nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndXNlcm5hbWUnOiAgZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWyd1c2VyX25hbWUnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2VtYWlsJzogZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydlbWFpbCddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VybmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJuYW1lJywgdXNlcm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWFpbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2VtYWlsJywgZW1haWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnL3VzZXJzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlRXZlbnQ6IHRydWUsIC8vIGZvciBjaGVja2luZyBpZiB0aGUgdmFsdWUgZXhpc3RzIChyZXR1cm4gdGhlIHdob2xlIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlckJ5OiB7IC8vIHRoZSBwcm9wZXJ0eSBpbiBlYWNoIG9mIHRoZSBvYmplY3RzIGluIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHF1ZXJ5IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLlF1ZXJ5T3JkZXJCeVR5cGUuQ0hJTEQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd1aWQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHsgLy8gdGhlIGNvbXBhcmlzb24gb3BlcmF0b3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeVJhbmdlVHlwZS5FUVVBTF9UTyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnVpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0OiB7IC8vIGxpbWl0IHRvIG9ubHkgcmV0dXJuIHRoZSBmaXJzdCByZXN1bHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeUxpbWl0VHlwZS5GSVJTVCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VjdXJlXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiSW5jb3JyZWN0IENyZWRlbnRpYWxzIVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRvTG9naW5CeUdvb2dsZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2dpbiBpbiB3aXRoIEdPT0dMRSFcIik7XHJcbiAgICAgICAgZmlyZWJhc2UubG9naW4oe1xyXG4gICAgICAgICAgICAvLyBub3RlIHRoYXQgeW91IG5lZWQgdG8gZW5hYmxlIEdvb2dsZSBhdXRoIGluIHlvdXIgZmlyZWJhc2UgaW5zdGFuY2VcclxuICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuTG9naW5UeXBlLkdPT0dMRVxyXG4gICAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgICAgIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5xdWVyeSggXHJcbiAgICAgICAgICAgICAgICAgICAgZmlyZWJhc2VfcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJGSVJFQkFTRSBSRVNVTFQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmlyZWJhc2VfcmVzdWx0Wyd2YWx1ZSddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIElGIGNoZWNrSWZVc2VyRXhpc3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGNvZGUgZm9yIHNhdmluZyB0aGUgZGF0YSB0byBuZXcgdXNlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5jcmVhdGVOZXdVc2VyKGZiX3Jlc3VsdCwgZmJfYWNjZXNzX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSU4gRUxTRVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgdXNlcl9rZXkgaW4gZmlyZWJhc2VfcmVzdWx0LnZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIHVzZXIncyBkYXRhIGxvY2FsbHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcl9rZXknLCB1c2VyX2tleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXInLCBKU09OLnN0cmluZ2lmeShmaXJlYmFzZV9yZXN1bHQudmFsdWVbdXNlcl9rZXldKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0LnZhbHVlW3VzZXJfa2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV0pXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXNlcm5hbWUgPSBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ3VzZXJfbmFtZSddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVtYWlsID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydlbWFpbCddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcERhdGEudXBkYXRlVXNlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzX2xvZ2dlZGluJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndXNlcm5hbWUnOiAgZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWyd1c2VyX25hbWUnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZW1haWwnOiBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ2VtYWlsJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VybmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcm5hbWUnLCB1c2VybmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1haWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2VtYWlsJywgZW1haWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnL3VzZXJzJyxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbmdsZUV2ZW50OiB0cnVlLCAvLyBmb3IgY2hlY2tpbmcgaWYgdGhlIHZhbHVlIGV4aXN0cyAocmV0dXJuIHRoZSB3aG9sZSBkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlckJ5OiB7IC8vIHRoZSBwcm9wZXJ0eSBpbiBlYWNoIG9mIHRoZSBvYmplY3RzIGluIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHF1ZXJ5IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlPcmRlckJ5VHlwZS5DSElMRCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAndWlkJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZTogeyAvLyB0aGUgY29tcGFyaXNvbiBvcGVyYXRvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlSYW5nZVR5cGUuRVFVQUxfVE8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnVpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdDogeyAvLyBsaW1pdCB0byBvbmx5IHJldHVybiB0aGUgZmlyc3QgcmVzdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeUxpbWl0VHlwZS5GSVJTVCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImF1dGhlbnRpY2F0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VjdXJlXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0+IHtcclxuICAgICAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiSW5jb3JyZWN0IENyZWRlbnRpYWxzIVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvZ2luRkIoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2dnaW4gaW4gd2l0aCBGQUNFQk9PSyFcIik7XHJcbiAgICAgICAgZmlyZWJhc2UubG9naW4oe1xyXG4gICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5Mb2dpblR5cGUuRkFDRUJPT0ssXHJcbiAgICAgICAgICAgIGZhY2Vib29rT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgLy8gc2NvcGU6IFsncHVibGljX3Byb2ZpbGUnLCAnZW1haWwnLCAndXNlcl9iaXJodGRheScsICd1c2VyX2ZyaWVuZHMnLCAndXNlcl9sb2NhdGlvbiddXHJcbiAgICAgICAgICAgICAgICBzY29wZTogWydwdWJsaWNfcHJvZmlsZScsICdlbWFpbCcsICd1c2VyX2ZyaWVuZHMnXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgKGZiX3Jlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGQiBSRVNVTFQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kaXIoSlNPTi5zdHJpbmdpZnkoZmJfcmVzdWx0KSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmJJbmRleCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGZiX3Jlc3VsdC5wcm92aWRlcnMuZm9yRWFjaCgoZWxlbSxpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW0uaWQgPSBcImZhY2Vib29rLmNvbVwiKSBmYkluZGV4ID0gaVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmJfYWNjZXNzX3Rva2VuID0gZmJfcmVzdWx0LnByb3ZpZGVyc1tmYkluZGV4XVsndG9rZW4nXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrSWZVc2VyRXhpc3RzKGZiX3Jlc3VsdCwgZmJfYWNjZXNzX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImF1dGhlbnRpY2F0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VjdXJlXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRkIgRVJST1I6XCIsIGVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAvLyAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrSWZVc2VyRXhpc3RzKGZiX3Jlc3VsdCwgZmJfYWNjZXNzX3Rva2VuKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJjYWxsZWQgY2hlY2tJZlVzZXJFeGlzdHNcIik7XHJcbiAgICAgICAgLy8gY29uc29sZS5kaXIoZmJfcmVzdWx0KTtcclxuICAgICAgICBmaXJlYmFzZS5xdWVyeSggXHJcbiAgICAgICAgICAgIGZpcmViYXNlX3Jlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkZJUkVCQVNFIFJFU1VMVDpcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQpXHJcbiAgICAgICAgICAgICAgICBpZiAoIWZpcmViYXNlX3Jlc3VsdFsndmFsdWUnXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSU4gSUYgY2hlY2tJZlVzZXJFeGlzdHNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGNvZGUgZm9yIHNhdmluZyB0aGUgZGF0YSB0byBuZXcgdXNlclxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3VXNlcihmYl9yZXN1bHQsIGZiX2FjY2Vzc190b2tlbik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSU4gRUxTRVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIHVzZXJfa2V5IGluIGZpcmViYXNlX3Jlc3VsdC52YWx1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgdXNlcidzIGRhdGEgbG9jYWxseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcl9rZXknLCB1c2VyX2tleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VyJywgSlNPTi5zdHJpbmdpZnkoZmlyZWJhc2VfcmVzdWx0LnZhbHVlW3VzZXJfa2V5XSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQudmFsdWVbdXNlcl9rZXldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2ZiX3Rva2VuJywgZmJfYWNjZXNzX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXNlcm5hbWUgPSBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ3VzZXJfbmFtZSddO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbWFpbCA9IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsnZW1haWwnXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmJJRCA9IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsnaWQnXTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcERhdGEudXBkYXRlVXNlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdpc19sb2dnZWRpbic6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd1c2VybmFtZSc6ICBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ3VzZXJfbmFtZSddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZW1haWwnOiBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ2VtYWlsJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdmYklEJzogZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydpZCddXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZiSUQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCdmYklEJywgZmJJRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJuYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcm5hbWUnLCB1c2VybmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVtYWlsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygnZW1haWwnLCBlbWFpbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICcvdXNlcnMnLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzaW5nbGVFdmVudDogdHJ1ZSwgLy8gZm9yIGNoZWNraW5nIGlmIHRoZSB2YWx1ZSBleGlzdHMgKHJldHVybiB0aGUgd2hvbGUgZGF0YSlcclxuICAgICAgICAgICAgICAgIG9yZGVyQnk6IHsgLy8gdGhlIHByb3BlcnR5IGluIGVhY2ggb2YgdGhlIG9iamVjdHMgaW4gd2hpY2ggdG8gcGVyZm9ybSB0aGUgcXVlcnkgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlPcmRlckJ5VHlwZS5DSElMRCxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ3VpZCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByYW5nZTogeyAvLyB0aGUgY29tcGFyaXNvbiBvcGVyYXRvclxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLlF1ZXJ5UmFuZ2VUeXBlLkVRVUFMX1RPLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmYl9yZXN1bHQudWlkXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbGltaXQ6IHsgLy8gbGltaXQgdG8gb25seSByZXR1cm4gdGhlIGZpcnN0IHJlc3VsdFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLlF1ZXJ5TGltaXRUeXBlLkZJUlNULCBcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZU5ld1VzZXIoZmJfcmVzdWx0LCBmYl9hY2Nlc3NfdG9rZW4pIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY2FsbGVkIGNyZWF0ZU5ld1VzZXInKTtcclxuICAgICAgICB2YXIgdXNlcl9kYXRhID0ge1xyXG4gICAgICAgICAgICAndWlkJzogZmJfcmVzdWx0LnVpZCxcclxuICAgICAgICAgICAgJ3VzZXJfbmFtZSc6IGZiX3Jlc3VsdC5uYW1lLFxyXG4gICAgICAgICAgICAncHJvZmlsZV9waG90byc6IGZiX3Jlc3VsdC5wcm9maWxlSW1hZ2VVUkwsXHJcbiAgICAgICAgICAgICdlbWFpbCc6IGZiX3Jlc3VsdC5lbWFpbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYXBwRGF0YS51cGRhdGVVc2VyKHtcclxuICAgICAgICAgICAgJ3VzZXJuYW1lJzogIGZiX3Jlc3VsdFsnbmFtZSddLFxyXG4gICAgICAgICAgICAnZW1haWwnOmZiX3Jlc3VsdFsnZW1haWwnXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaHR0cC5nZXRGYWNlQm9va1VzZXJJbmZvKGZiX2FjY2Vzc190b2tlbikuc3Vic2NyaWJlKCAocjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgY29uc29sZS5kaXIocik7XHJcbiAgICAgICAgICAgICAgICB1c2VyX2RhdGFbJ2lkJ10gPSByLmlkOyAvLyBmYWNlYm9vayB1c2VyIElEIGZvciB0aGlzIHNwZWNpZmljIGFwcFxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJmYWNlYm9vayBhbnN3ZXJcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcihyKTtcclxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBuZXcgdXNlclxyXG4gICAgICAgICAgICAgICAgZmlyZWJhc2UucHVzaChcclxuICAgICAgICAgICAgICAgICAgJy91c2VycycsXHJcbiAgICAgICAgICAgICAgICAgIHVzZXJfZGF0YVxyXG4gICAgICAgICAgICAgICAgKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1c2VyID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcltyZXN1bHQua2V5XSA9IHVzZXJfZGF0YTsgLy8gdGhlIGtleSBpcyB0aGUgcHJvcGVydHkgY29udGFpbmluZyB0aGUgdXNlcidzIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSB1c2VyJ3MgZGF0YSBsb2NhbGx5XHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJfa2V5JywgcmVzdWx0LmtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXInLCBKU09OLnN0cmluZ2lmeSh1c2VyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIodXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2ZiX3Rva2VuJywgZmJfYWNjZXNzX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=