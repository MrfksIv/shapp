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
    HttpService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], HttpService);
    return HttpService;
}());
exports.HttpService = HttpService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaHR0cC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBRTNDLDZDQUE2RTtBQUM3RSxpQ0FBK0I7QUFDL0IsZ0NBQThCO0FBRzlCO0lBSUkscUJBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7UUFGcEMsV0FBTSxHQUFHLCtCQUErQixDQUFDO0lBRUgsQ0FBQztJQUV2Qyx5Q0FBbUIsR0FBbkIsVUFBb0IsS0FBSztRQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFJLElBQUksQ0FBQyxNQUFNLHNCQUFpQixLQUFPLENBQUMsQ0FBQyxHQUFHLENBQUUsVUFBQyxHQUFZLElBQUssT0FBQSxHQUFHLEVBQUgsQ0FBRyxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVELHdDQUFrQixHQUFsQixVQUFtQixLQUFLO1FBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBSSxJQUFJLENBQUMsTUFBTSw4QkFBeUIsS0FBTyxDQUFDLENBQUMsR0FBRyxDQUFFLFVBQUMsR0FBWSxJQUFLLE9BQUEsR0FBRyxFQUFILENBQUcsQ0FBQyxDQUFDO0lBQ3JHLENBQUM7SUFiUSxXQUFXO1FBRHZCLGlCQUFVLEVBQUU7eUNBS2lCLGlCQUFVO09BSjNCLFdBQVcsQ0FjdkI7SUFBRCxrQkFBQztDQUFBLEFBZEQsSUFjQztBQWRZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIGFzIFJ4T2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzL09ic2VydmFibGVcIjtcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzLCBIdHRwUmVzcG9uc2UgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uL2h0dHBcIjtcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL21hcFwiO1xuaW1wb3J0IFwicnhqcy9hZGQvb3BlcmF0b3IvZG9cIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEh0dHBTZXJ2aWNlIHtcbiAgICBcbiAgICBGQl9VUkwgPSAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vbWUnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KXt9XG5cbiAgICBnZXRGYWNlQm9va1VzZXJJbmZvKHRva2VuKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbGVkIGdldEZhY2VCb29rVXNlckluZm9cIik7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGAke3RoaXMuRkJfVVJMfT9hY2Nlc3NfdG9rZW49JHt0b2tlbn1gKS5tYXAoIChyZXM6UmVzcG9uc2UpID0+IHJlcyk7IFxuICAgIH1cblxuICAgIGdldEZhY2Vib29rRnJpZW5kcyh0b2tlbikge1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldChgJHt0aGlzLkZCX1VSTH0vZnJpZW5kcz9hY2Nlc3NfdG9rZW49JHt0b2tlbn1gKS5tYXAoIChyZXM6UmVzcG9uc2UpID0+IHJlcyk7XG4gICAgfVxufSJdfQ==