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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELHNEQUErRDtBQUMvRCwrREFBaUQ7QUFFakQsMERBQTREO0FBQzVELHVEQUF5RDtBQUd6RCxtREFBaUQ7QUFDakQsZ0VBQThEO0FBTzlEO0lBR0ksd0JBQTJCLE1BQXdCLEVBQVUsSUFBaUIsRUFBVSxPQUF1QjtRQUFwRixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQWE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUMzRyxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1QsT0FBTyxFQUFFLEVBQUU7WUFDWCxVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFDO0lBQ04sQ0FBQztJQUVNLGlDQUFRLEdBQWY7UUFDSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUMsWUFBWSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztJQUNMLENBQUM7SUFFTSw4QkFBSyxHQUFaO1FBQUEsaUJBd0VDO1FBdkVHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRTFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQ1gsSUFBSSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUTtnQkFDakMsZUFBZSxFQUFFO29CQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFD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QUM7Z0JBQzVELHFCQUFxQjtnQkFDckIsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUM3RCxDQUFDLENBQ0YsQ0FBQztRQUVWLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQWxUUSxjQUFjO1FBTDFCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsV0FBVyxFQUFFLHNCQUFzQjtTQUN0QyxDQUFDO3lDQUlxQyx5QkFBZ0IsRUFBZ0IsMEJBQVcsRUFBbUIsZ0NBQWM7T0FIdEcsY0FBYyxDQW1UMUI7SUFBRCxxQkFBQztDQUFBLEFBblRELElBbVRDO0FBblRZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IFNuYWNrQmFyIH0gZnJvbSAnbmF0aXZlc2NyaXB0LXNuYWNrYmFyJztcclxuXHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSAnYXBwbGljYXRpb24tc2V0dGluZ3MnO1xyXG5pbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tICduYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlJztcclxuaW1wb3J0ICogYXMgdG5zT0F1dGhNb2R1bGUgZnJvbSAnbmF0aXZlc2NyaXB0LW9hdXRoJztcclxuXHJcbmltcG9ydCB7IEh0dHBTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vaHR0cC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXBwRGF0YVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2FwcGRhdGEuc2VydmljZVwiO1xyXG4gXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICAgIHNlbGVjdG9yOiAnbnMtbG9naW4nLFxyXG4gICAgdGVtcGxhdGVVcmw6ICdsb2dpbi5jb21wb25lbnQuaHRtbCcgXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMb2dpbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgcHVibGljIGlucHV0OiBhbnk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXI6IFJvdXRlckV4dGVuc2lvbnMsIHByaXZhdGUgaHR0cDogSHR0cFNlcnZpY2UsIHByaXZhdGUgYXBwRGF0YTogQXBwRGF0YVNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLmlucHV0ID0ge1xyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiXCIsXHJcbiAgICAgICAgICAgIFwicGFzc3dvcmRcIjogXCJcIlxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJhdXRoZW50aWNhdGVkXCIsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy9zZWN1cmUnXSwge2NsZWFySGlzdG9yeTogdHJ1ZX0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9naW4oKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2dpbiBpblwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW5wdXQuZW1haWwgJiYgdGhpcy5pbnB1dC5wYXNzd29yZCkge1xyXG5cclxuICAgICAgICAgICAgZmlyZWJhc2UubG9naW4oe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuTG9naW5UeXBlLlBBU1NXT1JELFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmRPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IHRoaXMuaW5wdXQuZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHRoaXMuaW5wdXQucGFzc3dvcmRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcmViYXNlLnF1ZXJ5KCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyZWJhc2VfcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRklSRUJBU0UgUkVTVUxUOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmlyZWJhc2VfcmVzdWx0Wyd2YWx1ZSddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTiBJRiBjaGVja0lmVXNlckV4aXN0c1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgY29kZSBmb3Igc2F2aW5nIHRoZSBkYXRhIHRvIG5ldyB1c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5jcmVhdGVOZXdVc2VyKGZiX3Jlc3VsdCwgZmJfYWNjZXNzX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTiBFTFNFXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgdXNlcl9rZXkgaW4gZmlyZWJhc2VfcmVzdWx0LnZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSB1c2VyJ3MgZGF0YSBsb2NhbGx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VyX2tleScsIHVzZXJfa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXInLCBKU09OLnN0cmluZ2lmeShmaXJlYmFzZV9yZXN1bHQudmFsdWVbdXNlcl9rZXldKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV0pXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1c2VybmFtZSA9IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsndXNlcl9uYW1lJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVtYWlsID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydlbWFpbCddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwRGF0YS51cGRhdGVVc2VyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzX2xvZ2dlZGluJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3VzZXJuYW1lJzogIGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsndXNlcl9uYW1lJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdlbWFpbCc6IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsnZW1haWwnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodXNlcm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VybmFtZScsIHVzZXJuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1haWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCdlbWFpbCcsIGVtYWlsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJy91c2VycycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbmdsZUV2ZW50OiB0cnVlLCAvLyBmb3IgY2hlY2tpbmcgaWYgdGhlIHZhbHVlIGV4aXN0cyAocmV0dXJuIHRoZSB3aG9sZSBkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJCeTogeyAvLyB0aGUgcHJvcGVydHkgaW4gZWFjaCBvZiB0aGUgb2JqZWN0cyBpbiB3aGljaCB0byBwZXJmb3JtIHRoZSBxdWVyeSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeU9yZGVyQnlUeXBlLkNISUxELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAndWlkJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7IC8vIHRoZSBjb21wYXJpc29uIG9wZXJhdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlSYW5nZVR5cGUuRVFVQUxfVE8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC51aWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdDogeyAvLyBsaW1pdCB0byBvbmx5IHJldHVybiB0aGUgZmlyc3QgcmVzdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlMaW1pdFR5cGUuRklSU1QsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImF1dGhlbnRpY2F0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NlY3VyZVwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShcIkluY29ycmVjdCBDcmVkZW50aWFscyFcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkb0xvZ2luQnlHb29nbGUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2dnaW4gaW4gd2l0aCBHT09HTEUhXCIpO1xyXG4gICAgICAgIGZpcmViYXNlLmxvZ2luKHtcclxuICAgICAgICAgICAgLy8gbm90ZSB0aGF0IHlvdSBuZWVkIHRvIGVuYWJsZSBHb29nbGUgYXV0aCBpbiB5b3VyIGZpcmViYXNlIGluc3RhbmNlXHJcbiAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLkxvZ2luVHlwZS5HT09HTEVcclxuICAgICAgICB9KS50aGVuKFxyXG4gICAgICAgICAgICByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHT09HTEUgQVVUSCBSRVNVTFQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kaXIocmVzdWx0KVxyXG5cclxuICAgICAgICAgICAgICAgIGZpcmViYXNlLnF1ZXJ5KCBcclxuICAgICAgICAgICAgICAgICAgICBmaXJlYmFzZV9yZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdPT0dMRSBGSVJFQkFTRSBSRVNVTFQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmlyZWJhc2VfcmVzdWx0Wyd2YWx1ZSddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIElGIGNoZWNrSWZVc2VyRXhpc3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXJfZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndWlkJzogcmVzdWx0LnVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndXNlcl9uYW1lJzogcmVzdWx0Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Byb2ZpbGVfcGhvdG8nOiByZXN1bHQucHJvZmlsZUltYWdlVVJMLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdlbWFpbCc6IHJlc3VsdC5lbWFpbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcmViYXNlLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJy91c2VycycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9kYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXNlciA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcltyZXN1bHQua2V5XSA9IHVzZXJfZGF0YTsgLy8gdGhlIGtleSBpcyB0aGUgcHJvcGVydHkgY29udGFpbmluZyB0aGUgdXNlcidzIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHVzZXIncyBkYXRhIGxvY2FsbHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VyX2tleScsIHJlc3VsdC5rZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXInLCBKU09OLnN0cmluZ2lmeSh1c2VyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcih1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwRGF0YS51cGRhdGVVc2VyKHVzZXJfZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgY29kZSBmb3Igc2F2aW5nIHRoZSBkYXRhIHRvIG5ldyB1c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNyZWF0ZU5ld1VzZXIoZmJfcmVzdWx0LCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTiBFTFNFXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciB1c2VyX2tleSBpbiBmaXJlYmFzZV9yZXN1bHQudmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgdXNlcidzIGRhdGEgbG9jYWxseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VyX2tleScsIHVzZXJfa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcicsIEpTT04uc3RyaW5naWZ5KGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQudmFsdWVbdXNlcl9rZXldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXSlcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1c2VybmFtZSA9IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsndXNlcl9uYW1lJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW1haWwgPSBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ2VtYWlsJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwRGF0YS51cGRhdGVVc2VyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNfbG9nZ2VkaW4nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1c2VybmFtZSc6ICBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ3VzZXJfbmFtZSddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdlbWFpbCc6IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsnZW1haWwnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJuYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VybmFtZScsIHVzZXJuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWFpbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygnZW1haWwnLCBlbWFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICcvdXNlcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlRXZlbnQ6IHRydWUsIC8vIGZvciBjaGVja2luZyBpZiB0aGUgdmFsdWUgZXhpc3RzIChyZXR1cm4gdGhlIHdob2xlIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyQnk6IHsgLy8gdGhlIHByb3BlcnR5IGluIGVhY2ggb2YgdGhlIG9iamVjdHMgaW4gd2hpY2ggdG8gcGVyZm9ybSB0aGUgcXVlcnkgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeU9yZGVyQnlUeXBlLkNISUxELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd1aWQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7IC8vIHRoZSBjb21wYXJpc29uIG9wZXJhdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeVJhbmdlVHlwZS5FUVVBTF9UTyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQudWlkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0OiB7IC8vIGxpbWl0IHRvIG9ubHkgcmV0dXJuIHRoZSBmaXJzdCByZXN1bHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLlF1ZXJ5TGltaXRUeXBlLkZJUlNULCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9zZWN1cmVcIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJJbmNvcnJlY3QgQ3JlZGVudGlhbHMhXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9naW5GQigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2dpbiBpbiB3aXRoIEZBQ0VCT09LIVwiKTtcclxuICAgICAgICBmaXJlYmFzZS5sb2dpbih7XHJcbiAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLkxvZ2luVHlwZS5GQUNFQk9PSyxcclxuICAgICAgICAgICAgZmFjZWJvb2tPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAvLyBzY29wZTogWydwdWJsaWNfcHJvZmlsZScsICdlbWFpbCcsICd1c2VyX2Jpcmh0ZGF5JywgJ3VzZXJfZnJpZW5kcycsICd1c2VyX2xvY2F0aW9uJ11cclxuICAgICAgICAgICAgICAgIHNjb3BlOiBbJ3B1YmxpY19wcm9maWxlJywgJ2VtYWlsJywgJ3VzZXJfZnJpZW5kcyddXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAoZmJfcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZCIFJFU1VMVDpcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihKU09OLnN0cmluZ2lmeShmYl9yZXN1bHQpKTtcclxuICAgICAgICAgICAgICAgIGxldCBmYkluZGV4ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgZmJfcmVzdWx0LnByb3ZpZGVycy5mb3JFYWNoKChlbGVtLGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbS5pZCA9IFwiZmFjZWJvb2suY29tXCIpIGZiSW5kZXggPSBpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHZhciBmYl9hY2Nlc3NfdG9rZW4gPSBmYl9yZXN1bHQucHJvdmlkZXJzW2ZiSW5kZXhdWyd0b2tlbiddO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tJZlVzZXJFeGlzdHMoZmJfcmVzdWx0LCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9zZWN1cmVcIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGQiBFUlJPUjpcIiwgZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIC8vIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKGVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tJZlVzZXJFeGlzdHMoZmJfcmVzdWx0LCBmYl9hY2Nlc3NfdG9rZW4pIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNhbGxlZCBjaGVja0lmVXNlckV4aXN0c1wiKTtcclxuICAgICAgICAvLyBjb25zb2xlLmRpcihmYl9yZXN1bHQpO1xyXG4gICAgICAgIGZpcmViYXNlLnF1ZXJ5KCBcclxuICAgICAgICAgICAgZmlyZWJhc2VfcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRklSRUJBU0UgUkVTVUxUOlwiKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdClcclxuICAgICAgICAgICAgICAgIGlmICghZmlyZWJhc2VfcmVzdWx0Wyd2YWx1ZSddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTiBJRiBjaGVja0lmVXNlckV4aXN0c1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgY29kZSBmb3Igc2F2aW5nIHRoZSBkYXRhIHRvIG5ldyB1c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOZXdVc2VyKGZiX3Jlc3VsdCwgZmJfYWNjZXNzX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTiBFTFNFXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgdXNlcl9rZXkgaW4gZmlyZWJhc2VfcmVzdWx0LnZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSB1c2VyJ3MgZGF0YSBsb2NhbGx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VyX2tleScsIHVzZXJfa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXInLCBKU09OLnN0cmluZ2lmeShmaXJlYmFzZV9yZXN1bHQudmFsdWVbdXNlcl9rZXldKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygnZmJfdG9rZW4nLCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB1c2VybmFtZSA9IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsndXNlcl9uYW1lJ107XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVtYWlsID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydlbWFpbCddO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmYklEID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydpZCddO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwRGF0YS51cGRhdGVVc2VyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2lzX2xvZ2dlZGluJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3VzZXJuYW1lJzogIGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsndXNlcl9uYW1lJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdlbWFpbCc6IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsnZW1haWwnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2ZiSUQnOiBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ2lkJ11cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmJJRClcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2ZiSUQnLCBmYklEKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlcm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VybmFtZScsIHVzZXJuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZW1haWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCdlbWFpbCcsIGVtYWlsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJy91c2VycycsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNpbmdsZUV2ZW50OiB0cnVlLCAvLyBmb3IgY2hlY2tpbmcgaWYgdGhlIHZhbHVlIGV4aXN0cyAocmV0dXJuIHRoZSB3aG9sZSBkYXRhKVxyXG4gICAgICAgICAgICAgICAgb3JkZXJCeTogeyAvLyB0aGUgcHJvcGVydHkgaW4gZWFjaCBvZiB0aGUgb2JqZWN0cyBpbiB3aGljaCB0byBwZXJmb3JtIHRoZSBxdWVyeSBcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeU9yZGVyQnlUeXBlLkNISUxELFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAndWlkJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJhbmdlOiB7IC8vIHRoZSBjb21wYXJpc29uIG9wZXJhdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlSYW5nZVR5cGUuRVFVQUxfVE8sXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZiX3Jlc3VsdC51aWRcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogeyAvLyBsaW1pdCB0byBvbmx5IHJldHVybiB0aGUgZmlyc3QgcmVzdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlMaW1pdFR5cGUuRklSU1QsIFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAxXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlTmV3VXNlcihmYl9yZXN1bHQsIGZiX2FjY2Vzc190b2tlbikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjYWxsZWQgY3JlYXRlTmV3VXNlcicpO1xyXG4gICAgICAgIHZhciB1c2VyX2RhdGEgPSB7XHJcbiAgICAgICAgICAgICd1aWQnOiBmYl9yZXN1bHQudWlkLFxyXG4gICAgICAgICAgICAndXNlcl9uYW1lJzogZmJfcmVzdWx0Lm5hbWUsXHJcbiAgICAgICAgICAgICdwcm9maWxlX3Bob3RvJzogZmJfcmVzdWx0LnByb2ZpbGVJbWFnZVVSTCxcclxuICAgICAgICAgICAgJ2VtYWlsJzogZmJfcmVzdWx0LmVtYWlsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBEYXRhLnVwZGF0ZVVzZXIoe1xyXG4gICAgICAgICAgICAndXNlcm5hbWUnOiAgZmJfcmVzdWx0WyduYW1lJ10sXHJcbiAgICAgICAgICAgICdlbWFpbCc6ZmJfcmVzdWx0WydlbWFpbCddXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5odHRwLmdldEZhY2VCb29rVXNlckluZm8oZmJfYWNjZXNzX3Rva2VuKS5zdWJzY3JpYmUoIChyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vICBjb25zb2xlLmRpcihyKTtcclxuICAgICAgICAgICAgICAgIHVzZXJfZGF0YVsnaWQnXSA9IHIuaWQ7IC8vIGZhY2Vib29rIHVzZXIgSUQgZm9yIHRoaXMgc3BlY2lmaWMgYXBwXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImZhY2Vib29rIGFuc3dlclwiKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKHIpO1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIG5ldyB1c2VyXHJcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAnL3VzZXJzJyxcclxuICAgICAgICAgICAgICAgICAgdXNlcl9kYXRhXHJcbiAgICAgICAgICAgICAgICApLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXIgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyW3Jlc3VsdC5rZXldID0gdXNlcl9kYXRhOyAvLyB0aGUga2V5IGlzIHRoZSBwcm9wZXJ0eSBjb250YWluaW5nIHRoZSB1c2VyJ3MgZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHVzZXIncyBkYXRhIGxvY2FsbHlcclxuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcl9rZXknLCByZXN1bHQua2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcicsIEpTT04uc3RyaW5naWZ5KHVzZXIpKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcih1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygnZmJfdG9rZW4nLCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdfQ==