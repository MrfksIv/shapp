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
        console.log("UPDATED USER AppDataService:");
        console.dir(this.user);
        this.userInfoSubject.next(this.user);
    };
    AppDataService.prototype.updateInfo = function (property, value) {
        this.user[property] = value;
        this.userInfoSubject.next(this.user);
    };
    AppDataService.prototype.getUserInfo = function () {
        return this.userInfoSubject.asObservable();
    };
    AppDataService = __decorate([
        core_1.Injectable()
    ], AppDataService);
    return AppDataService;
}());
exports.AppDataService = AppDataService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwZGF0YS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwZGF0YS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBRTNDLHdDQUFzQztBQUd0QztJQURBO1FBR1ksb0JBQWUsR0FBSSxJQUFJLGlCQUFPLEVBQU8sQ0FBQztRQUN2QyxTQUFJLEdBQUk7WUFDWCxhQUFhLEVBQUUsU0FBUztZQUN4QixRQUFRLEVBQUUsU0FBUztZQUNuQixXQUFXLEVBQUUsU0FBUztTQUN6QixDQUFBO0lBc0JMLENBQUM7SUFwQkcsbUNBQVUsR0FBVixVQUFXLEdBQUc7UUFDVixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUM7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUE7UUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxtQ0FBVSxHQUFWLFVBQVcsUUFBUSxFQUFFLEtBQUs7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxvQ0FBVyxHQUFYO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDL0MsQ0FBQztJQTNCUSxjQUFjO1FBRDFCLGlCQUFVLEVBQUU7T0FDQSxjQUFjLENBNkIxQjtJQUFELHFCQUFDO0NBQUEsQUE3QkQsSUE2QkM7QUE3Qlksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzL09ic2VydmFibGVcIlxyXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSBcInJ4anMvU3ViamVjdFwiXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBcHBEYXRhU2VydmljZSB7XHJcblxyXG4gICAgcHJpdmF0ZSB1c2VySW5mb1N1YmplY3QgID0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgcHVibGljIHVzZXIgPSAge1xyXG4gICAgICAgIHByb2ZpbGVfcGhvdG86IHVuZGVmaW5lZCxcclxuICAgICAgICB1c2VybmFtZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIGlzX2xvZ2dlZGluOiB1bmRlZmluZWRcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVVc2VyKG9iaikge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgaWYgKG9ialtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJba2V5XSA9IG9ialtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVVBEQVRFRCBVU0VSIEFwcERhdGFTZXJ2aWNlOlwiKVxyXG4gICAgICAgIGNvbnNvbGUuZGlyKHRoaXMudXNlcilcclxuICAgICAgICB0aGlzLnVzZXJJbmZvU3ViamVjdC5uZXh0KHRoaXMudXNlcik7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlSW5mbyhwcm9wZXJ0eSwgdmFsdWUpIHtcclxuICAgICAgICB0aGlzLnVzZXJbcHJvcGVydHldID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51c2VySW5mb1N1YmplY3QubmV4dCh0aGlzLnVzZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFVzZXJJbmZvKCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlckluZm9TdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG4gXHJcbn0iXX0=