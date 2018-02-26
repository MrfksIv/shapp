"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var AppDataService = /** @class */ (function () {
    function AppDataService() {
        this.userInfoSubject = new Subject_1.Subject();
        this.user = {
            profile_photo: undefined,
            username: undefined,
            is_loggedin: undefined
        };
    }
    AppDataService.prototype.updateUser = function (obj) {
        for (var key in obj) {
            if (obj[key]) {
                this.user[key] = obj[key];
            }
        }
        // console.log("UPDATED USER AppDataService:")
        // console.dir(this.user)
        this.userInfoSubject.next(this.user);
    };
    AppDataService.prototype.updateInfo = function (property, value) {
        this.user[property] = value;
        this.userInfoSubject.next(this.user);
    };
    AppDataService.prototype.getUserInfo = function () {
        return this.userInfoSubject.asObservable();
    };
    AppDataService.prototype.setActiveList = function (listkey) {
        this.activeListKey = listkey;
    };
    AppDataService.prototype.getActiveList = function () {
        return this.activeListKey;
    };
    AppDataService = __decorate([
        core_1.Injectable()
    ], AppDataService);
    return AppDataService;
}());
exports.AppDataService = AppDataService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwZGF0YS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwZGF0YS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBRTNDLHdDQUFzQztBQUd0QztJQURBO1FBR1ksb0JBQWUsR0FBSSxJQUFJLGlCQUFPLEVBQU8sQ0FBQztRQUd2QyxTQUFJLEdBQUk7WUFDWCxhQUFhLEVBQUUsU0FBUztZQUN4QixRQUFRLEVBQUUsU0FBUztZQUNuQixXQUFXLEVBQUUsU0FBUztTQUN6QixDQUFBO0lBZ0NMLENBQUM7SUE5QkcsbUNBQVUsR0FBVixVQUFXLEdBQUc7UUFDVixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUM7UUFDRCw4Q0FBOEM7UUFDOUMseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsbUNBQVUsR0FBVixVQUFXLFFBQVEsRUFBRSxLQUFLO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsb0NBQVcsR0FBWDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRCxzQ0FBYSxHQUFiLFVBQWMsT0FBZTtRQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQztJQUNqQyxDQUFDO0lBRUQsc0NBQWEsR0FBYjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7SUFyQ1EsY0FBYztRQUQxQixpQkFBVSxFQUFFO09BQ0EsY0FBYyxDQXlDMUI7SUFBRCxxQkFBQztDQUFBLEFBekNELElBeUNDO0FBekNZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9PYnNlcnZhYmxlXCJcclxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gXCJyeGpzL1N1YmplY3RcIlxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXBwRGF0YVNlcnZpY2Uge1xyXG5cclxuICAgIHByaXZhdGUgdXNlckluZm9TdWJqZWN0ICA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgIHByaXZhdGUgYWN0aXZlTGlzdEtleTogc3RyaW5nO1xyXG5cclxuICAgIHB1YmxpYyB1c2VyID0gIHtcclxuICAgICAgICBwcm9maWxlX3Bob3RvOiB1bmRlZmluZWQsXHJcbiAgICAgICAgdXNlcm5hbWU6IHVuZGVmaW5lZCxcclxuICAgICAgICBpc19sb2dnZWRpbjogdW5kZWZpbmVkXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVXNlcihvYmopIHtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmpba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VyW2tleV0gPSBvYmpba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlVQREFURUQgVVNFUiBBcHBEYXRhU2VydmljZTpcIilcclxuICAgICAgICAvLyBjb25zb2xlLmRpcih0aGlzLnVzZXIpXHJcbiAgICAgICAgdGhpcy51c2VySW5mb1N1YmplY3QubmV4dCh0aGlzLnVzZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUluZm8ocHJvcGVydHksIHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy51c2VyW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXNlckluZm9TdWJqZWN0Lm5leHQodGhpcy51c2VyKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVc2VySW5mbygpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJJbmZvU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBY3RpdmVMaXN0KGxpc3RrZXk6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlTGlzdEtleSA9IGxpc3RrZXk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWN0aXZlTGlzdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVMaXN0S2V5O1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gXHJcbn0iXX0=