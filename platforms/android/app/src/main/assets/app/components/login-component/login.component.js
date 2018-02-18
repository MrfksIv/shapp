"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var nativescript_snackbar_1 = require("nativescript-snackbar");
var ApplicationSettings = require("application-settings");
var firebase = require("nativescript-plugin-firebase");
var tnsOAuthModule = require("nativescript-oauth");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(router) {
        this.router = router;
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
                scope: ['public_profile', 'email']
            }
        })
            .then(function (result) {
            console.log("FB RESULT:", result);
            (new nativescript_snackbar_1.SnackBar()).simple("Successfully logged in with Facebook!");
            ApplicationSettings.setBoolean("authenticated", true);
            _this.router.navigate(["/secure"], { clearHistory: true });
        }, function (errorMessage) {
            console.log("FB ERROR:", errorMessage);
            // (new SnackBar()).simple(errorMessage);
        });
    };
    LoginComponent.prototype.loginFB2 = function () {
        var _this = this;
        tnsOAuthModule.login()
            .then(function (token) {
            console.log("token:", token);
            ApplicationSettings.setBoolean("authenticated", true);
            _this.router.navigate(["/secure"], { clearHistory: true });
        })
            .catch(function (er) {
            console.log("FB2 error:");
            console.dir(er);
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
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELHNEQUErRDtBQUMvRCwrREFBaUQ7QUFFakQsMERBQTREO0FBQzVELHVEQUF5RDtBQUN6RCxtREFBcUQ7QUFPckQ7SUFHSSx3QkFBMkIsTUFBd0I7UUFBeEIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFDL0MsSUFBSSxDQUFDLEtBQUssR0FBRztZQUNULE9BQU8sRUFBRSxFQUFFO1lBQ1gsVUFBVSxFQUFFLEVBQUU7U0FDakIsQ0FBQztJQUNOLENBQUM7SUFFTSxpQ0FBUSxHQUFmO1FBQ0ksRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFDLFlBQVksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUM7SUFDTCxDQUFDO0lBRU0sZ0NBQU8sR0FBZDtRQUFBLGlCQXFCQztRQXBCRyxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDeEMsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUNYLElBQUksRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVE7WUFDakMsZUFBZSxFQUFFO2dCQUNiLHVGQUF1RjtnQkFDdkYsS0FBSyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDO2FBQ3JDO1NBQ0osQ0FBQzthQUNELElBQUksQ0FDRCxVQUFBLE1BQU07WUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNsQyxDQUFDLElBQUksZ0NBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7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YztRQUwxQixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFdBQVcsRUFBRSxzQkFBc0I7U0FDdEMsQ0FBQzt5Q0FJcUMseUJBQWdCO09BSDFDLGNBQWMsQ0F5RzFCO0lBQUQscUJBQUM7Q0FBQSxBQXpHRCxJQXlHQztBQXpHWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBTbmFja0JhciB9IGZyb20gJ25hdGl2ZXNjcmlwdC1zbmFja2Jhcic7XHJcblxyXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gJ2FwcGxpY2F0aW9uLXNldHRpbmdzJztcclxuaW1wb3J0ICogYXMgZmlyZWJhc2UgZnJvbSAnbmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZSc7XHJcbmltcG9ydCAqIGFzIHRuc09BdXRoTW9kdWxlIGZyb20gJ25hdGl2ZXNjcmlwdC1vYXV0aCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICBzZWxlY3RvcjogJ25zLWxvZ2luJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnbG9naW4uY29tcG9uZW50Lmh0bWwnIFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTG9naW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICAgIHB1YmxpYyBpbnB1dDogYW55O1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zKSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IHtcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcIlwiLFxyXG4gICAgICAgICAgICBcInBhc3N3b3JkXCI6IFwiXCJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcclxuICAgICAgICBpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCBmYWxzZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvc2VjdXJlJ10sIHtjbGVhckhpc3Rvcnk6IHRydWV9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvZ2luRkIoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2dnaW4gaW4gd2l0aCBGQUNFQk9PSyFcIik7XHJcbiAgICAgICAgZmlyZWJhc2UubG9naW4oe1xyXG4gICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5Mb2dpblR5cGUuRkFDRUJPT0ssXHJcbiAgICAgICAgICAgIGZhY2Vib29rT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgLy8gc2NvcGU6IFsncHVibGljX3Byb2ZpbGUnLCAnZW1haWwnLCAndXNlcl9iaXJodGRheScsICd1c2VyX2ZyaWVuZHMnLCAndXNlcl9sb2NhdGlvbiddXHJcbiAgICAgICAgICAgICAgICBzY29wZTogWydwdWJsaWNfcHJvZmlsZScsICdlbWFpbCddXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGQiBSRVNVTFQ6XCIsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShcIlN1Y2Nlc3NmdWxseSBsb2dnZWQgaW4gd2l0aCBGYWNlYm9vayFcIik7XHJcbiAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJhdXRoZW50aWNhdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NlY3VyZVwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZCIEVSUk9SOlwiLCBlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgLy8gKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBsb2dpbkZCMigpIHtcclxuICAgICAgICB0bnNPQXV0aE1vZHVsZS5sb2dpbigpXHJcbiAgICAgICAgLnRoZW4oKHRva2VuOnN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRva2VuOlwiLCB0b2tlbik7XHJcbiAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImF1dGhlbnRpY2F0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9zZWN1cmVcIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKCBlciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRkIyIGVycm9yOlwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5kaXIoZXIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2dpbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luIGluXCIpO1xyXG4gICAgICAgIGNvbnNvbGUuZGlyKHRoaXMuaW5wdXQpO1xyXG4gICAgICAgIGlmICh0aGlzLmlucHV0LmVtYWlsICYmIHRoaXMuaW5wdXQucGFzc3dvcmQpIHtcclxuXHJcbiAgICAgICAgICAgIGZpcmViYXNlLmxvZ2luKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IGZpcmViYXNlLkxvZ2luVHlwZS5QQVNTV09SRCxcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiB0aGlzLmlucHV0LmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiB0aGlzLmlucHV0LnBhc3N3b3JkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJhdXRoZW50aWNhdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9zZWN1cmVcIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJJbmNvcnJlY3QgQ3JlZGVudGlhbHMhXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZG9Mb2dpbkJ5R29vZ2xlKCk6IHZvaWQge1xyXG4gICAgICAgIGZpcmViYXNlLmxvZ2luKHtcclxuICAgICAgICAgIC8vIG5vdGUgdGhhdCB5b3UgbmVlZCB0byBlbmFibGUgR29vZ2xlIGF1dGggaW4geW91ciBmaXJlYmFzZSBpbnN0YW5jZVxyXG4gICAgICAgICAgdHlwZTogZmlyZWJhc2UuTG9naW5UeXBlLkdPT0dMRVxyXG4gICAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgICAgIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJhdXRoZW50aWNhdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NlY3VyZVwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShcIkluY29ycmVjdCBDcmVkZW50aWFscyFcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGxvZ2luKCkge1xyXG4gICAgLy8gICAgIGlmKHRoaXMuaW5wdXQuZW1haWwgJiYgdGhpcy5pbnB1dC5wYXNzd29yZCkge1xyXG4gICAgLy8gICAgICAgICBsZXQgYWNjb3VudCA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJhY2NvdW50XCIsIFwie31cIikpO1xyXG4gICAgLy8gICAgICAgICBpZih0aGlzLmlucHV0LmVtYWlsID09IGFjY291bnQuZW1haWwgJiYgdGhpcy5pbnB1dC5wYXNzd29yZCA9PSBhY2NvdW50LnBhc3N3b3JkKSB7XHJcbiAgICAvLyAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJhdXRoZW50aWNhdGVkXCIsIHRydWUpO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NlY3VyZVwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XHJcbiAgICAvLyAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShcIkluY29ycmVjdCBDcmVkZW50aWFscyFcIik7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShcIkFsbCBGaWVsZHMgUmVxdWlyZWQhXCIpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxufSJdfQ==