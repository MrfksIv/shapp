"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ApplicationSettings = require("application-settings");
var router_1 = require("nativescript-angular/router");
var firebase = require("nativescript-plugin-firebase");
var appdata_service_1 = require("../../shared/appdata.service");
/* ***********************************************************
* Keep data that is displayed in your app drawer in the MyDrawer component class.
* Add new data objects that you want to display in the drawer here in the form of properties.
*************************************************************/
var MyDrawerComponent = /** @class */ (function () {
    function MyDrawerComponent(router, appData) {
        var _this = this;
        this.router = router;
        this.appData = appData;
        this.userInfoSubscription = this.appData.getUserInfo()
            .subscribe(function (userInfo) {
            console.log("RECEIVED INFO AT DRAWER!");
            console.dir(userInfo);
            var user_key = ApplicationSettings.getString('user_key');
            var user = ApplicationSettings.getString('user');
            _this.username = userInfo.username || ApplicationSettings.getString('username');
            _this.email = userInfo.email || ApplicationSettings.getString('email');
            _this.userID = userInfo.fbID || ApplicationSettings.getString('fbID');
        });
    }
    MyDrawerComponent.prototype.ngOnInit = function () {
        /* ***********************************************************
        * Use the MyDrawerComponent "onInit" event handler to initialize the properties data values.
        *************************************************************/
    };
    /* ***********************************************************
    * The "isPageSelected" function is bound to every navigation item on the <MyDrawerItem>.
    * It is used to determine whether the item should have the "selected" class.
    * The "selected" class changes the styles of the item, so that you know which page you are on.
    *************************************************************/
    MyDrawerComponent.prototype.isPageSelected = function (pageTitle) {
        return pageTitle === this.selectedPage;
    };
    //https://graph.facebook.com/867374123424597/picture?type=normal
    MyDrawerComponent.prototype.logout = function () {
        firebase.logout();
        this.appData.user.is_loggedin = false;
        this.appData.user.profile_photo = null;
        this.appData.user.username = null;
        ApplicationSettings.clear();
        this.router.navigate(["/login"], { clearHistory: true });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MyDrawerComponent.prototype, "selectedPage", void 0);
    MyDrawerComponent = __decorate([
        core_1.Component({
            selector: "MyDrawer",
            moduleId: module.id,
            templateUrl: "./my-drawer.component.html",
            styleUrls: ["./my-drawer.component.scss"]
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions, appdata_service_1.AppDataService])
    ], MyDrawerComponent);
    return MyDrawerComponent;
}());
exports.MyDrawerComponent = MyDrawerComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktZHJhd2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15LWRyYXdlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFDekQsMERBQTREO0FBQzVELHNEQUErRDtBQUMvRCx1REFBeUQ7QUFJekQsZ0VBQThEO0FBRTlEOzs7OERBRzhEO0FBTzlEO0lBWUksMkJBQW9CLE1BQXdCLEVBQVUsT0FBdUI7UUFBN0UsaUJBaUJDO1FBakJtQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBSXpFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTthQUNyRCxTQUFTLENBQUUsVUFBQSxRQUFRO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RCLElBQU0sUUFBUSxHQUFHLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRCxJQUFJLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFakQsS0FBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxJQUFJLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvRSxLQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLElBQUksbUJBQW1CLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RFLEtBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFHekUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsb0NBQVEsR0FBUjtRQUNJOztzRUFFOEQ7SUFDbEUsQ0FBQztJQUVEOzs7O2tFQUk4RDtJQUM5RCwwQ0FBYyxHQUFkLFVBQWUsU0FBaUI7UUFDNUIsTUFBTSxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNDLENBQUM7SUFFRCxnRUFBZ0U7SUFHekQsa0NBQU0sR0FBYjtRQUNJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVsQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUVsQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQXBEUTtRQUFSLFlBQUssRUFBRTs7MkRBQXNCO0lBTnJCLGlCQUFpQjtRQU43QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSw0QkFBNEI7WUFDekMsU0FBUyxFQUFFLENBQUMsNEJBQTRCLENBQUM7U0FDNUMsQ0FBQzt5Q0FhOEIseUJBQWdCLEVBQW1CLGdDQUFjO09BWnBFLGlCQUFpQixDQTJEN0I7SUFBRCx3QkFBQztDQUFBLEFBM0RELElBMkRDO0FBM0RZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCAqIGFzIGZpcmViYXNlIGZyb20gJ25hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2UnO1xyXG5cclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcy9TdWJzY3JpcHRpb24nO1xyXG5cclxuaW1wb3J0IHsgQXBwRGF0YVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2FwcGRhdGEuc2VydmljZVwiO1xyXG5cclxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuKiBLZWVwIGRhdGEgdGhhdCBpcyBkaXNwbGF5ZWQgaW4geW91ciBhcHAgZHJhd2VyIGluIHRoZSBNeURyYXdlciBjb21wb25lbnQgY2xhc3MuXHJcbiogQWRkIG5ldyBkYXRhIG9iamVjdHMgdGhhdCB5b3Ugd2FudCB0byBkaXNwbGF5IGluIHRoZSBkcmF3ZXIgaGVyZSBpbiB0aGUgZm9ybSBvZiBwcm9wZXJ0aWVzLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcIk15RHJhd2VyXCIsXHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9teS1kcmF3ZXIuY29tcG9uZW50Lmh0bWxcIixcclxuICAgIHN0eWxlVXJsczogW1wiLi9teS1kcmF3ZXIuY29tcG9uZW50LnNjc3NcIl1cclxufSlcclxuZXhwb3J0IGNsYXNzIE15RHJhd2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAqIFRoZSBcInNlbGVjdGVkUGFnZVwiIGlzIGEgY29tcG9uZW50IGlucHV0IHByb3BlcnR5LlxyXG4gICAgKiBJdCBpcyB1c2VkIHRvIHBhc3MgdGhlIGN1cnJlbnQgcGFnZSB0aXRsZSBmcm9tIHRoZSBjb250YWluaW5nIHBhZ2UgY29tcG9uZW50LlxyXG4gICAgKiBZb3UgY2FuIGNoZWNrIGhvdyBpdCBpcyB1c2VkIGluIHRoZSBcImlzUGFnZVNlbGVjdGVkXCIgZnVuY3Rpb24gYmVsb3cuXHJcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgQElucHV0KCkgc2VsZWN0ZWRQYWdlOiBzdHJpbmc7XHJcbiAgICB1c2VySUQ6IHN0cmluZztcclxuICAgIHVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nO1xyXG4gICAgdXNlckluZm9TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlcjogUm91dGVyRXh0ZW5zaW9ucywgcHJpdmF0ZSBhcHBEYXRhOiBBcHBEYXRhU2VydmljZSkge1xyXG5cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnVzZXJJbmZvU3Vic2NyaXB0aW9uID0gdGhpcy5hcHBEYXRhLmdldFVzZXJJbmZvKClcclxuICAgICAgICAuc3Vic2NyaWJlKCB1c2VySW5mbyA9PiB7ICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSRUNFSVZFRCBJTkZPIEFUIERSQVdFUiFcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKHVzZXJJbmZvKTtcclxuICAgICAgICAgICAgY29uc3QgdXNlcl9rZXkgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygndXNlcl9rZXknKTtcclxuICAgICAgICAgICAgbGV0IHVzZXIgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygndXNlcicpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSB1c2VySW5mby51c2VybmFtZSB8fCBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygndXNlcm5hbWUnKTtcclxuICAgICAgICAgICAgdGhpcy5lbWFpbCA9IHVzZXJJbmZvLmVtYWlsIHx8IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCdlbWFpbCcpO1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJJRCA9IHVzZXJJbmZvLmZiSUQgfHwgQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ2ZiSUQnKTtcclxuXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAqIFVzZSB0aGUgTXlEcmF3ZXJDb21wb25lbnQgXCJvbkluaXRcIiBldmVudCBoYW5kbGVyIHRvIGluaXRpYWxpemUgdGhlIHByb3BlcnRpZXMgZGF0YSB2YWx1ZXMuXHJcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIH1cclxuXHJcbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgKiBUaGUgXCJpc1BhZ2VTZWxlY3RlZFwiIGZ1bmN0aW9uIGlzIGJvdW5kIHRvIGV2ZXJ5IG5hdmlnYXRpb24gaXRlbSBvbiB0aGUgPE15RHJhd2VySXRlbT4uXHJcbiAgICAqIEl0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGl0ZW0gc2hvdWxkIGhhdmUgdGhlIFwic2VsZWN0ZWRcIiBjbGFzcy5cclxuICAgICogVGhlIFwic2VsZWN0ZWRcIiBjbGFzcyBjaGFuZ2VzIHRoZSBzdHlsZXMgb2YgdGhlIGl0ZW0sIHNvIHRoYXQgeW91IGtub3cgd2hpY2ggcGFnZSB5b3UgYXJlIG9uLlxyXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIGlzUGFnZVNlbGVjdGVkKHBhZ2VUaXRsZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHBhZ2VUaXRsZSA9PT0gdGhpcy5zZWxlY3RlZFBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy9odHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS84NjczNzQxMjM0MjQ1OTcvcGljdHVyZT90eXBlPW5vcm1hbFxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIGxvZ291dCgpIHtcclxuICAgICAgICBmaXJlYmFzZS5sb2dvdXQoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmFwcERhdGEudXNlci5pc19sb2dnZWRpbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYXBwRGF0YS51c2VyLnByb2ZpbGVfcGhvdG8gPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYXBwRGF0YS51c2VyLnVzZXJuYW1lID0gbnVsbDtcclxuIFxyXG4gICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3MuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbG9naW5cIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==