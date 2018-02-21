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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktZHJhd2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15LWRyYXdlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFDekQsMERBQTREO0FBQzVELHNEQUErRDtBQUMvRCx1REFBeUQ7QUFJekQsZ0VBQThEO0FBRTlEOzs7OERBRzhEO0FBTzlEO0lBWUksMkJBQW9CLE1BQXdCLEVBQVUsT0FBdUI7UUFBN0UsaUJBaUJDO1FBakJtQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBSXpFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTthQUNyRCxTQUFTLENBQUUsVUFBQSxRQUFRO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RCLElBQU0sUUFBUSxHQUFHLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRCxJQUFJLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFakQsS0FBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxJQUFJLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvRSxLQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLElBQUksbUJBQW1CLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RFLEtBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFHekUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsb0NBQVEsR0FBUjtRQUNJOztzRUFFOEQ7SUFDbEUsQ0FBQztJQUVEOzs7O2tFQUk4RDtJQUM5RCwwQ0FBYyxHQUFkLFVBQWUsU0FBaUI7UUFDNUIsTUFBTSxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNDLENBQUM7SUFFRCxnRUFBZ0U7SUFHekQsa0NBQU0sR0FBYjtRQUNJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVsQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUVsQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQXBEUTtRQUFSLFlBQUssRUFBRTs7MkRBQXNCO0lBTnJCLGlCQUFpQjtRQU43QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSw0QkFBNEI7WUFDekMsU0FBUyxFQUFFLENBQUMsNEJBQTRCLENBQUM7U0FDNUMsQ0FBQzt5Q0FhOEIseUJBQWdCLEVBQW1CLGdDQUFjO09BWnBFLGlCQUFpQixDQTJEN0I7SUFBRCx3QkFBQztDQUFBLEFBM0RELElBMkRDO0FBM0RZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCAqIGFzIGZpcmViYXNlIGZyb20gJ25hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2UnO1xuXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzL1N1YnNjcmlwdGlvbic7XG5cbmltcG9ydCB7IEFwcERhdGFTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9hcHBkYXRhLnNlcnZpY2VcIjtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogS2VlcCBkYXRhIHRoYXQgaXMgZGlzcGxheWVkIGluIHlvdXIgYXBwIGRyYXdlciBpbiB0aGUgTXlEcmF3ZXIgY29tcG9uZW50IGNsYXNzLlxuKiBBZGQgbmV3IGRhdGEgb2JqZWN0cyB0aGF0IHlvdSB3YW50IHRvIGRpc3BsYXkgaW4gdGhlIGRyYXdlciBoZXJlIGluIHRoZSBmb3JtIG9mIHByb3BlcnRpZXMuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwiTXlEcmF3ZXJcIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vbXktZHJhd2VyLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL215LWRyYXdlci5jb21wb25lbnQuc2Nzc1wiXVxufSlcbmV4cG9ydCBjbGFzcyBNeURyYXdlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAqIFRoZSBcInNlbGVjdGVkUGFnZVwiIGlzIGEgY29tcG9uZW50IGlucHV0IHByb3BlcnR5LlxuICAgICogSXQgaXMgdXNlZCB0byBwYXNzIHRoZSBjdXJyZW50IHBhZ2UgdGl0bGUgZnJvbSB0aGUgY29udGFpbmluZyBwYWdlIGNvbXBvbmVudC5cbiAgICAqIFlvdSBjYW4gY2hlY2sgaG93IGl0IGlzIHVzZWQgaW4gdGhlIFwiaXNQYWdlU2VsZWN0ZWRcIiBmdW5jdGlvbiBiZWxvdy5cbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIEBJbnB1dCgpIHNlbGVjdGVkUGFnZTogc3RyaW5nO1xuICAgIHVzZXJJRDogc3RyaW5nO1xuICAgIHVzZXJuYW1lOiBzdHJpbmc7XG4gICAgZW1haWw6IHN0cmluZztcbiAgICB1c2VySW5mb1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXI6IFJvdXRlckV4dGVuc2lvbnMsIHByaXZhdGUgYXBwRGF0YTogQXBwRGF0YVNlcnZpY2UpIHtcblxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIHRoaXMudXNlckluZm9TdWJzY3JpcHRpb24gPSB0aGlzLmFwcERhdGEuZ2V0VXNlckluZm8oKVxuICAgICAgICAuc3Vic2NyaWJlKCB1c2VySW5mbyA9PiB7ICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUkVDRUlWRUQgSU5GTyBBVCBEUkFXRVIhXCIpO1xuICAgICAgICAgICAgY29uc29sZS5kaXIodXNlckluZm8pO1xuICAgICAgICAgICAgY29uc3QgdXNlcl9rZXkgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygndXNlcl9rZXknKTtcbiAgICAgICAgICAgIGxldCB1c2VyID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ3VzZXInKTtcbiAgICBcbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSB1c2VySW5mby51c2VybmFtZSB8fCBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygndXNlcm5hbWUnKTtcbiAgICAgICAgICAgIHRoaXMuZW1haWwgPSB1c2VySW5mby5lbWFpbCB8fCBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygnZW1haWwnKTtcbiAgICAgICAgICAgIHRoaXMudXNlcklEID0gdXNlckluZm8uZmJJRCB8fCBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygnZmJJRCcpO1xuXG4gICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgKiBVc2UgdGhlIE15RHJhd2VyQ29tcG9uZW50IFwib25Jbml0XCIgZXZlbnQgaGFuZGxlciB0byBpbml0aWFsaXplIHRoZSBwcm9wZXJ0aWVzIGRhdGEgdmFsdWVzLlxuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIH1cblxuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgKiBUaGUgXCJpc1BhZ2VTZWxlY3RlZFwiIGZ1bmN0aW9uIGlzIGJvdW5kIHRvIGV2ZXJ5IG5hdmlnYXRpb24gaXRlbSBvbiB0aGUgPE15RHJhd2VySXRlbT4uXG4gICAgKiBJdCBpcyB1c2VkIHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBpdGVtIHNob3VsZCBoYXZlIHRoZSBcInNlbGVjdGVkXCIgY2xhc3MuXG4gICAgKiBUaGUgXCJzZWxlY3RlZFwiIGNsYXNzIGNoYW5nZXMgdGhlIHN0eWxlcyBvZiB0aGUgaXRlbSwgc28gdGhhdCB5b3Uga25vdyB3aGljaCBwYWdlIHlvdSBhcmUgb24uXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICBpc1BhZ2VTZWxlY3RlZChwYWdlVGl0bGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gcGFnZVRpdGxlID09PSB0aGlzLnNlbGVjdGVkUGFnZTtcbiAgICB9XG5cbiAgICAvL2h0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzg2NzM3NDEyMzQyNDU5Ny9waWN0dXJlP3R5cGU9bm9ybWFsXG5cbiAgICBcbiAgICBwdWJsaWMgbG9nb3V0KCkge1xuICAgICAgICBmaXJlYmFzZS5sb2dvdXQoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuYXBwRGF0YS51c2VyLmlzX2xvZ2dlZGluID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYXBwRGF0YS51c2VyLnByb2ZpbGVfcGhvdG8gPSBudWxsO1xuICAgICAgICB0aGlzLmFwcERhdGEudXNlci51c2VybmFtZSA9IG51bGw7XG4gXG4gICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3MuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2xvZ2luXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcbiAgICB9XG59XG4iXX0=