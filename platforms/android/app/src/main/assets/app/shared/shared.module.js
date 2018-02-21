"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("nativescript-angular/common");
var my_drawer_item_component_1 = require("./my-drawer-item/my-drawer-item.component");
var my_drawer_component_1 = require("./my-drawer/my-drawer.component");
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.NativeScriptCommonModule
            ],
            declarations: [
                my_drawer_component_1.MyDrawerComponent,
                my_drawer_item_component_1.MyDrawerItemComponent
            ],
            exports: [
                my_drawer_component_1.MyDrawerComponent
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNoYXJlZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0Qsc0RBQXVFO0FBR3ZFLHNGQUFrRjtBQUNsRix1RUFBb0U7QUFpQnBFO0lBQUE7SUFBNEIsQ0FBQztJQUFoQixZQUFZO1FBZnhCLGVBQVEsQ0FBQztZQUNOLE9BQU8sRUFBRTtnQkFDTCxpQ0FBd0I7YUFDM0I7WUFDRCxZQUFZLEVBQUU7Z0JBQ1YsdUNBQWlCO2dCQUNqQixnREFBcUI7YUFDeEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsdUNBQWlCO2FBQ3BCO1lBQ0QsT0FBTyxFQUFFO2dCQUNMLHVCQUFnQjthQUNuQjtTQUNKLENBQUM7T0FDVyxZQUFZLENBQUk7SUFBRCxtQkFBQztDQUFBLEFBQTdCLElBQTZCO0FBQWhCLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE5PX0VSUk9SU19TQ0hFTUEgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRDb21tb25Nb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvY29tbW9uXCI7XHJcblxyXG5cclxuaW1wb3J0IHsgTXlEcmF3ZXJJdGVtQ29tcG9uZW50IH0gZnJvbSBcIi4vbXktZHJhd2VyLWl0ZW0vbXktZHJhd2VyLWl0ZW0uY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IE15RHJhd2VyQ29tcG9uZW50IH0gZnJvbSBcIi4vbXktZHJhd2VyL215LWRyYXdlci5jb21wb25lbnRcIjtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgTmF0aXZlU2NyaXB0Q29tbW9uTW9kdWxlXHJcbiAgICBdLFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICAgICAgTXlEcmF3ZXJDb21wb25lbnQsXHJcbiAgICAgICAgTXlEcmF3ZXJJdGVtQ29tcG9uZW50XHJcbiAgICBdLFxyXG4gICAgZXhwb3J0czogW1xyXG4gICAgICAgIE15RHJhd2VyQ29tcG9uZW50XHJcbiAgICBdLFxyXG4gICAgc2NoZW1hczogW1xyXG4gICAgICAgIE5PX0VSUk9SU19TQ0hFTUFcclxuICAgIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFNoYXJlZE1vZHVsZSB7IH1cclxuIl19