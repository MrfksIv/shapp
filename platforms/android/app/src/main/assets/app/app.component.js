"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var tnsOAuthModule = require("nativescript-oauth");
var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    AppComponent.prototype.loginFB = function () {
        tnsOAuthModule.ensureValidToken()
            .then(function (token) {
            console.log("token:", token);
        })
            .catch(function (er) {
            console.log("ERROR:", er);
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "ns-app",
            templateUrl: "app.component.html",
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsbURBQXFEO0FBT3JEO0lBQUE7SUFXQSxDQUFDO0lBVEcsOEJBQU8sR0FBUDtRQUNJLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRTthQUNoQyxJQUFJLENBQUMsVUFBQyxLQUFZO1lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFFLFVBQUEsRUFBRTtZQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQVZRLFlBQVk7UUFMeEIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFdBQVcsRUFBRSxvQkFBb0I7U0FDcEMsQ0FBQztPQUVXLFlBQVksQ0FXeEI7SUFBRCxtQkFBQztDQUFBLEFBWEQsSUFXQztBQVhZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0ICogYXMgdG5zT0F1dGhNb2R1bGUgZnJvbSAnbmF0aXZlc2NyaXB0LW9hdXRoJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6IFwibnMtYXBwXCIsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCJhcHAuY29tcG9uZW50Lmh0bWxcIixcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQgeyBcclxuXHJcbiAgICBsb2dpbkZCKCkge1xyXG4gICAgICAgIHRuc09BdXRoTW9kdWxlLmVuc3VyZVZhbGlkVG9rZW4oKVxyXG4gICAgICAgIC50aGVuKCh0b2tlbjpzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0b2tlbjpcIiwgdG9rZW4pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKCBlciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6XCIsIGVyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=