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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFHbEQsdURBQXlEO0FBQ3pELDBEQUE0RDtBQUU1RCwrQ0FBNkM7QUFJN0MsNERBQTBEO0FBTzFEO0lBRUksc0JBQW9CLElBQWlCLEVBQVUsT0FBdUI7UUFBbEQsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBQUcsQ0FBQztJQUUxRSwrQkFBUSxHQUFSO1FBQUEsaUJBcUNDO1FBcENHLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDVixPQUFPLEVBQUUsS0FBSztZQUNkLGdCQUFnQixFQUFFLElBQUk7WUFFdEIsa0JBQWtCLEVBQUUsVUFBQyxJQUFJO2dCQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUNqQixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztvQkFFeEMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7d0JBQ3BCLGFBQWEsRUFBRSxJQUFJO3dCQUNuQixlQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlO3dCQUMxQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO3dCQUMxQixPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksbUJBQW1CLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQzt3QkFDbEUsTUFBTSxFQUFFLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7cUJBQ2hELENBQUMsQ0FBQztvQkFFSCx3Q0FBd0M7b0JBQ3hDLCtEQUErRDtvQkFDL0QsK0NBQStDO29CQUcvQyw2QkFBNkI7Z0JBQ2pDLENBQUM7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25DLENBQUM7U0FDSixDQUFDO2FBQ0QsSUFBSSxDQUNGLFVBQUEsUUFBUTtZQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0QyxDQUFDLEVBQ0QsVUFBQSxLQUFLO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBd0IsS0FBTyxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUNILENBQUM7SUFDTixDQUFDO0lBRUQseUNBQWtCLEdBQWxCO1FBQ0ksSUFBTSxRQUFRLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBTSxRQUFRLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTNELElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFFLFVBQUMsR0FBTztZQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEdBQUc7Z0JBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyx3Q0FBd0M7WUFDN0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdCLENBQUMsRUFDRCxVQUFDLEtBQUs7WUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUE3RFEsWUFBWTtRQU54QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFFBQVE7WUFDbEIsV0FBVyxFQUFFLG9CQUFvQjtTQUNwQyxDQUFDO3lDQUs0QiwwQkFBVyxFQUFtQixnQ0FBYztPQUY3RCxZQUFZLENBK0R4QjtJQUFELG1CQUFDO0NBQUEsQUEvREQsSUErREM7QUEvRFksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgKiBhcyB0bnNPQXV0aE1vZHVsZSBmcm9tICduYXRpdmVzY3JpcHQtb2F1dGgnO1xuXG5pbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tICduYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlJztcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSAnYXBwbGljYXRpb24tc2V0dGluZ3MnO1xuXG5pbXBvcnQgeyBIdHRwU2VydmljZSB9IGZyb20gJy4vaHR0cC5zZXJ2aWNlJztcblxuaW1wb3J0IHsgR2xvYmFsVmFycyB9IGZyb20gJy4vc2hhcmVkL2dsb2JhbC12YXJzJztcbmltcG9ydCB7IEFwcERhdGEgfSBmcm9tICcuL3NoYXJlZC9hcHAtZGF0YSc7XG5pbXBvcnQgeyBBcHBEYXRhU2VydmljZSB9IGZyb20gXCIuL3NoYXJlZC9hcHBkYXRhLnNlcnZpY2VcIjtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm5zLWFwcFwiLFxuICAgIHRlbXBsYXRlVXJsOiBcImFwcC5jb21wb25lbnQuaHRtbFwiLFxufSlcblxuXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0eyBcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cFNlcnZpY2UsIHByaXZhdGUgYXBwRGF0YTogQXBwRGF0YVNlcnZpY2UpIHt9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgZmlyZWJhc2UuaW5pdCh7XG4gICAgICAgICAgICBwZXJzaXN0OiBmYWxzZSxcbiAgICAgICAgICAgIGlPU0VtdWxhdG9yRmx1c2g6IHRydWUsXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9uQXV0aFN0YXRlQ2hhbmdlZDogKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTEFMQUxBTCcpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGRhdGEpXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS51c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSU4gSUYgb25BdXRoU3RhdGVDaGFuZ2VkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwRGF0YS51cGRhdGVVc2VyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdpc19sb2dnZWRpbic6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAncHJvZmlsZV9waG90byc6IGRhdGEudXNlci5wcm9maWxlSW1hZ2VVUkwsXG4gICAgICAgICAgICAgICAgICAgICAgICAndXNlcm5hbWUnOiBkYXRhLnVzZXIubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdlbWFpbCc6IGRhdGEudXNlci5lbWFpbCB8fCBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygnZW1haWwnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdmYklEJzogQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ2ZiSUQnKVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmFwcERhdGEudXNlci5pc19sb2dnZWRpbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuYXBwRGF0YS51c2VyLnByb2ZpbGVfcGhvdG8gPSBkYXRhLnVzZXIucHJvZmlsZUltYWdlVVJMO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmFwcERhdGEudXNlci51c2VybmFtZSA9IGRhdGEudXNlci5uYW1lO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5nZXRGYWNlYm9va0ZyaWVuZHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5kaXIodGhpcy5hcHBEYXRhLnVzZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAudGhlbihcbiAgICAgICAgICAgaW5zdGFuY2UgPT4ge1xuICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmaXJlYmFzZS5pbml0IGRvbmVcIik7XG4gICAgICAgICAgIH0sXG4gICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBmaXJlYmFzZS5pbml0IGVycm9yOiAke2Vycm9yfWApO1xuICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ2V0RmFjZWJvb2tGcmllbmRzKCkge1xuICAgICAgICBjb25zdCB1c2VyX2tleSA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1c2VyX2tleScpO1xuICAgICAgICBjb25zdCB1c2VyID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygndXNlcicpKTtcbiAgICAgICAgY29uc3QgZmJfdG9rZW4gPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygnZmJfdG9rZW4nKTtcblxuICAgICAgICB0aGlzLmh0dHAuZ2V0RmFjZWJvb2tGcmllbmRzKGZiX3Rva2VuKS5zdWJzY3JpYmUoIChyZXM6YW55KSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZSSUVORFMgUkVTVUxUOlwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKHJlcyk7XG4gICAgICAgICAgICB2YXIgZnJpZW5kc19pZHMgPSByZXMuZGF0YS5tYXAoIG9iaiA9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqLmlkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmcmllbmRzX2lkcy5wdXNoKHVzZXJbdXNlcl9rZXldLmlkKTsgLy8gYWxzbyBwdXNoIHRoZSBJRCBmb3IgdGhlIGN1cnJlbnQgdXNlclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGUklFTkRTIExJU1Q6XCIpO1xuICAgICAgICAgICAgY29uc29sZS5kaXIoZnJpZW5kc19pZHMpO1xuICAgICAgICB9LCBcbiAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRVJST1I6JywgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG59XG4iXX0=