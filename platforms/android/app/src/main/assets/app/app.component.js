"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var firebase = require("nativescript-plugin-firebase");
var ApplicationSettings = require("application-settings");
var http_service_1 = require("./http.service");
var appdata_service_1 = require("./shared/appdata.service");
var AppComponent = /** @class */ (function () {
    function AppComponent(http, appData) {
        this.http = http;
        this.appData = appData;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        firebase.init({
            persist: false,
            iOSEmulatorFlush: true,
            onAuthStateChanged: function (data) {
                console.log('LALALAL');
                console.dir(data);
                if (data && data.user) {
                    console.log("IN IF onAuthStateChanged");
                    _this.appData.updateUser({
                        'is_loggedin': true,
                        'profile_photo': data.user.profileImageURL,
                        'username': data.user.name,
                        'email': data.user.email || ApplicationSettings.getString('email'),
                        'fbID': ApplicationSettings.getString('fbID')
                    });
                    // this.appData.user.is_loggedin = true;
                    // this.appData.user.profile_photo = data.user.profileImageURL;
                    // this.appData.user.username = data.user.name;
                    // this.getFacebookFriends();
                }
                console.dir(_this.appData.user);
            }
        })
            .then(function (instance) {
            console.log("firebase.init done");
        }, function (error) {
            console.log("firebase.init error: " + error);
        });
    };
    AppComponent.prototype.getFacebookFriends = function () {
        var user_key = ApplicationSettings.getString('user_key');
        var user = JSON.parse(ApplicationSettings.getString('user'));
        var fb_token = ApplicationSettings.getString('fb_token');
        this.http.getFacebookFriends(fb_token).subscribe(function (res) {
            console.log("FRIENDS RESULT:");
            console.dir(res);
            var friends_ids = res.data.map(function (obj) {
                return obj.id;
            });
            friends_ids.push(user[user_key].id); // also push the ID for the current user
            console.log("FRIENDS LIST:");
            console.dir(friends_ids);
        }, function (error) {
            console.log('ERROR:', error);
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "ns-app",
            templateUrl: "app.component.html",
        }),
        __metadata("design:paramtypes", [http_service_1.HttpService, appdata_service_1.AppDataService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFHbEQsdURBQXlEO0FBQ3pELDBEQUE0RDtBQUU1RCwrQ0FBNkM7QUFJN0MsNERBQTBEO0FBTzFEO0lBRUksc0JBQW9CLElBQWlCLEVBQVUsT0FBdUI7UUFBbEQsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBQUcsQ0FBQztJQUUxRSwrQkFBUSxHQUFSO1FBQUEsaUJBcUNDO1FBcENHLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDVixPQUFPLEVBQUUsS0FBSztZQUNkLGdCQUFnQixFQUFFLElBQUk7WUFFdEIsa0JBQWtCLEVBQUUsVUFBQyxJQUFJO2dCQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUNqQixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztvQkFFeEMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7d0JBQ3BCLGFBQWEsRUFBRSxJQUFJO3dCQUNuQixlQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlO3dCQUMxQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO3dCQUMxQixPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksbUJBQW1CLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQzt3QkFDbEUsTUFBTSxFQUFFLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7cUJBQ2hELENBQUMsQ0FBQztvQkFFSCx3Q0FBd0M7b0JBQ3hDLCtEQUErRDtvQkFDL0QsK0NBQStDO29CQUcvQyw2QkFBNkI7Z0JBQ2pDLENBQUM7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25DLENBQUM7U0FDSixDQUFDO2FBQ0QsSUFBSSxDQUNGLFVBQUEsUUFBUTtZQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0QyxDQUFDLEVBQ0QsVUFBQSxLQUFLO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBd0IsS0FBTyxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUNILENBQUM7SUFDTixDQUFDO0lBRUQseUNBQWtCLEdBQWxCO1FBQ0ksSUFBTSxRQUFRLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBTSxRQUFRLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTNELElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFFLFVBQUMsR0FBTztZQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEdBQUc7Z0JBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyx3Q0FBd0M7WUFDN0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdCLENBQUMsRUFDRCxVQUFDLEtBQUs7WUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUE3RFEsWUFBWTtRQU54QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFFBQVE7WUFDbEIsV0FBVyxFQUFFLG9CQUFvQjtTQUNwQyxDQUFDO3lDQUs0QiwwQkFBVyxFQUFtQixnQ0FBYztPQUY3RCxZQUFZLENBK0R4QjtJQUFELG1CQUFDO0NBQUEsQUEvREQsSUErREM7QUEvRFksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCAqIGFzIHRuc09BdXRoTW9kdWxlIGZyb20gJ25hdGl2ZXNjcmlwdC1vYXV0aCc7XHJcblxyXG5pbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tICduYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlJztcclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tICdhcHBsaWNhdGlvbi1zZXR0aW5ncyc7XHJcblxyXG5pbXBvcnQgeyBIdHRwU2VydmljZSB9IGZyb20gJy4vaHR0cC5zZXJ2aWNlJztcclxuXHJcbmltcG9ydCB7IEdsb2JhbFZhcnMgfSBmcm9tICcuL3NoYXJlZC9nbG9iYWwtdmFycyc7XHJcbmltcG9ydCB7IEFwcERhdGEgfSBmcm9tICcuL3NoYXJlZC9hcHAtZGF0YSc7XHJcbmltcG9ydCB7IEFwcERhdGFTZXJ2aWNlIH0gZnJvbSBcIi4vc2hhcmVkL2FwcGRhdGEuc2VydmljZVwiO1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcIm5zLWFwcFwiLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiYXBwLmNvbXBvbmVudC5odG1sXCIsXHJcbn0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdHsgXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwU2VydmljZSwgcHJpdmF0ZSBhcHBEYXRhOiBBcHBEYXRhU2VydmljZSkge31cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICBmaXJlYmFzZS5pbml0KHtcclxuICAgICAgICAgICAgcGVyc2lzdDogZmFsc2UsXHJcbiAgICAgICAgICAgIGlPU0VtdWxhdG9yRmx1c2g6IHRydWUsXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBvbkF1dGhTdGF0ZUNoYW5nZWQ6IChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTEFMQUxBTCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kaXIoZGF0YSlcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEudXNlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSU4gSUYgb25BdXRoU3RhdGVDaGFuZ2VkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcERhdGEudXBkYXRlVXNlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdpc19sb2dnZWRpbic6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdwcm9maWxlX3Bob3RvJzogZGF0YS51c2VyLnByb2ZpbGVJbWFnZVVSTCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3VzZXJuYW1lJzogZGF0YS51c2VyLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdlbWFpbCc6IGRhdGEudXNlci5lbWFpbCB8fCBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygnZW1haWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2ZiSUQnOiBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygnZmJJRCcpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuYXBwRGF0YS51c2VyLmlzX2xvZ2dlZGluID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmFwcERhdGEudXNlci5wcm9maWxlX3Bob3RvID0gZGF0YS51c2VyLnByb2ZpbGVJbWFnZVVSTDtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmFwcERhdGEudXNlci51c2VybmFtZSA9IGRhdGEudXNlci5uYW1lO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5nZXRGYWNlYm9va0ZyaWVuZHMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKHRoaXMuYXBwRGF0YS51c2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgaW5zdGFuY2UgPT4ge1xyXG4gICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpcmViYXNlLmluaXQgZG9uZVwiKTtcclxuICAgICAgICAgICB9LFxyXG4gICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgY29uc29sZS5sb2coYGZpcmViYXNlLmluaXQgZXJyb3I6ICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmFjZWJvb2tGcmllbmRzKCkge1xyXG4gICAgICAgIGNvbnN0IHVzZXJfa2V5ID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ3VzZXJfa2V5Jyk7XHJcbiAgICAgICAgY29uc3QgdXNlciA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ3VzZXInKSk7XHJcbiAgICAgICAgY29uc3QgZmJfdG9rZW4gPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygnZmJfdG9rZW4nKTtcclxuXHJcbiAgICAgICAgdGhpcy5odHRwLmdldEZhY2Vib29rRnJpZW5kcyhmYl90b2tlbikuc3Vic2NyaWJlKCAocmVzOmFueSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZSSUVORFMgUkVTVUxUOlwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5kaXIocmVzKTtcclxuICAgICAgICAgICAgdmFyIGZyaWVuZHNfaWRzID0gcmVzLmRhdGEubWFwKCBvYmogPT57XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqLmlkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZnJpZW5kc19pZHMucHVzaCh1c2VyW3VzZXJfa2V5XS5pZCk7IC8vIGFsc28gcHVzaCB0aGUgSUQgZm9yIHRoZSBjdXJyZW50IHVzZXJcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGUklFTkRTIExJU1Q6XCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmRpcihmcmllbmRzX2lkcyk7XHJcbiAgICAgICAgfSwgXHJcbiAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFUlJPUjonLCBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG4iXX0=