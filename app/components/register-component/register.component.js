"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var nativescript_snackbar_1 = require("nativescript-snackbar");
var appdata_service_1 = require("../../shared/appdata.service");
var ApplicationSettings = require("application-settings");
var firebase = require("nativescript-plugin-firebase");
var RegisterComponent = /** @class */ (function () {
    function RegisterComponent(location, appData) {
        this.location = location;
        this.appData = appData;
        this.input = {
            "firstname": "",
            "lastname": "",
            "email": "",
            "password": ""
        };
    }
    RegisterComponent.prototype.register = function () {
        var _this = this;
        if (this.input.firstname && this.input.lastname && this.input.email && this.input.password) {
            ApplicationSettings.setString("account", JSON.stringify(this.input));
            firebase.createUser({ email: this.input.email, password: this.input.password })
                .then(function (onfulfilled) {
                var user_data = {
                    'uid': onfulfilled.key,
                    'user_name': _this.input.firstname + " " + _this.input.lastname,
                    'email': _this.input.email
                };
                firebase.push('/users', user_data).then(function (result) {
                    console.log("REGISTER PUSH RESULT:");
                    console.dir(result);
                    var user = {};
                    user[result.key] = user_data; // the key is the property containing the user's data
                    // store user's data locally
                    ApplicationSettings.setString('user_key', result.key);
                    ApplicationSettings.setString('user', JSON.stringify(user));
                    _this.appData.updateUser({
                        'is_loggedin': true,
                        'username': user_data['user_name'],
                        'email': user_data['email']
                    });
                });
                firebase.sendEmailVerification().then(function () {
                    (new nativescript_snackbar_1.SnackBar()).simple("Email verification sent. Please check your mail.");
                }, function (error) {
                    (new nativescript_snackbar_1.SnackBar()).simple("An error occurred while sending your verification email.");
                });
            }, function (onrejected) {
                console.log("CREATE USER FAILED!");
                (new nativescript_snackbar_1.SnackBar()).simple(onrejected.replace("com.google.firebase.auth.FirebaseAuthUserCollisionException: ", ""));
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
        __metadata("design:paramtypes", [common_1.Location, appdata_service_1.AppDataService])
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVnaXN0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTBDO0FBQzFDLDBDQUEyQztBQUMzQywrREFBaUQ7QUFFakQsZ0VBQThEO0FBRTlELDBEQUE0RDtBQUM1RCx1REFBeUQ7QUFPekQ7SUFJSSwyQkFBMkIsUUFBa0IsRUFBVSxPQUF1QjtRQUFuRCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFFMUUsSUFBSSxDQUFDLEtBQUssR0FBRztZQUNULFdBQVcsRUFBRSxFQUFFO1lBQ2YsVUFBVSxFQUFFLEVBQUU7WUFDZCxPQUFPLEVBQUUsRUFBRTtZQUNYLFVBQVUsRUFBRSxFQUFFO1NBQ2pCLENBQUE7SUFDTCxDQUFDO0lBRU0sb0NBQVEsR0FBZjtRQUFBLGlCQXVEQztRQXRERyxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDeEYsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRXJFLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFDLENBQUM7aUJBQzNFLElBQUksQ0FDRCxVQUFBLFdBQVc7Z0JBQ1AsSUFBSSxTQUFTLEdBQUc7b0JBQ1osS0FBSyxFQUFFLFdBQVcsQ0FBQyxHQUFHO29CQUN0QixXQUFXLEVBQUssS0FBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLFNBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFVO29CQUM3RCxPQUFPLEVBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO2lCQUM1QixDQUFDO2dCQUVGLFFBQVEsQ0FBQyxJQUFJLENBQ1QsUUFBUSxFQUNSLFNBQVMsQ0FDVixDQUFDLElBQUksQ0FDSixVQUFDLE1BQU07b0JBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO29CQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNwQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxxREFBcUQ7b0JBQ25GLDRCQUE0QjtvQkFDNUIsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RELG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUc1RCxLQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQzt3QkFDcEIsYUFBYSxFQUFFLElBQUk7d0JBQ25CLFVBQVUsRUFBRyxTQUFTLENBQUMsV0FBVyxDQUFDO3dCQUNuQyxPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQztxQkFDOUIsQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FDRixDQUFDO2dCQUVKLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLElBQUksQ0FDcEM7b0JBQ0ssQ0FBQyxJQUFJLGdDQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO2dCQUM5RSxDQUFDLEVBQ0wsVUFBQyxLQUFLO29CQUNBLENBQUMsSUFBSSxnQ0FBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsMERBQTBELENBQUMsQ0FBQztnQkFDdEYsQ0FBQyxDQUNKLENBQUM7WUFDTixDQUFDLEVBQ0QsVUFBQSxVQUFVO2dCQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxJQUFJLGdDQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLCtEQUErRCxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckgsQ0FBQyxDQUNKLENBQUM7WUFFRixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLENBQUMsSUFBSSxnQ0FBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNwRCxDQUFDO0lBQ0wsQ0FBQztJQUNNLGlDQUFLLEdBQVo7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ00sa0NBQU0sR0FBYjtRQUNJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQTNFUSxpQkFBaUI7UUFMN0IsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsYUFBYTtZQUN2QixXQUFXLEVBQUUseUJBQXlCO1NBQ3pDLENBQUM7eUNBS3VDLGlCQUFRLEVBQW1CLGdDQUFjO09BSnJFLGlCQUFpQixDQTZFN0I7SUFBRCx3QkFBQztDQUFBLEFBN0VELElBNkVDO0FBN0VZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xyXG5pbXBvcnQgeyBTbmFja0JhciB9IGZyb20gXCJuYXRpdmVzY3JpcHQtc25hY2tiYXJcIjtcclxuXHJcbmltcG9ydCB7IEFwcERhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2FwcGRhdGEuc2VydmljZSc7XHJcblxyXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tICduYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICAgIHNlbGVjdG9yOiBcIm5zLXJlZ2lzdGVyXCIsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCJyZWdpc3Rlci5jb21wb25lbnQuaHRtbFwiLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgUmVnaXN0ZXJDb21wb25lbnQge1xyXG5cclxuICAgIHB1YmxpYyBpbnB1dDogYW55O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbiwgcHJpdmF0ZSBhcHBEYXRhOiBBcHBEYXRhU2VydmljZSkge1xyXG5cclxuICAgICAgICB0aGlzLmlucHV0ID0ge1xyXG4gICAgICAgICAgICBcImZpcnN0bmFtZVwiOiBcIlwiLFxyXG4gICAgICAgICAgICBcImxhc3RuYW1lXCI6IFwiXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJcIixcclxuICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBcIlwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlcigpIHtcclxuICAgICAgICBpZih0aGlzLmlucHV0LmZpcnN0bmFtZSAmJiB0aGlzLmlucHV0Lmxhc3RuYW1lICYmIHRoaXMuaW5wdXQuZW1haWwgJiYgdGhpcy5pbnB1dC5wYXNzd29yZCkge1xyXG4gICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcImFjY291bnRcIiwgSlNPTi5zdHJpbmdpZnkodGhpcy5pbnB1dCkpO1xyXG5cclxuICAgICAgICAgICAgZmlyZWJhc2UuY3JlYXRlVXNlcih7ZW1haWw6IHRoaXMuaW5wdXQuZW1haWwsIHBhc3N3b3JkOnRoaXMuaW5wdXQucGFzc3dvcmR9KVxyXG4gICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgIG9uZnVsZmlsbGVkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdXNlcl9kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAndWlkJzogb25mdWxmaWxsZWQua2V5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAndXNlcl9uYW1lJzogYCR7dGhpcy5pbnB1dC5maXJzdG5hbWV9ICR7dGhpcy5pbnB1dC5sYXN0bmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZW1haWwnOiB0aGlzLmlucHV0LmVtYWlsXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmaXJlYmFzZS5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnL3VzZXJzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9kYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICApLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSRUdJU1RFUiBQVVNIIFJFU1VMVDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXIgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJbcmVzdWx0LmtleV0gPSB1c2VyX2RhdGE7IC8vIHRoZSBrZXkgaXMgdGhlIHByb3BlcnR5IGNvbnRhaW5pbmcgdGhlIHVzZXIncyBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSB1c2VyJ3MgZGF0YSBsb2NhbGx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZygndXNlcl9rZXknLCByZXN1bHQua2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCd1c2VyJywgSlNPTi5zdHJpbmdpZnkodXNlcikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwRGF0YS51cGRhdGVVc2VyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNfbG9nZ2VkaW4nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1c2VybmFtZSc6ICB1c2VyX2RhdGFbJ3VzZXJfbmFtZSddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdlbWFpbCc6IHVzZXJfZGF0YVsnZW1haWwnXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmaXJlYmFzZS5zZW5kRW1haWxWZXJpZmljYXRpb24oKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJFbWFpbCB2ZXJpZmljYXRpb24gc2VudC4gUGxlYXNlIGNoZWNrIHlvdXIgbWFpbC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBzZW5kaW5nIHlvdXIgdmVyaWZpY2F0aW9uIGVtYWlsLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25yZWplY3RlZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDUkVBVEUgVVNFUiBGQUlMRUQhXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKG9ucmVqZWN0ZWQucmVwbGFjZShcImNvbS5nb29nbGUuZmlyZWJhc2UuYXV0aC5GaXJlYmFzZUF1dGhVc2VyQ29sbGlzaW9uRXhjZXB0aW9uOiBcIiwgXCJcIikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sb2NhdGlvbi5iYWNrKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJBbGwgRmllbGRzIFJlcXVpcmVkIVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2hlY2soKSB7XHJcbiAgICAgICAgY29uc29sZS5kaXIodGhpcy5pbnB1dCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ29CYWNrKCkge1xyXG4gICAgICAgIHRoaXMubG9jYXRpb24uYmFjaygpO1xyXG4gICAgfVxyXG4gICAgXHJcbn0iXX0=