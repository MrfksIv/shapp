"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var nativescript_snackbar_1 = require("nativescript-snackbar");
var ApplicationSettings = require("application-settings");
// import * as firebase from 'nativescript-plugin-firebase';
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
    // public login() {
    //     console.log("login in");
    //     console.dir(this.input);
    //     if (this.input.email && this.input.password) {
    //         firebase.login({
    //             type: firebase.LoginType.PASSWORD,
    //             passwordOptions: {
    //                 email: this.input.email,
    //                 password: this.input.password
    //             }
    //         })
    //         .then(
    //             result => {
    //                 ApplicationSettings.setBoolean("authenticated", true);
    //                 this.router.navigate(["/secure"], { clearHistory: true });
    //             },
    //             errorMessage => {
    //                 (new SnackBar()).simple("Incorrect Credentials!");
    //             }
    //         );
    //     }
    // }
    LoginComponent.prototype.login = function () {
        if (this.input.email && this.input.password) {
            var account = JSON.parse(ApplicationSettings.getString("account", "{}"));
            if (this.input.email == account.email && this.input.password == account.password) {
                ApplicationSettings.setBoolean("authenticated", true);
                this.router.navigate(["/secure"], { clearHistory: true });
            }
            else {
                (new nativescript_snackbar_1.SnackBar()).simple("Incorrect Credentials!");
            }
        }
        else {
            (new nativescript_snackbar_1.SnackBar()).simple("All Fields Required!");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELHNEQUErRDtBQUMvRCwrREFBaUQ7QUFFakQsMERBQTREO0FBQzVELDREQUE0RDtBQU81RDtJQUdJLHdCQUEyQixNQUF3QjtRQUF4QixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUMvQyxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1QsT0FBTyxFQUFFLEVBQUU7WUFDWCxVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFDO0lBQ04sQ0FBQztJQUVNLGlDQUFRLEdBQWY7UUFDSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUMsWUFBWSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztJQUNMLENBQUM7SUFFRCxxQkFBcUI7SUFDckIsK0NBQStDO0lBQy9DLHVCQUF1QjtJQUN2Qiw2Q0FBNkM7SUFDN0MsNkJBQTZCO0lBQzdCLG1HQUFtRztJQUNuRyxZQUFZO0lBQ1osU0FBUztJQUNULGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsaURBQWlEO0lBQ2pELGdGQUFnRjtJQUNoRixhQUFhO0lBQ2IsNEJBQTRCO0lBQzVCLHNEQUFzRDtJQUN0RCxxREFBcUQ7SUFDckQsWUFBWTtJQUNaLFNBQVM7SUFDVCxJQUFJO0lBRUosbUJBQW1CO0lBQ25CLCtCQUErQjtJQUMvQiwrQkFBK0I7SUFDL0IscURBQXFEO0lBRXJELDJCQUEyQjtJQUMzQixpREFBaUQ7SUFDakQsaUNBQWlDO0lBQ2pDLDJDQUEyQztJQUMzQyxnREFBZ0Q7SUFDaEQsZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsMEJBQTBCO0lBQzFCLHlFQUF5RTtJQUN6RSw2RUFBNkU7SUFDN0UsaUJBQWlCO0lBQ2pCLGdDQUFnQztJQUNoQyxxRUFBcUU7SUFDckUsZ0JBQWdCO0lBQ2hCLGFBQWE7SUFFYixRQUFRO0lBRVIsSUFBSTtJQUVHLDhCQUFLLEdBQVo7UUFDSSxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDekUsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDOUUsbUJBQW1CLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzlELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixDQUFDLElBQUksZ0NBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDdEQsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLENBQUMsSUFBSSxnQ0FBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNwRCxDQUFDO0lBQ0wsQ0FBQztJQTFFUSxjQUFjO1FBTDFCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsV0FBVyxFQUFFLHNCQUFzQjtTQUN0QyxDQUFDO3lDQUlxQyx5QkFBZ0I7T0FIMUMsY0FBYyxDQTJFMUI7SUFBRCxxQkFBQztDQUFBLEFBM0VELElBMkVDO0FBM0VZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IFNuYWNrQmFyIH0gZnJvbSAnbmF0aXZlc2NyaXB0LXNuYWNrYmFyJztcclxuXHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSAnYXBwbGljYXRpb24tc2V0dGluZ3MnO1xyXG4vLyBpbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tICduYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICAgIHNlbGVjdG9yOiAnbnMtbG9naW4nLFxyXG4gICAgdGVtcGxhdGVVcmw6ICdsb2dpbi5jb21wb25lbnQuaHRtbCcgXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMb2dpbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgcHVibGljIGlucHV0OiBhbnk7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXI6IFJvdXRlckV4dGVuc2lvbnMpIHtcclxuICAgICAgICB0aGlzLmlucHV0ID0ge1xyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiXCIsXHJcbiAgICAgICAgICAgIFwicGFzc3dvcmRcIjogXCJcIlxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJhdXRoZW50aWNhdGVkXCIsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy9zZWN1cmUnXSwge2NsZWFySGlzdG9yeTogdHJ1ZX0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgbG9naW5GQigpIHtcclxuICAgIC8vICAgICBjb25zb2xlLmxvZyhcImxvZ2dpbiBpbiB3aXRoIEZBQ0VCT09LIVwiKTtcclxuICAgIC8vICAgICBmaXJlYmFzZS5sb2dpbih7XHJcbiAgICAvLyAgICAgICAgIHR5cGU6IGZpcmViYXNlLkxvZ2luVHlwZS5GQUNFQk9PSyxcclxuICAgIC8vICAgICAgICAgZmFjZWJvb2tPcHRpb25zOiB7XHJcbiAgICAvLyAgICAgICAgICAgICBzY29wZTogWydwdWJsaWNfcHJvZmlsZScsICdlbWFpbCcsICd1c2VyX2Jpcmh0ZGF5JywgJ3VzZXJfZnJpZW5kcycsICd1c2VyX2xvY2F0aW9uJ11cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0pXHJcbiAgICAvLyAgICAgLnRoZW4oXHJcbiAgICAvLyAgICAgICAgIHJlc3VsdCA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZCIFJFU1VMVDpcIiwgcmVzdWx0KTtcclxuICAgIC8vICAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiU3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbiB3aXRoIEZhY2Vib29rIVwiKTtcclxuICAgIC8vICAgICAgICAgfSxcclxuICAgIC8vICAgICAgICAgZXJyb3JNZXNzYWdlID0+IHtcclxuICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRkIgRVJST1I6XCIsIGVycm9yTWVzc2FnZSk7XHJcbiAgICAvLyAgICAgICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShlcnJvck1lc3NhZ2UpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgbG9naW4oKSB7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJsb2dpbiBpblwiKTtcclxuICAgIC8vICAgICBjb25zb2xlLmRpcih0aGlzLmlucHV0KTtcclxuICAgIC8vICAgICBpZiAodGhpcy5pbnB1dC5lbWFpbCAmJiB0aGlzLmlucHV0LnBhc3N3b3JkKSB7XHJcblxyXG4gICAgLy8gICAgICAgICBmaXJlYmFzZS5sb2dpbih7XHJcbiAgICAvLyAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5Mb2dpblR5cGUuUEFTU1dPUkQsXHJcbiAgICAvLyAgICAgICAgICAgICBwYXNzd29yZE9wdGlvbnM6IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBlbWFpbDogdGhpcy5pbnB1dC5lbWFpbCxcclxuICAgIC8vICAgICAgICAgICAgICAgICBwYXNzd29yZDogdGhpcy5pbnB1dC5wYXNzd29yZFxyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9KVxyXG4gICAgLy8gICAgICAgICAudGhlbihcclxuICAgIC8vICAgICAgICAgICAgIHJlc3VsdCA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCB0cnVlKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VjdXJlXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgIC8vICAgICAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiSW5jb3JyZWN0IENyZWRlbnRpYWxzIVwiKTtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgKTtcclxuXHJcbiAgICAvLyAgICAgfVxyXG5cclxuICAgIC8vIH1cclxuXHJcbiAgICBwdWJsaWMgbG9naW4oKSB7XHJcbiAgICAgICAgaWYodGhpcy5pbnB1dC5lbWFpbCAmJiB0aGlzLmlucHV0LnBhc3N3b3JkKSB7XHJcbiAgICAgICAgICAgIGxldCBhY2NvdW50ID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcImFjY291bnRcIiwgXCJ7fVwiKSk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaW5wdXQuZW1haWwgPT0gYWNjb3VudC5lbWFpbCAmJiB0aGlzLmlucHV0LnBhc3N3b3JkID09IGFjY291bnQucGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImF1dGhlbnRpY2F0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VjdXJlXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiSW5jb3JyZWN0IENyZWRlbnRpYWxzIVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiQWxsIEZpZWxkcyBSZXF1aXJlZCFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19