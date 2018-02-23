"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
var HttpService = /** @class */ (function () {
    function HttpService(http) {
        this.http = http;
        this.FB_URL = 'https://graph.facebook.com/me';
    }
    HttpService.prototype.getFaceBookUserInfo = function (token) {
        console.log("called getFaceBookUserInfo");
        return this.http.get(this.FB_URL + "?access_token=" + token).map(function (res) { return res; });
    };
    HttpService.prototype.getFacebookFriends = function (token) {
        return this.http.get(this.FB_URL + "/friends?access_token=" + token).map(function (res) { return res; });
    };
    HttpService.prototype.getFacebookProfilePic = function (token) {
    };
    HttpService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], HttpService);
    return HttpService;
}());
exports.HttpService = HttpService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaHR0cC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBRTNDLDZDQUE2RTtBQUM3RSxpQ0FBK0I7QUFDL0IsZ0NBQThCO0FBRzlCO0lBSUkscUJBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7UUFGcEMsV0FBTSxHQUFHLCtCQUErQixDQUFDO0lBRUgsQ0FBQztJQUV2Qyx5Q0FBbUIsR0FBbkIsVUFBb0IsS0FBSztRQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFJLElBQUksQ0FBQyxNQUFNLHNCQUFpQixLQUFPLENBQUMsQ0FBQyxHQUFHLENBQUUsVUFBQyxHQUFZLElBQUssT0FBQSxHQUFHLEVBQUgsQ0FBRyxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVELHdDQUFrQixHQUFsQixVQUFtQixLQUFLO1FBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBSSxJQUFJLENBQUMsTUFBTSw4QkFBeUIsS0FBTyxDQUFDLENBQUMsR0FBRyxDQUFFLFVBQUMsR0FBWSxJQUFLLE9BQUEsR0FBRyxFQUFILENBQUcsQ0FBQyxDQUFDO0lBQ3JHLENBQUM7SUFFRCwyQ0FBcUIsR0FBckIsVUFBc0IsS0FBSztJQUUzQixDQUFDO0lBakJRLFdBQVc7UUFEdkIsaUJBQVUsRUFBRTt5Q0FLaUIsaUJBQVU7T0FKM0IsV0FBVyxDQWtCdkI7SUFBRCxrQkFBQztDQUFBLEFBbEJELElBa0JDO0FBbEJZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgYXMgUnhPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anMvT2JzZXJ2YWJsZVwiO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycywgSHR0cFJlc3BvbnNlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vbi9odHRwXCI7XHJcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL21hcFwiO1xyXG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci9kb1wiO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgSHR0cFNlcnZpY2Uge1xyXG4gICAgXHJcbiAgICBGQl9VUkwgPSAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vbWUnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCl7fVxyXG5cclxuICAgIGdldEZhY2VCb29rVXNlckluZm8odG9rZW4pIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxlZCBnZXRGYWNlQm9va1VzZXJJbmZvXCIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGAke3RoaXMuRkJfVVJMfT9hY2Nlc3NfdG9rZW49JHt0b2tlbn1gKS5tYXAoIChyZXM6UmVzcG9uc2UpID0+IHJlcyk7IFxyXG4gICAgfVxyXG5cclxuICAgIGdldEZhY2Vib29rRnJpZW5kcyh0b2tlbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGAke3RoaXMuRkJfVVJMfS9mcmllbmRzP2FjY2Vzc190b2tlbj0ke3Rva2VufWApLm1hcCggKHJlczpSZXNwb25zZSkgPT4gcmVzKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRGYWNlYm9va1Byb2ZpbGVQaWModG9rZW4pIHtcclxuICAgICAgICBcclxuICAgIH1cclxufSJdfQ==