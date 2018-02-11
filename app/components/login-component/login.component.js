"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var nativescript_snackbar_1 = require("nativescript-snackbar");
var ApplicationSettings = require("application-settings");
var firebase = require("nativescript-plugin-firebase");
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
    // public loginFB() {
    //     console.log("loggin in with FACEBOOK!");
    //     firebase.login({
    //         type: firebase.LoginType.FACEBOOK,
    //         facebookOptions: {
    //             scope: ['public_profile', 'email', 'user_birhtday', 'user_friends', 'user_location']
    //         }
    //     })
    //     .then(
    //         result => {
    //             console.log("FB RESULT:", result);
    //             (new SnackBar()).simple("Successfully logged in with Facebook!");
    //         },
    //         errorMessage => {
    //             console.log("FB ERROR:", errorMessage);
    //             (new SnackBar()).simple(errorMessage);
    //         }
    //     );
    // }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELHNEQUErRDtBQUMvRCwrREFBaUQ7QUFFakQsMERBQTREO0FBQzVELHVEQUF5RDtBQU96RDtJQUdJLHdCQUEyQixNQUF3QjtRQUF4QixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUMvQyxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1QsT0FBTyxFQUFFLEVBQUU7WUFDWCxVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFDO0lBQ04sQ0FBQztJQUVNLGlDQUFRLEdBQWY7UUFDSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUMsWUFBWSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztJQUNMLENBQUM7SUFFRCxxQkFBcUI7SUFDckIsK0NBQStDO0lBQy9DLHVCQUF1QjtJQUN2Qiw2Q0FBNkM7SUFDN0MsNkJBQTZCO0lBQzdCLG1HQUFtRztJQUNuRyxZQUFZO0lBQ1osU0FBUztJQUNULGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsaURBQWlEO0lBQ2pELGdGQUFnRjtJQUNoRixhQUFhO0lBQ2IsNEJBQTRCO0lBQzVCLHNEQUFzRDtJQUN0RCxxREFBcUQ7SUFDckQsWUFBWTtJQUNaLFNBQVM7SUFDVCxJQUFJO0lBRUcsOEJBQUssR0FBWjtRQUFBLGlCQXdCQztRQXZCRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUUxQyxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUNYLElBQUksRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVE7Z0JBQ2pDLGVBQWUsRUFBRTtvQkFDYixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO29CQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO2lCQUNoQzthQUNKLENBQUM7aUJBQ0QsSUFBSSxDQUNELFVBQUEsTUFBTTtnQkFDRixtQkFBbUIsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN0RCxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDOUQsQ0FBQyxFQUNELFVBQUEsWUFBWTtnQkFDUixDQUFDLElBQUksZ0NBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUNKLENBQUM7UUFFTixDQUFDO0lBRUwsQ0FBQztJQTVEUSxjQUFjO1FBTDFCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsV0FBVyxFQUFFLHNCQUFzQjtTQUN0QyxDQUFDO3lDQUlxQyx5QkFBZ0I7T0FIMUMsY0FBYyxDQTJFMUI7SUFBRCxxQkFBQztDQUFBLEFBM0VELElBMkVDO0FBM0VZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IFNuYWNrQmFyIH0gZnJvbSAnbmF0aXZlc2NyaXB0LXNuYWNrYmFyJztcclxuXHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSAnYXBwbGljYXRpb24tc2V0dGluZ3MnO1xyXG5pbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tICduYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICAgIHNlbGVjdG9yOiAnbnMtbG9naW4nLFxyXG4gICAgdGVtcGxhdGVVcmw6ICdsb2dpbi5jb21wb25lbnQuaHRtbCcgXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMb2dpbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgcHVibGljIGlucHV0OiBhbnk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXI6IFJvdXRlckV4dGVuc2lvbnMpIHtcclxuICAgICAgICB0aGlzLmlucHV0ID0ge1xyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiXCIsXHJcbiAgICAgICAgICAgIFwicGFzc3dvcmRcIjogXCJcIlxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJhdXRoZW50aWNhdGVkXCIsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy9zZWN1cmUnXSwge2NsZWFySGlzdG9yeTogdHJ1ZX0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgbG9naW5GQigpIHtcclxuICAgIC8vICAgICBjb25zb2xlLmxvZyhcImxvZ2dpbiBpbiB3aXRoIEZBQ0VCT09LIVwiKTtcclxuICAgIC8vICAgICBmaXJlYmFzZS5sb2dpbih7XHJcbiAgICAvLyAgICAgICAgIHR5cGU6IGZpcmViYXNlLkxvZ2luVHlwZS5GQUNFQk9PSyxcclxuICAgIC8vICAgICAgICAgZmFjZWJvb2tPcHRpb25zOiB7XHJcbiAgICAvLyAgICAgICAgICAgICBzY29wZTogWydwdWJsaWNfcHJvZmlsZScsICdlbWFpbCcsICd1c2VyX2Jpcmh0ZGF5JywgJ3VzZXJfZnJpZW5kcycsICd1c2VyX2xvY2F0aW9uJ11cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0pXHJcbiAgICAvLyAgICAgLnRoZW4oXHJcbiAgICAvLyAgICAgICAgIHJlc3VsdCA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZCIFJFU1VMVDpcIiwgcmVzdWx0KTtcclxuICAgIC8vICAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiU3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbiB3aXRoIEZhY2Vib29rIVwiKTtcclxuICAgIC8vICAgICAgICAgfSxcclxuICAgIC8vICAgICAgICAgZXJyb3JNZXNzYWdlID0+IHtcclxuICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRkIgRVJST1I6XCIsIGVycm9yTWVzc2FnZSk7XHJcbiAgICAvLyAgICAgICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShlcnJvck1lc3NhZ2UpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwdWJsaWMgbG9naW4oKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2dpbiBpblwiKTtcclxuICAgICAgICBjb25zb2xlLmRpcih0aGlzLmlucHV0KTtcclxuICAgICAgICBpZiAodGhpcy5pbnB1dC5lbWFpbCAmJiB0aGlzLmlucHV0LnBhc3N3b3JkKSB7XHJcblxyXG4gICAgICAgICAgICBmaXJlYmFzZS5sb2dpbih7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5Mb2dpblR5cGUuUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogdGhpcy5pbnB1dC5lbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogdGhpcy5pbnB1dC5wYXNzd29yZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VjdXJlXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiSW5jb3JyZWN0IENyZWRlbnRpYWxzIVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgbG9naW4oKSB7XHJcbiAgICAvLyAgICAgaWYodGhpcy5pbnB1dC5lbWFpbCAmJiB0aGlzLmlucHV0LnBhc3N3b3JkKSB7XHJcbiAgICAvLyAgICAgICAgIGxldCBhY2NvdW50ID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcImFjY291bnRcIiwgXCJ7fVwiKSk7XHJcbiAgICAvLyAgICAgICAgIGlmKHRoaXMuaW5wdXQuZW1haWwgPT0gYWNjb3VudC5lbWFpbCAmJiB0aGlzLmlucHV0LnBhc3N3b3JkID09IGFjY291bnQucGFzc3dvcmQpIHtcclxuICAgIC8vICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImF1dGhlbnRpY2F0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VjdXJlXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgIC8vICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiSW5jb3JyZWN0IENyZWRlbnRpYWxzIVwiKTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiQWxsIEZpZWxkcyBSZXF1aXJlZCFcIik7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG59Il19