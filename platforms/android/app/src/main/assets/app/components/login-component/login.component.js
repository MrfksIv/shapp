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
            // console.dir(fb_result);
            var fb_access_token = fb_result.providers[1]['token'];
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
        console.log("called checkIfUserExists");
        console.dir(fb_result);
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
            'profile_photo': fb_result.profileImageURL
        };
        this.appData.updateUser({
            'username': fb_result['name'],
            'email': fb_result['email']
        });
        this.http.getFaceBookUserInfo(fb_access_token).subscribe(function (r) {
            console.dir(r);
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
    LoginComponent.prototype.login = function () {
        var _this = this;
        console.log("login in");
        console.dir(this.input);
        if (this.input.email && this.input.password) {
            firebase.login({
                type: firebase.LoginType.PASSWORD,
                passwordOptions: {
                    email: this.input.email,
                    password: this.input.password
                }
            })
                .then(function (result) {
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
            ApplicationSettings.setBoolean("authenticated", true);
            _this.router.navigate(["/secure"], { clearHistory: true });
        }, function (errorMessage) {
            (new nativescript_snackbar_1.SnackBar()).simple("Incorrect Credentials!");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELHNEQUErRDtBQUMvRCwrREFBaUQ7QUFFakQsMERBQTREO0FBQzVELHVEQUF5RDtBQUd6RCxtREFBaUQ7QUFDakQsZ0VBQThEO0FBTzlEO0lBR0ksd0JBQTJCLE1BQXdCLEVBQVUsSUFBaUIsRUFBVSxPQUF1QjtRQUFwRixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQWE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUMzRyxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1QsT0FBTyxFQUFFLEVBQUU7WUFDWCxVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFDO0lBQ04sQ0FBQztJQUVNLGlDQUFRLEdBQWY7UUFDSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUMsWUFBWSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztJQUNMLENBQUM7SUFFTSxnQ0FBTyxHQUFkO1FBQUEsaUJBd0JDO1FBdkJHLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUN4QyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQ1gsSUFBSSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUTtZQUNqQyxlQUFlLEVBQUU7Z0JBQ2IsdUZBQXVGO2dCQUN2RixLQUFLLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsY0FBYyxDQUFDO2FBQ3JEO1NBQ0osQ0FBQzthQUNELElBQUksQ0FDRCxVQUFDLFNBQVM7WUFDTixPQUFPLENBQUMsR0FB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QUFNO1NBQ2xDLENBQUMsQ0FBQyxJQUFJLENBQ0gsVUFBQSxNQUFNO1lBQ0YsbUJBQW1CLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0RCxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDOUQsQ0FBQyxFQUNELFVBQUEsWUFBWTtZQUNSLENBQUMsSUFBSSxnQ0FBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQ0osQ0FBQztJQUNKLENBQUM7SUFqTE0sY0FBYztRQUwxQixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFdBQVcsRUFBRSxzQkFBc0I7U0FDdEMsQ0FBQzt5Q0FJcUMseUJBQWdCLEVBQWdCLDBCQUFXLEVBQW1CLGdDQUFjO09BSHRHLGNBQWMsQ0FpTTFCO0lBQUQscUJBQUM7Q0FBQSxBQWpNRCxJQWlNQztBQWpNWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBTbmFja0JhciB9IGZyb20gJ25hdGl2ZXNjcmlwdC1zbmFja2Jhcic7XHJcblxyXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gJ2FwcGxpY2F0aW9uLXNldHRpbmdzJztcclxuaW1wb3J0ICogYXMgZmlyZWJhc2UgZnJvbSAnbmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZSc7XHJcbmltcG9ydCAqIGFzIHRuc09BdXRoTW9kdWxlIGZyb20gJ25hdGl2ZXNjcmlwdC1vYXV0aCc7XHJcblxyXG5pbXBvcnQgeyBIdHRwU2VydmljZSB9IGZyb20gJy4uLy4uL2h0dHAuc2VydmljZSc7XHJcbmltcG9ydCB7IEFwcERhdGFTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9hcHBkYXRhLnNlcnZpY2VcIjtcclxuIFxyXG5AQ29tcG9uZW50KHtcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICBzZWxlY3RvcjogJ25zLWxvZ2luJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnbG9naW4uY29tcG9uZW50Lmh0bWwnIFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTG9naW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICAgIHB1YmxpYyBpbnB1dDogYW55O1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLCBwcml2YXRlIGh0dHA6IEh0dHBTZXJ2aWNlLCBwcml2YXRlIGFwcERhdGE6IEFwcERhdGFTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IHtcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcIlwiLFxyXG4gICAgICAgICAgICBcInBhc3N3b3JkXCI6IFwiXCJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcclxuICAgICAgICBpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCBmYWxzZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvc2VjdXJlJ10sIHtjbGVhckhpc3Rvcnk6IHRydWV9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvZ2luRkIoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2dnaW4gaW4gd2l0aCBGQUNFQk9PSyFcIik7XHJcbiAgICAgICAgZmlyZWJhc2UubG9naW4oe1xyXG4gICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5Mb2dpblR5cGUuRkFDRUJPT0ssXHJcbiAgICAgICAgICAgIGZhY2Vib29rT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgLy8gc2NvcGU6IFsncHVibGljX3Byb2ZpbGUnLCAnZW1haWwnLCAndXNlcl9iaXJodGRheScsICd1c2VyX2ZyaWVuZHMnLCAndXNlcl9sb2NhdGlvbiddXHJcbiAgICAgICAgICAgICAgICBzY29wZTogWydwdWJsaWNfcHJvZmlsZScsICdlbWFpbCcsICd1c2VyX2ZyaWVuZHMnXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgKGZiX3Jlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGQiBSRVNVTFQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIoZmJfcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIHZhciBmYl9hY2Nlc3NfdG9rZW4gPSBmYl9yZXN1bHQucHJvdmlkZXJzWzFdWyd0b2tlbiddO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tJZlVzZXJFeGlzdHMoZmJfcmVzdWx0LCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9zZWN1cmVcIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGQiBFUlJPUjpcIiwgZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIC8vIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKGVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tJZlVzZXJFeGlzdHMoZmJfcmVzdWx0LCBmYl9hY2Nlc3NfdG9rZW4pIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxlZCBjaGVja0lmVXNlckV4aXN0c1wiKTtcclxuICAgICAgICBjb25zb2xlLmRpcihmYl9yZXN1bHQpO1xyXG4gICAgICAgIGZpcmViYXNlLnF1ZXJ5KCBcclxuICAgICAgICAgICAgZmlyZWJhc2VfcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRklSRUJBU0UgUkVTVUxUOlwiKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdClcclxuICAgICAgICAgICAgICAgIGlmICghZmlyZWJhc2VfcmVzdWx0Wyd2YWx1ZSddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTiBJRiBjaGVja0lmVXNlckV4aXN0c1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgY29kZSBmb3Igc2F2aW5nIHRoZSBkYXRhIHRvIG5ldyB1c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOZXdVc2VyKGZiX3Jlc3VsdCwgZmJfYWNjZXNzX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTiBFTFNFXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgdXNlcl9rZXkgaW4gZmlyZWJhc2VfcmVzdWx0LnZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSB1c2VyJ3MgZGF0YSBsb2NhbGx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VyX2tleScsIHVzZXJfa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXInLCBKU09OLnN0cmluZ2lmeShmaXJlYmFzZV9yZXN1bHQudmFsdWVbdXNlcl9rZXldKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdC52YWx1ZVt1c2VyX2tleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygnZmJfdG9rZW4nLCBmYl9hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB1c2VybmFtZSA9IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsndXNlcl9uYW1lJ107XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVtYWlsID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydlbWFpbCddO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmYklEID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW09iamVjdC5rZXlzKGZpcmViYXNlX3Jlc3VsdC52YWx1ZSlbMF1dWydpZCddO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwRGF0YS51cGRhdGVVc2VyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2lzX2xvZ2dlZGluJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3VzZXJuYW1lJzogIGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsndXNlcl9uYW1lJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdlbWFpbCc6IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtPYmplY3Qua2V5cyhmaXJlYmFzZV9yZXN1bHQudmFsdWUpWzBdXVsnZW1haWwnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2ZiSUQnOiBmaXJlYmFzZV9yZXN1bHQudmFsdWVbT2JqZWN0LmtleXMoZmlyZWJhc2VfcmVzdWx0LnZhbHVlKVswXV1bJ2lkJ11cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmJJRClcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2ZiSUQnLCBmYklEKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlcm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VybmFtZScsIHVzZXJuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZW1haWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCdlbWFpbCcsIGVtYWlsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJy91c2VycycsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNpbmdsZUV2ZW50OiB0cnVlLCAvLyBmb3IgY2hlY2tpbmcgaWYgdGhlIHZhbHVlIGV4aXN0cyAocmV0dXJuIHRoZSB3aG9sZSBkYXRhKVxyXG4gICAgICAgICAgICAgICAgb3JkZXJCeTogeyAvLyB0aGUgcHJvcGVydHkgaW4gZWFjaCBvZiB0aGUgb2JqZWN0cyBpbiB3aGljaCB0byBwZXJmb3JtIHRoZSBxdWVyeSBcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeU9yZGVyQnlUeXBlLkNISUxELFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAndWlkJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJhbmdlOiB7IC8vIHRoZSBjb21wYXJpc29uIG9wZXJhdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlSYW5nZVR5cGUuRVFVQUxfVE8sXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZiX3Jlc3VsdC51aWRcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogeyAvLyBsaW1pdCB0byBvbmx5IHJldHVybiB0aGUgZmlyc3QgcmVzdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlMaW1pdFR5cGUuRklSU1QsIFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAxXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlTmV3VXNlcihmYl9yZXN1bHQsIGZiX2FjY2Vzc190b2tlbikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjYWxsZWQgY3JlYXRlTmV3VXNlcicpO1xyXG4gICAgICAgIHZhciB1c2VyX2RhdGEgPSB7XHJcbiAgICAgICAgICAgICd1aWQnOiBmYl9yZXN1bHQudWlkLFxyXG4gICAgICAgICAgICAndXNlcl9uYW1lJzogZmJfcmVzdWx0Lm5hbWUsXHJcbiAgICAgICAgICAgICdwcm9maWxlX3Bob3RvJzogZmJfcmVzdWx0LnByb2ZpbGVJbWFnZVVSTFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYXBwRGF0YS51cGRhdGVVc2VyKHtcclxuICAgICAgICAgICAgJ3VzZXJuYW1lJzogIGZiX3Jlc3VsdFsnbmFtZSddLFxyXG4gICAgICAgICAgICAnZW1haWwnOmZiX3Jlc3VsdFsnZW1haWwnXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaHR0cC5nZXRGYWNlQm9va1VzZXJJbmZvKGZiX2FjY2Vzc190b2tlbikuc3Vic2NyaWJlKCAocjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIocik7XHJcbiAgICAgICAgICAgICAgICB1c2VyX2RhdGFbJ2lkJ10gPSByLmlkOyAvLyBmYWNlYm9vayB1c2VyIElEIGZvciB0aGlzIHNwZWNpZmljIGFwcFxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJmYWNlYm9vayBhbnN3ZXJcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcihyKTtcclxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBuZXcgdXNlclxyXG4gICAgICAgICAgICAgICAgZmlyZWJhc2UucHVzaChcclxuICAgICAgICAgICAgICAgICAgJy91c2VycycsXHJcbiAgICAgICAgICAgICAgICAgIHVzZXJfZGF0YVxyXG4gICAgICAgICAgICAgICAgKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1c2VyID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcltyZXN1bHQua2V5XSA9IHVzZXJfZGF0YTsgLy8gdGhlIGtleSBpcyB0aGUgcHJvcGVydHkgY29udGFpbmluZyB0aGUgdXNlcidzIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSB1c2VyJ3MgZGF0YSBsb2NhbGx5XHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXJfa2V5JywgcmVzdWx0LmtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3VzZXInLCBKU09OLnN0cmluZ2lmeSh1c2VyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIodXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2ZiX3Rva2VuJywgZmJfYWNjZXNzX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvZ2luKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibG9naW4gaW5cIik7XHJcbiAgICAgICAgY29uc29sZS5kaXIodGhpcy5pbnB1dCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5wdXQuZW1haWwgJiYgdGhpcy5pbnB1dC5wYXNzd29yZCkge1xyXG5cclxuICAgICAgICAgICAgZmlyZWJhc2UubG9naW4oe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuTG9naW5UeXBlLlBBU1NXT1JELFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmRPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IHRoaXMuaW5wdXQuZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHRoaXMuaW5wdXQucGFzc3dvcmRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImF1dGhlbnRpY2F0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NlY3VyZVwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShcIkluY29ycmVjdCBDcmVkZW50aWFscyFcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkb0xvZ2luQnlHb29nbGUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2dnaW4gaW4gd2l0aCBHT09HTEUhXCIpO1xyXG4gICAgICAgIGZpcmViYXNlLmxvZ2luKHtcclxuICAgICAgICAgICAgLy8gbm90ZSB0aGF0IHlvdSBuZWVkIHRvIGVuYWJsZSBHb29nbGUgYXV0aCBpbiB5b3VyIGZpcmViYXNlIGluc3RhbmNlXHJcbiAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLkxvZ2luVHlwZS5HT09HTEVcclxuICAgICAgICB9KS50aGVuKFxyXG4gICAgICAgICAgICByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9zZWN1cmVcIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJJbmNvcnJlY3QgQ3JlZGVudGlhbHMhXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBsb2dpbigpIHtcclxuICAgIC8vICAgICBpZih0aGlzLmlucHV0LmVtYWlsICYmIHRoaXMuaW5wdXQucGFzc3dvcmQpIHtcclxuICAgIC8vICAgICAgICAgbGV0IGFjY291bnQgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiYWNjb3VudFwiLCBcInt9XCIpKTtcclxuICAgIC8vICAgICAgICAgaWYodGhpcy5pbnB1dC5lbWFpbCA9PSBhY2NvdW50LmVtYWlsICYmIHRoaXMuaW5wdXQucGFzc3dvcmQgPT0gYWNjb3VudC5wYXNzd29yZCkge1xyXG4gICAgLy8gICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCB0cnVlKTtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9zZWN1cmVcIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJJbmNvcnJlY3QgQ3JlZGVudGlhbHMhXCIpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJBbGwgRmllbGRzIFJlcXVpcmVkIVwiKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbiAgICAvLyAgXHJcbn0iXX0=