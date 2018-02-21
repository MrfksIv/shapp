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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwZGF0YS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwZGF0YS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBRTNDLHdDQUFzQztBQUd0QztJQURBO1FBR1ksb0JBQWUsR0FBSSxJQUFJLGlCQUFPLEVBQU8sQ0FBQztRQUN2QyxTQUFJLEdBQUk7WUFDWCxhQUFhLEVBQUUsU0FBUztZQUN4QixRQUFRLEVBQUUsU0FBUztZQUNuQixXQUFXLEVBQUUsU0FBUztTQUN6QixDQUFBO0lBc0JMLENBQUM7SUFwQkcsbUNBQVUsR0FBVixVQUFXLEdBQUc7UUFDVixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUM7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUE7UUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxtQ0FBVSxHQUFWLFVBQVcsUUFBUSxFQUFFLEtBQUs7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxvQ0FBVyxHQUFYO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDL0MsQ0FBQztJQTNCUSxjQUFjO1FBRDFCLGlCQUFVLEVBQUU7T0FDQSxjQUFjLENBNkIxQjtJQUFELHFCQUFDO0NBQUEsQUE3QkQsSUE2QkM7QUE3Qlksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9PYnNlcnZhYmxlXCJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tIFwicnhqcy9TdWJqZWN0XCJcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEFwcERhdGFTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgdXNlckluZm9TdWJqZWN0ICA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICBwdWJsaWMgdXNlciA9ICB7XG4gICAgICAgIHByb2ZpbGVfcGhvdG86IHVuZGVmaW5lZCxcbiAgICAgICAgdXNlcm5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgaXNfbG9nZ2VkaW46IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHVwZGF0ZVVzZXIob2JqKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmpba2V5XSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXNlcltrZXldID0gb2JqW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJVUERBVEVEIFVTRVIgQXBwRGF0YVNlcnZpY2U6XCIpXG4gICAgICAgIGNvbnNvbGUuZGlyKHRoaXMudXNlcilcbiAgICAgICAgdGhpcy51c2VySW5mb1N1YmplY3QubmV4dCh0aGlzLnVzZXIpO1xuICAgIH1cblxuICAgIHVwZGF0ZUluZm8ocHJvcGVydHksIHZhbHVlKSB7XG4gICAgICAgIHRoaXMudXNlcltwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51c2VySW5mb1N1YmplY3QubmV4dCh0aGlzLnVzZXIpO1xuICAgIH1cblxuICAgIGdldFVzZXJJbmZvKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJJbmZvU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICB9XG4gXG59Il19