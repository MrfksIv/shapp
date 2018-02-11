"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var nativescript_snackbar_1 = require("nativescript-snackbar");
var ApplicationSettings = require("application-settings");
// import * as firebase from 'nativescript-plugin-firebase';
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
            // firebase.createUser({email: this.input.email, password:this.input.password})
            // .then(
            //     onfulfilled => {
            //         console.log("CREATE USER SUCCESS!");
            //         console.dir(onfulfilled);
            //     },
            //     onrejected => {
            //         console.log("CREATE USER FAILED!");
            //         console.dir(onrejected);
            //     }
            // );
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVnaXN0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTBDO0FBQzFDLDBDQUEyQztBQUMzQywrREFBaUQ7QUFFakQsMERBQTREO0FBQzVELDREQUE0RDtBQU81RDtJQUlJLDJCQUEyQixRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3pDLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDVCxXQUFXLEVBQUUsRUFBRTtZQUNmLFVBQVUsRUFBRSxFQUFFO1lBQ2QsT0FBTyxFQUFFLEVBQUU7WUFDWCxVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFBO0lBQ0wsQ0FBQztJQUVNLG9DQUFRLEdBQWY7UUFDSSxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDeEYsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRXJFLCtFQUErRTtZQUMvRSxTQUFTO1lBQ1QsdUJBQXVCO1lBQ3ZCLCtDQUErQztZQUMvQyxvQ0FBb0M7WUFDcEMsU0FBUztZQUNULHNCQUFzQjtZQUN0Qiw4Q0FBOEM7WUFDOUMsbUNBQW1DO1lBQ25DLFFBQVE7WUFDUixLQUFLO1lBRUwsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixDQUFDLElBQUksZ0NBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDcEQsQ0FBQztJQUNMLENBQUM7SUFDTSxpQ0FBSyxHQUFaO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUNNLGtDQUFNLEdBQWI7UUFDSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUF2Q1EsaUJBQWlCO1FBTDdCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLGFBQWE7WUFDdkIsV0FBVyxFQUFFLHlCQUF5QjtTQUN6QyxDQUFDO3lDQUt1QyxpQkFBUTtPQUpwQyxpQkFBaUIsQ0F5QzdCO0lBQUQsd0JBQUM7Q0FBQSxBQXpDRCxJQXlDQztBQXpDWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcclxuaW1wb3J0IHsgU25hY2tCYXIgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNuYWNrYmFyXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG4vLyBpbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tICduYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICAgIHNlbGVjdG9yOiBcIm5zLXJlZ2lzdGVyXCIsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCJyZWdpc3Rlci5jb21wb25lbnQuaHRtbFwiLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgUmVnaXN0ZXJDb21wb25lbnQge1xyXG5cclxuICAgIHB1YmxpYyBpbnB1dDogYW55O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbikge1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSB7XHJcbiAgICAgICAgICAgIFwiZmlyc3RuYW1lXCI6IFwiXCIsXHJcbiAgICAgICAgICAgIFwibGFzdG5hbWVcIjogXCJcIixcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcIlwiLFxyXG4gICAgICAgICAgICBcInBhc3N3b3JkXCI6IFwiXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyKCkge1xyXG4gICAgICAgIGlmKHRoaXMuaW5wdXQuZmlyc3RuYW1lICYmIHRoaXMuaW5wdXQubGFzdG5hbWUgJiYgdGhpcy5pbnB1dC5lbWFpbCAmJiB0aGlzLmlucHV0LnBhc3N3b3JkKSB7XHJcbiAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiYWNjb3VudFwiLCBKU09OLnN0cmluZ2lmeSh0aGlzLmlucHV0KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBmaXJlYmFzZS5jcmVhdGVVc2VyKHtlbWFpbDogdGhpcy5pbnB1dC5lbWFpbCwgcGFzc3dvcmQ6dGhpcy5pbnB1dC5wYXNzd29yZH0pXHJcbiAgICAgICAgICAgIC8vIC50aGVuKFxyXG4gICAgICAgICAgICAvLyAgICAgb25mdWxmaWxsZWQgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiQ1JFQVRFIFVTRVIgU1VDQ0VTUyFcIik7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5kaXIob25mdWxmaWxsZWQpO1xyXG4gICAgICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAgICAgLy8gICAgIG9ucmVqZWN0ZWQgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiQ1JFQVRFIFVTRVIgRkFJTEVEIVwiKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmRpcihvbnJlamVjdGVkKTtcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubG9jYXRpb24uYmFjaygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiQWxsIEZpZWxkcyBSZXF1aXJlZCFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGNoZWNrKCkge1xyXG4gICAgICAgIGNvbnNvbGUuZGlyKHRoaXMuaW5wdXQpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdvQmFjaygpIHtcclxuICAgICAgICB0aGlzLmxvY2F0aW9uLmJhY2soKTtcclxuICAgIH1cclxuICAgIFxyXG59Il19