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
            persist: true,
            iOSEmulatorFlush: true,
            onAuthStateChanged: function (data) {
                // console.log('onAuthStateChanged');
                // console.dir(data)
                if (data && data.user) {
                    // console.log("IN IF onAuthStateChanged");
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
                // console.dir(this.appData.user);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFHbEQsdURBQXlEO0FBQ3pELDBEQUE0RDtBQUU1RCwrQ0FBNkM7QUFHN0MsNERBQTBEO0FBUTFEO0lBRUksc0JBQW9CLElBQWlCLEVBQVUsT0FBdUI7UUFBbEQsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBQUcsQ0FBQztJQUUxRSwrQkFBUSxHQUFSO1FBQUEsaUJBcUNDO1FBcENHLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDVixPQUFPLEVBQUUsSUFBSTtZQUNiLGdCQUFnQixFQUFFLElBQUk7WUFFdEIsa0JBQWtCLEVBQUUsVUFBQyxJQUFJO2dCQUNyQixxQ0FBcUM7Z0JBQ3JDLG9CQUFvQjtnQkFDcEIsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNwQiwyQ0FBMkM7b0JBRTNDLEtBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO3dCQUNwQixhQUFhLEVBQUUsSUFBSTt3QkFDbkIsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZTt3QkFDMUMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTt3QkFDMUIsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7d0JBQ2xFLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO3FCQUNoRCxDQUFDLENBQUM7b0JBRUgsd0NBQXdDO29CQUN4QywrREFBK0Q7b0JBQy9ELCtDQUErQztvQkFHL0MsNkJBQTZCO2dCQUNqQyxDQUFDO2dCQUNELGtDQUFrQztZQUN0QyxDQUFDO1NBQ0osQ0FBQzthQUNELElBQUksQ0FDRixVQUFBLFFBQVE7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDdEMsQ0FBQyxFQUNELFVBQUEsS0FBSztZQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQXdCLEtBQU8sQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FDSCxDQUFDO0lBQ04sQ0FBQztJQUVELHlDQUFrQixHQUFsQjtRQUNJLElBQU0sUUFBUSxHQUFHLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQU0sUUFBUSxHQUFHLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBRSxVQUFDLEdBQU87WUFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsSUFBSSxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHO2dCQUMvQixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQztZQUNILFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsd0NBQXdDO1lBQzdFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3QixDQUFDLEVBQ0QsVUFBQyxLQUFLO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBN0RRLFlBQVk7UUFOeEIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFdBQVcsRUFBRSxvQkFBb0I7U0FDcEMsQ0FBQzt5Q0FLNEIsMEJBQVcsRUFBbUIsZ0NBQWM7T0FGN0QsWUFBWSxDQStEeEI7SUFBRCxtQkFBQztDQUFBLEFBL0RELElBK0RDO0FBL0RZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgKiBhcyB0bnNPQXV0aE1vZHVsZSBmcm9tICduYXRpdmVzY3JpcHQtb2F1dGgnO1xyXG5cclxuaW1wb3J0ICogYXMgZmlyZWJhc2UgZnJvbSAnbmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZSc7XHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSAnYXBwbGljYXRpb24tc2V0dGluZ3MnO1xyXG5cclxuaW1wb3J0IHsgSHR0cFNlcnZpY2UgfSBmcm9tICcuL2h0dHAuc2VydmljZSc7XHJcblxyXG5pbXBvcnQgeyBHbG9iYWxWYXJzIH0gZnJvbSAnLi9zaGFyZWQvZ2xvYmFsLXZhcnMnO1xyXG5pbXBvcnQgeyBBcHBEYXRhU2VydmljZSB9IGZyb20gXCIuL3NoYXJlZC9hcHBkYXRhLnNlcnZpY2VcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6IFwibnMtYXBwXCIsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCJhcHAuY29tcG9uZW50Lmh0bWxcIixcclxufSlcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0eyBcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBTZXJ2aWNlLCBwcml2YXRlIGFwcERhdGE6IEFwcERhdGFTZXJ2aWNlKSB7fVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGZpcmViYXNlLmluaXQoe1xyXG4gICAgICAgICAgICBwZXJzaXN0OiB0cnVlLFxyXG4gICAgICAgICAgICBpT1NFbXVsYXRvckZsdXNoOiB0cnVlLFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgb25BdXRoU3RhdGVDaGFuZ2VkOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ29uQXV0aFN0YXRlQ2hhbmdlZCcpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIoZGF0YSlcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEudXNlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSU4gSUYgb25BdXRoU3RhdGVDaGFuZ2VkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcERhdGEudXBkYXRlVXNlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdpc19sb2dnZWRpbic6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdwcm9maWxlX3Bob3RvJzogZGF0YS51c2VyLnByb2ZpbGVJbWFnZVVSTCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3VzZXJuYW1lJzogZGF0YS51c2VyLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdlbWFpbCc6IGRhdGEudXNlci5lbWFpbCB8fCBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygnZW1haWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2ZiSUQnOiBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygnZmJJRCcpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuYXBwRGF0YS51c2VyLmlzX2xvZ2dlZGluID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmFwcERhdGEudXNlci5wcm9maWxlX3Bob3RvID0gZGF0YS51c2VyLnByb2ZpbGVJbWFnZVVSTDtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmFwcERhdGEudXNlci51c2VybmFtZSA9IGRhdGEudXNlci5uYW1lO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5nZXRGYWNlYm9va0ZyaWVuZHMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKHRoaXMuYXBwRGF0YS51c2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgaW5zdGFuY2UgPT4ge1xyXG4gICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpcmViYXNlLmluaXQgZG9uZVwiKTtcclxuICAgICAgICAgICB9LFxyXG4gICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgY29uc29sZS5sb2coYGZpcmViYXNlLmluaXQgZXJyb3I6ICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmFjZWJvb2tGcmllbmRzKCkge1xyXG4gICAgICAgIGNvbnN0IHVzZXJfa2V5ID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ3VzZXJfa2V5Jyk7XHJcbiAgICAgICAgY29uc3QgdXNlciA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ3VzZXInKSk7XHJcbiAgICAgICAgY29uc3QgZmJfdG9rZW4gPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygnZmJfdG9rZW4nKTtcclxuXHJcbiAgICAgICAgdGhpcy5odHRwLmdldEZhY2Vib29rRnJpZW5kcyhmYl90b2tlbikuc3Vic2NyaWJlKCAocmVzOmFueSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZSSUVORFMgUkVTVUxUOlwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5kaXIocmVzKTtcclxuICAgICAgICAgICAgdmFyIGZyaWVuZHNfaWRzID0gcmVzLmRhdGEubWFwKCBvYmogPT57XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqLmlkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZnJpZW5kc19pZHMucHVzaCh1c2VyW3VzZXJfa2V5XS5pZCk7IC8vIGFsc28gcHVzaCB0aGUgSUQgZm9yIHRoZSBjdXJyZW50IHVzZXJcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGUklFTkRTIExJU1Q6XCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmRpcihmcmllbmRzX2lkcyk7XHJcbiAgICAgICAgfSwgXHJcbiAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFUlJPUjonLCBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG4iXX0=