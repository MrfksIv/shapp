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
            _this.userFacebookID = userInfo.fbID || ApplicationSettings.getString('fbID');
            _this.profile_photo_URL = userInfo.profile_photo || ApplicationSettings.getString('profile_photo');
            _this.prepareImageURL();
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
    MyDrawerComponent.prototype.prepareImageURL = function () {
        if (this.userFacebookID) {
            this.imageURL = "https://graph.facebook.com/" + this.userFacebookID + "/picture?type=normal";
        }
        else if (this.profile_photo_URL) {
            this.imageURL = this.profile_photo_URL;
        }
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktZHJhd2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15LWRyYXdlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFDekQsMERBQTREO0FBQzVELHNEQUErRDtBQUMvRCx1REFBeUQ7QUFJekQsZ0VBQThEO0FBRTlEOzs7OERBRzhEO0FBTzlEO0lBY0ksMkJBQW9CLE1BQXdCLEVBQVUsT0FBdUI7UUFBN0UsaUJBZUM7UUFmbUIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUN6RSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7YUFDckQsU0FBUyxDQUFFLFVBQUEsUUFBUTtZQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixJQUFNLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0QsSUFBSSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRWpELEtBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDL0UsS0FBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxJQUFJLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0RSxLQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQyxJQUFJLElBQUksbUJBQW1CLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdFLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUMsYUFBYSxJQUFJLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUVsRyxLQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsb0NBQVEsR0FBUjtRQUNJOztzRUFFOEQ7SUFDbEUsQ0FBQztJQUVEOzs7O2tFQUk4RDtJQUM5RCwwQ0FBYyxHQUFkLFVBQWUsU0FBaUI7UUFDNUIsTUFBTSxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNDLENBQUM7SUFFRCxnRUFBZ0U7SUFFekQsMkNBQWUsR0FBdEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLGdDQUE4QixJQUFJLENBQUMsY0FBYyx5QkFBc0IsQ0FBQztRQUM1RixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDM0MsQ0FBQztJQUVMLENBQUM7SUFFTSxrQ0FBTSxHQUFiO1FBQ0ksUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWxCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRWxDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBNURRO1FBQVIsWUFBSyxFQUFFOzsyREFBc0I7SUFOckIsaUJBQWlCO1FBTjdCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsVUFBVTtZQUNwQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLDRCQUE0QjtZQUN6QyxTQUFTLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztTQUM1QyxDQUFDO3lDQWU4Qix5QkFBZ0IsRUFBbUIsZ0NBQWM7T0FkcEUsaUJBQWlCLENBbUU3QjtJQUFELHdCQUFDO0NBQUEsQUFuRUQsSUFtRUM7QUFuRVksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0ICogYXMgZmlyZWJhc2UgZnJvbSAnbmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZSc7XHJcblxyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzL1N1YnNjcmlwdGlvbic7XHJcblxyXG5pbXBvcnQgeyBBcHBEYXRhU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvYXBwZGF0YS5zZXJ2aWNlXCI7XHJcblxyXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4qIEtlZXAgZGF0YSB0aGF0IGlzIGRpc3BsYXllZCBpbiB5b3VyIGFwcCBkcmF3ZXIgaW4gdGhlIE15RHJhd2VyIGNvbXBvbmVudCBjbGFzcy5cclxuKiBBZGQgbmV3IGRhdGEgb2JqZWN0cyB0aGF0IHlvdSB3YW50IHRvIGRpc3BsYXkgaW4gdGhlIGRyYXdlciBoZXJlIGluIHRoZSBmb3JtIG9mIHByb3BlcnRpZXMuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6IFwiTXlEcmF3ZXJcIixcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCIuL215LWRyYXdlci5jb21wb25lbnQuaHRtbFwiLFxyXG4gICAgc3R5bGVVcmxzOiBbXCIuL215LWRyYXdlci5jb21wb25lbnQuc2Nzc1wiXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTXlEcmF3ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICogVGhlIFwic2VsZWN0ZWRQYWdlXCIgaXMgYSBjb21wb25lbnQgaW5wdXQgcHJvcGVydHkuXHJcbiAgICAqIEl0IGlzIHVzZWQgdG8gcGFzcyB0aGUgY3VycmVudCBwYWdlIHRpdGxlIGZyb20gdGhlIGNvbnRhaW5pbmcgcGFnZSBjb21wb25lbnQuXHJcbiAgICAqIFlvdSBjYW4gY2hlY2sgaG93IGl0IGlzIHVzZWQgaW4gdGhlIFwiaXNQYWdlU2VsZWN0ZWRcIiBmdW5jdGlvbiBiZWxvdy5cclxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgICBASW5wdXQoKSBzZWxlY3RlZFBhZ2U6IHN0cmluZztcclxuICAgIHVzZXJGYWNlYm9va0lEOiBzdHJpbmc7XHJcbiAgICB1c2VybmFtZTogc3RyaW5nO1xyXG4gICAgZW1haWw6IHN0cmluZztcclxuICAgIHVzZXJJbmZvU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgICBpbWFnZVVSTDogc3RyaW5nO1xyXG4gICAgcHJvZmlsZV9waG90b19VUkw6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlcjogUm91dGVyRXh0ZW5zaW9ucywgcHJpdmF0ZSBhcHBEYXRhOiBBcHBEYXRhU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMudXNlckluZm9TdWJzY3JpcHRpb24gPSB0aGlzLmFwcERhdGEuZ2V0VXNlckluZm8oKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoIHVzZXJJbmZvID0+IHsgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJFQ0VJVkVEIElORk8gQVQgRFJBV0VSIVwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5kaXIodXNlckluZm8pO1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyX2tleSA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1c2VyX2tleScpO1xyXG4gICAgICAgICAgICBsZXQgdXNlciA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1c2VyJyk7XHJcbiAgICBcclxuICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IHVzZXJJbmZvLnVzZXJuYW1lIHx8IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1c2VybmFtZScpO1xyXG4gICAgICAgICAgICB0aGlzLmVtYWlsID0gdXNlckluZm8uZW1haWwgfHwgQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ2VtYWlsJyk7XHJcbiAgICAgICAgICAgIHRoaXMudXNlckZhY2Vib29rSUQgPSB1c2VySW5mby5mYklEIHx8IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCdmYklEJyk7XHJcbiAgICAgICAgICAgIHRoaXMucHJvZmlsZV9waG90b19VUkwgPSB1c2VySW5mby5wcm9maWxlX3Bob3RvIHx8IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCdwcm9maWxlX3Bob3RvJyk7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucHJlcGFyZUltYWdlVVJMKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAqIFVzZSB0aGUgTXlEcmF3ZXJDb21wb25lbnQgXCJvbkluaXRcIiBldmVudCBoYW5kbGVyIHRvIGluaXRpYWxpemUgdGhlIHByb3BlcnRpZXMgZGF0YSB2YWx1ZXMuXHJcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIH1cclxuXHJcbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgKiBUaGUgXCJpc1BhZ2VTZWxlY3RlZFwiIGZ1bmN0aW9uIGlzIGJvdW5kIHRvIGV2ZXJ5IG5hdmlnYXRpb24gaXRlbSBvbiB0aGUgPE15RHJhd2VySXRlbT4uXHJcbiAgICAqIEl0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGl0ZW0gc2hvdWxkIGhhdmUgdGhlIFwic2VsZWN0ZWRcIiBjbGFzcy5cclxuICAgICogVGhlIFwic2VsZWN0ZWRcIiBjbGFzcyBjaGFuZ2VzIHRoZSBzdHlsZXMgb2YgdGhlIGl0ZW0sIHNvIHRoYXQgeW91IGtub3cgd2hpY2ggcGFnZSB5b3UgYXJlIG9uLlxyXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIGlzUGFnZVNlbGVjdGVkKHBhZ2VUaXRsZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHBhZ2VUaXRsZSA9PT0gdGhpcy5zZWxlY3RlZFBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy9odHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS84NjczNzQxMjM0MjQ1OTcvcGljdHVyZT90eXBlPW5vcm1hbFxyXG5cclxuICAgIHB1YmxpYyBwcmVwYXJlSW1hZ2VVUkwoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlckZhY2Vib29rSUQpIHtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZVVSTCA9IGBodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3RoaXMudXNlckZhY2Vib29rSUR9L3BpY3R1cmU/dHlwZT1ub3JtYWxgO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9maWxlX3Bob3RvX1VSTCkge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlVVJMID0gdGhpcy5wcm9maWxlX3Bob3RvX1VSTDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBsb2dvdXQoKSB7XHJcbiAgICAgICAgZmlyZWJhc2UubG9nb3V0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hcHBEYXRhLnVzZXIuaXNfbG9nZ2VkaW4gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmFwcERhdGEudXNlci5wcm9maWxlX3Bob3RvID0gbnVsbDtcclxuICAgICAgICB0aGlzLmFwcERhdGEudXNlci51c2VybmFtZSA9IG51bGw7XHJcbiBcclxuICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2xvZ2luXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=