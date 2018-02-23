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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktZHJhd2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15LWRyYXdlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFDekQsMERBQTREO0FBQzVELHNEQUErRDtBQUMvRCx1REFBeUQ7QUFJekQsZ0VBQThEO0FBRTlEOzs7OERBRzhEO0FBTzlEO0lBY0ksMkJBQW9CLE1BQXdCLEVBQVUsT0FBdUI7UUFBN0UsaUJBa0JDO1FBbEJtQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBSXpFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTthQUNyRCxTQUFTLENBQUUsVUFBQSxRQUFRO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RCLElBQU0sUUFBUSxHQUFHLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRCxJQUFJLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFakQsS0FBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxJQUFJLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvRSxLQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLElBQUksbUJBQW1CLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RFLEtBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDLElBQUksSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0UsS0FBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxhQUFhLElBQUksbUJBQW1CLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBRWxHLEtBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxvQ0FBUSxHQUFSO1FBQ0k7O3NFQUU4RDtJQUNsRSxDQUFDO0lBRUQ7Ozs7a0VBSThEO0lBQzlELDBDQUFjLEdBQWQsVUFBZSxTQUFpQjtRQUM1QixNQUFNLENBQUMsU0FBUyxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0MsQ0FBQztJQUVELGdFQUFnRTtJQUV6RCwyQ0FBZSxHQUF0QjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsZ0NBQThCLElBQUksQ0FBQyxjQUFjLHlCQUFzQixDQUFDO1FBQzVGLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUMzQyxDQUFDO0lBRUwsQ0FBQztJQUVNLGtDQUFNLEdBQWI7UUFDSSxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFbEMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUEvRFE7UUFBUixZQUFLLEVBQUU7OzJEQUFzQjtJQU5yQixpQkFBaUI7UUFON0IsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsNEJBQTRCO1lBQ3pDLFNBQVMsRUFBRSxDQUFDLDRCQUE0QixDQUFDO1NBQzVDLENBQUM7eUNBZThCLHlCQUFnQixFQUFtQixnQ0FBYztPQWRwRSxpQkFBaUIsQ0FzRTdCO0lBQUQsd0JBQUM7Q0FBQSxBQXRFRCxJQXNFQztBQXRFWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tICduYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlJztcclxuXHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMvU3Vic2NyaXB0aW9uJztcclxuXHJcbmltcG9ydCB7IEFwcERhdGFTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9hcHBkYXRhLnNlcnZpY2VcIjtcclxuXHJcbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiogS2VlcCBkYXRhIHRoYXQgaXMgZGlzcGxheWVkIGluIHlvdXIgYXBwIGRyYXdlciBpbiB0aGUgTXlEcmF3ZXIgY29tcG9uZW50IGNsYXNzLlxyXG4qIEFkZCBuZXcgZGF0YSBvYmplY3RzIHRoYXQgeW91IHdhbnQgdG8gZGlzcGxheSBpbiB0aGUgZHJhd2VyIGhlcmUgaW4gdGhlIGZvcm0gb2YgcHJvcGVydGllcy5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogXCJNeURyYXdlclwiLFxyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICAgIHRlbXBsYXRlVXJsOiBcIi4vbXktZHJhd2VyLmNvbXBvbmVudC5odG1sXCIsXHJcbiAgICBzdHlsZVVybHM6IFtcIi4vbXktZHJhd2VyLmNvbXBvbmVudC5zY3NzXCJdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNeURyYXdlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgKiBUaGUgXCJzZWxlY3RlZFBhZ2VcIiBpcyBhIGNvbXBvbmVudCBpbnB1dCBwcm9wZXJ0eS5cclxuICAgICogSXQgaXMgdXNlZCB0byBwYXNzIHRoZSBjdXJyZW50IHBhZ2UgdGl0bGUgZnJvbSB0aGUgY29udGFpbmluZyBwYWdlIGNvbXBvbmVudC5cclxuICAgICogWW91IGNhbiBjaGVjayBob3cgaXQgaXMgdXNlZCBpbiB0aGUgXCJpc1BhZ2VTZWxlY3RlZFwiIGZ1bmN0aW9uIGJlbG93LlxyXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIEBJbnB1dCgpIHNlbGVjdGVkUGFnZTogc3RyaW5nO1xyXG4gICAgdXNlckZhY2Vib29rSUQ6IHN0cmluZztcclxuICAgIHVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nO1xyXG4gICAgdXNlckluZm9TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICAgIGltYWdlVVJMOiBzdHJpbmc7XHJcbiAgICBwcm9maWxlX3Bob3RvX1VSTDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLCBwcml2YXRlIGFwcERhdGE6IEFwcERhdGFTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXNlckluZm9TdWJzY3JpcHRpb24gPSB0aGlzLmFwcERhdGEuZ2V0VXNlckluZm8oKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoIHVzZXJJbmZvID0+IHsgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJFQ0VJVkVEIElORk8gQVQgRFJBV0VSIVwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5kaXIodXNlckluZm8pO1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyX2tleSA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1c2VyX2tleScpO1xyXG4gICAgICAgICAgICBsZXQgdXNlciA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1c2VyJyk7XHJcbiAgICBcclxuICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IHVzZXJJbmZvLnVzZXJuYW1lIHx8IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1c2VybmFtZScpO1xyXG4gICAgICAgICAgICB0aGlzLmVtYWlsID0gdXNlckluZm8uZW1haWwgfHwgQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ2VtYWlsJyk7XHJcbiAgICAgICAgICAgIHRoaXMudXNlckZhY2Vib29rSUQgPSB1c2VySW5mby5mYklEIHx8IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCdmYklEJyk7XHJcbiAgICAgICAgICAgIHRoaXMucHJvZmlsZV9waG90b19VUkwgPSB1c2VySW5mby5wcm9maWxlX3Bob3RvIHx8IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCdwcm9maWxlX3Bob3RvJyk7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucHJlcGFyZUltYWdlVVJMKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAqIFVzZSB0aGUgTXlEcmF3ZXJDb21wb25lbnQgXCJvbkluaXRcIiBldmVudCBoYW5kbGVyIHRvIGluaXRpYWxpemUgdGhlIHByb3BlcnRpZXMgZGF0YSB2YWx1ZXMuXHJcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIH1cclxuXHJcbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgKiBUaGUgXCJpc1BhZ2VTZWxlY3RlZFwiIGZ1bmN0aW9uIGlzIGJvdW5kIHRvIGV2ZXJ5IG5hdmlnYXRpb24gaXRlbSBvbiB0aGUgPE15RHJhd2VySXRlbT4uXHJcbiAgICAqIEl0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGl0ZW0gc2hvdWxkIGhhdmUgdGhlIFwic2VsZWN0ZWRcIiBjbGFzcy5cclxuICAgICogVGhlIFwic2VsZWN0ZWRcIiBjbGFzcyBjaGFuZ2VzIHRoZSBzdHlsZXMgb2YgdGhlIGl0ZW0sIHNvIHRoYXQgeW91IGtub3cgd2hpY2ggcGFnZSB5b3UgYXJlIG9uLlxyXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIGlzUGFnZVNlbGVjdGVkKHBhZ2VUaXRsZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHBhZ2VUaXRsZSA9PT0gdGhpcy5zZWxlY3RlZFBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy9odHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS84NjczNzQxMjM0MjQ1OTcvcGljdHVyZT90eXBlPW5vcm1hbFxyXG5cclxuICAgIHB1YmxpYyBwcmVwYXJlSW1hZ2VVUkwoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlckZhY2Vib29rSUQpIHtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZVVSTCA9IGBodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3RoaXMudXNlckZhY2Vib29rSUR9L3BpY3R1cmU/dHlwZT1ub3JtYWxgO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9maWxlX3Bob3RvX1VSTCkge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlVVJMID0gdGhpcy5wcm9maWxlX3Bob3RvX1VSTDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBsb2dvdXQoKSB7XHJcbiAgICAgICAgZmlyZWJhc2UubG9nb3V0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hcHBEYXRhLnVzZXIuaXNfbG9nZ2VkaW4gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmFwcERhdGEudXNlci5wcm9maWxlX3Bob3RvID0gbnVsbDtcclxuICAgICAgICB0aGlzLmFwcERhdGEudXNlci51c2VybmFtZSA9IG51bGw7XHJcbiBcclxuICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2xvZ2luXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=