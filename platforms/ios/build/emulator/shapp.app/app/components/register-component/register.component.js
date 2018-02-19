"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var nativescript_snackbar_1 = require("nativescript-snackbar");
var ApplicationSettings = require("application-settings");
var firebase = require("nativescript-plugin-firebase");
var RegisterComponent = /** @class */ (function () {
    function RegisterComponent(location) {
        this.location = location;
        this.input = {
            "firstname": "",
            "lastname": "",
            "email": "",
            "password": ""
        };
    }
    RegisterComponent.prototype.register = function () {
        if (this.input.firstname && this.input.lastname && this.input.email && this.input.password) {
            ApplicationSettings.setString("account", JSON.stringify(this.input));
            firebase.createUser({ email: this.input.email, password: this.input.password })
                .then(function (onfulfilled) {
                console.log("CREATE USER SUCCESS!");
                console.dir(onfulfilled);
            }, function (onrejected) {
                console.log("CREATE USER FAILED!");
                console.dir(onrejected);
            });
            this.location.back();
        }
        else {
            (new nativescript_snackbar_1.SnackBar()).simple("All Fields Required!");
        }
    };
    RegisterComponent.prototype.check = function () {
        console.dir(this.input);
    };
    RegisterComponent.prototype.goBack = function () {
        this.location.back();
    };
    RegisterComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "ns-register",
            templateUrl: "register.component.html",
        }),
        __metadata("design:paramtypes", [common_1.Location])
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVnaXN0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTBDO0FBQzFDLDBDQUEyQztBQUMzQywrREFBaUQ7QUFFakQsMERBQTREO0FBQzVELHVEQUF5RDtBQU96RDtJQUlJLDJCQUEyQixRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3pDLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDVCxXQUFXLEVBQUUsRUFBRTtZQUNmLFVBQVUsRUFBRSxFQUFFO1lBQ2QsT0FBTyxFQUFFLEVBQUU7WUFDWCxVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFBO0lBQ0wsQ0FBQztJQUVNLG9DQUFRLEdBQWY7UUFDSSxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDeEYsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRXJFLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFDLENBQUM7aUJBQzNFLElBQUksQ0FDRCxVQUFBLFdBQVc7Z0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2dCQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzdCLENBQUMsRUFDRCxVQUFBLFVBQVU7Z0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FDSixDQUFDO1lBRUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixDQUFDLElBQUksZ0NBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDcEQsQ0FBQztJQUNMLENBQUM7SUFDTSxpQ0FBSyxHQUFaO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUNNLGtDQUFNLEdBQWI7UUFDSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUF2Q1EsaUJBQWlCO1FBTDdCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLGFBQWE7WUFDdkIsV0FBVyxFQUFFLHlCQUF5QjtTQUN6QyxDQUFDO3lDQUt1QyxpQkFBUTtPQUpwQyxpQkFBaUIsQ0F5QzdCO0lBQUQsd0JBQUM7Q0FBQSxBQXpDRCxJQXlDQztBQXpDWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBTbmFja0JhciB9IGZyb20gXCJuYXRpdmVzY3JpcHQtc25hY2tiYXJcIjtcblxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCAqIGFzIGZpcmViYXNlIGZyb20gJ25hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHNlbGVjdG9yOiBcIm5zLXJlZ2lzdGVyXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwicmVnaXN0ZXIuY29tcG9uZW50Lmh0bWxcIixcbn0pXG5leHBvcnQgY2xhc3MgUmVnaXN0ZXJDb21wb25lbnQge1xuXG4gICAgcHVibGljIGlucHV0OiBhbnk7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24pIHtcbiAgICAgICAgdGhpcy5pbnB1dCA9IHtcbiAgICAgICAgICAgIFwiZmlyc3RuYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcImxhc3RuYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiXCIsXG4gICAgICAgICAgICBcInBhc3N3b3JkXCI6IFwiXCJcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3RlcigpIHtcbiAgICAgICAgaWYodGhpcy5pbnB1dC5maXJzdG5hbWUgJiYgdGhpcy5pbnB1dC5sYXN0bmFtZSAmJiB0aGlzLmlucHV0LmVtYWlsICYmIHRoaXMuaW5wdXQucGFzc3dvcmQpIHtcbiAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiYWNjb3VudFwiLCBKU09OLnN0cmluZ2lmeSh0aGlzLmlucHV0KSk7XG5cbiAgICAgICAgICAgIGZpcmViYXNlLmNyZWF0ZVVzZXIoe2VtYWlsOiB0aGlzLmlucHV0LmVtYWlsLCBwYXNzd29yZDp0aGlzLmlucHV0LnBhc3N3b3JkfSlcbiAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgIG9uZnVsZmlsbGVkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDUkVBVEUgVVNFUiBTVUNDRVNTIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIob25mdWxmaWxsZWQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25yZWplY3RlZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ1JFQVRFIFVTRVIgRkFJTEVEIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIob25yZWplY3RlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5sb2NhdGlvbi5iYWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShcIkFsbCBGaWVsZHMgUmVxdWlyZWQhXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBjaGVjaygpIHtcbiAgICAgICAgY29uc29sZS5kaXIodGhpcy5pbnB1dCk7XG4gICAgfVxuICAgIHB1YmxpYyBnb0JhY2soKSB7XG4gICAgICAgIHRoaXMubG9jYXRpb24uYmFjaygpO1xuICAgIH1cbiAgICBcbn0iXX0=