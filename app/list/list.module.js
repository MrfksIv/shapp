"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("nativescript-angular/common");
var forms_1 = require("nativescript-angular/forms");
var shared_module_1 = require("../shared/shared.module");
var list_component_1 = require("./list-component/list.component");
var list_item_component_1 = require("./list-item-component/list-item.component");
var list_routing_module_1 = require("./list-routing.module");
var angular_1 = require("nativescript-pro-ui/sidedrawer/angular");
var angular_2 = require("nativescript-pro-ui/listview/angular");
var list_service_1 = require("./list.service");
var lists_service_1 = require("./lists.service");
var ListModule = /** @class */ (function () {
    function ListModule() {
    }
    ListModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.NativeScriptCommonModule,
                forms_1.NativeScriptFormsModule,
                list_routing_module_1.ListRoutingModule,
                shared_module_1.SharedModule,
                angular_1.NativeScriptUISideDrawerModule,
                angular_2.NativeScriptUIListViewModule
            ],
            declarations: [
                list_component_1.ListComponent,
                list_item_component_1.ListItemComponent
            ],
            providers: [
                list_service_1.ListService,
                lists_service_1.ListsService
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], ListModule);
    return ListModule;
}());
exports.ListModule = ListModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaXN0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyRDtBQUMzRCxzREFBdUU7QUFDdkUsb0RBQXFFO0FBRXJFLHlEQUFzRDtBQUN0RCxrRUFBZ0U7QUFDaEUsaUZBQThFO0FBQzlFLDZEQUEwRDtBQUMxRCxrRUFBd0Y7QUFDeEYsZ0VBQW9GO0FBQ3BGLCtDQUE2QztBQUM3QyxpREFBK0M7QUF1Qi9DO0lBQUE7SUFBMEIsQ0FBQztJQUFkLFVBQVU7UUFyQnRCLGVBQVEsQ0FBQztZQUNOLE9BQU8sRUFBRTtnQkFDTCxpQ0FBd0I7Z0JBQ3hCLCtCQUF1QjtnQkFDdkIsdUNBQWlCO2dCQUNqQiw0QkFBWTtnQkFDWix3Q0FBOEI7Z0JBQzlCLHNDQUE0QjthQUMvQjtZQUNELFlBQVksRUFBRTtnQkFDViw4QkFBYTtnQkFDYix1Q0FBaUI7YUFDcEI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsMEJBQVc7Z0JBQ1gsNEJBQVk7YUFDZjtZQUNELE9BQU8sRUFBRTtnQkFDTCx1QkFBZ0I7YUFDbkI7U0FDSixDQUFDO09BQ1csVUFBVSxDQUFJO0lBQUQsaUJBQUM7Q0FBQSxBQUEzQixJQUEyQjtBQUFkLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE5PX0VSUk9SU19TQ0hFTUEgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRDb21tb25Nb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvY29tbW9uXCI7XHJcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XHJcblxyXG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tICcuLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSdcclxuaW1wb3J0IHsgTGlzdENvbXBvbmVudCB9IGZyb20gXCIuL2xpc3QtY29tcG9uZW50L2xpc3QuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IExpc3RJdGVtQ29tcG9uZW50IH0gZnJvbSBcIi4vbGlzdC1pdGVtLWNvbXBvbmVudC9saXN0LWl0ZW0uY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IExpc3RSb3V0aW5nTW9kdWxlIH0gZnJvbSBcIi4vbGlzdC1yb3V0aW5nLm1vZHVsZVwiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRVSVNpZGVEcmF3ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyL2FuZ3VsYXJcIjtcclxuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlMaXN0Vmlld01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL2xpc3R2aWV3L2FuZ3VsYXJcIjsgXHJcbmltcG9ydCB7IExpc3RTZXJ2aWNlIH0gZnJvbSBcIi4vbGlzdC5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IExpc3RzU2VydmljZSB9IGZyb20gXCIuL2xpc3RzLnNlcnZpY2VcIjtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgTmF0aXZlU2NyaXB0Q29tbW9uTW9kdWxlLFxyXG4gICAgICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxyXG4gICAgICAgIExpc3RSb3V0aW5nTW9kdWxlLCAgXHJcbiAgICAgICAgU2hhcmVkTW9kdWxlLFxyXG4gICAgICAgIE5hdGl2ZVNjcmlwdFVJU2lkZURyYXdlck1vZHVsZSxcclxuICAgICAgICBOYXRpdmVTY3JpcHRVSUxpc3RWaWV3TW9kdWxlXHJcbiAgICBdLFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICAgICAgTGlzdENvbXBvbmVudCxcclxuICAgICAgICBMaXN0SXRlbUNvbXBvbmVudFxyXG4gICAgXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIExpc3RTZXJ2aWNlLFxyXG4gICAgICAgIExpc3RzU2VydmljZVxyXG4gICAgXSxcclxuICAgIHNjaGVtYXM6IFtcclxuICAgICAgICBOT19FUlJPUlNfU0NIRU1BXHJcbiAgICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMaXN0TW9kdWxlIHsgfSJdfQ==