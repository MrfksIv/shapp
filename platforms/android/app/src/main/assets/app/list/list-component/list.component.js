"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var sidedrawer_1 = require("nativescript-pro-ui/sidedrawer");
var angular_1 = require("nativescript-pro-ui/sidedrawer/angular");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var Application = require("tns-core-modules/application");
var ApplicationSettings = require("application-settings");
var list_service_1 = require("../list.service");
var lists_service_1 = require("../lists.service");
var dataitem_class_1 = require("../../classes/dataitem.class");
var posts = require('../posts.json');
var ListComponent = /** @class */ (function () {
    function ListComponent(router, listService, listsService) {
        this.router = router;
        this.listService = listService;
        this.listsService = listsService;
        this.getLists();
    }
    ListComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!ApplicationSettings.getBoolean("authenticated", false)) {
            this.router.navigate(["/login"], { clearHistory: true });
        }
        this.listsSubscription = this.listsService.getListsAsObservable()
            .subscribe(function (lists) {
            if (Array.isArray(lists)) {
                lists = _this.sortLists(lists);
                console.log("RECEIVED LISTS AT LIST COMP:::");
                console.dir(lists);
                _this._lists = new observable_array_1.ObservableArray();
                for (var i = 0; i < lists.length; i++) {
                    _this._lists.splice(0, 0, lists[i]);
                }
                // console.dir(this._lists);
            }
        });
        this._sideDrawerTransition = new sidedrawer_1.SlideInOnTopTransition();
        this._dataItems = new observable_array_1.ObservableArray(this.listService.getDataItems());
    };
    Object.defineProperty(ListComponent.prototype, "sideDrawerTransition", {
        get: function () {
            return this._sideDrawerTransition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListComponent.prototype, "dataItems", {
        get: function () {
            return this._dataItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListComponent.prototype, "lists", {
        get: function () {
            return this._lists;
        },
        enumerable: true,
        configurable: true
    });
    ListComponent.prototype.onDrawerButtonTap = function () {
        this.drawerComponent.sideDrawer.showDrawer();
    };
    ListComponent.prototype.onPullToRefreshInitiatedExample = function (args) {
        var that = new WeakRef(this);
        timerModule.setTimeout(function () {
            var initialNumberOfItems = that.get()._numberOfAddedItems;
            for (var i = that.get()._numberOfAddedItems; i < initialNumberOfItems + 2; i++) {
                if (i > posts.names.length - 1) {
                    break;
                }
                var imageUri = Application.android ? posts.images[i].toLowerCase() : posts.images[i];
                that.get()._dataItems.splice(0, 0, new dataitem_class_1.DataItem(i, posts.names[i], "This is item description", posts.titles[i], posts.text[i], "res://" + imageUri));
                that.get()._numberOfAddedItems++;
            }
            var listView = args.object;
            listView.notifyPullToRefreshFinished();
        }, 1000);
    };
    ListComponent.prototype.onPullToRefreshInitiated = function (args) {
        var listView = args.object;
        this.getLists();
        listView.notifyPullToRefreshFinished();
    };
    ListComponent.prototype.addList = function () {
        this.listsService.createNewList(ApplicationSettings.getString('uid'));
    };
    ListComponent.prototype.getLists = function () {
        this.listsService.getUserLists(ApplicationSettings.getString('uid'));
    };
    ListComponent.prototype.check = function () {
        console.log(ApplicationSettings.getString('uid'));
    };
    ListComponent.prototype.sortLists = function (list) {
        list.sort(function (a, b) {
            if (a['dateModified'] < b['dateModified']) {
                return -1;
            }
            else if (a['dateModified'] > b['dateModified']) {
                return 1;
            }
            else {
                return 0;
            }
        });
        return list;
    };
    __decorate([
        core_1.ViewChild("drawer"),
        __metadata("design:type", angular_1.RadSideDrawerComponent)
    ], ListComponent.prototype, "drawerComponent", void 0);
    ListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ns-list',
            providers: [list_service_1.ListService],
            templateUrl: 'list.component.html',
            styleUrls: ['list.component.css']
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions, list_service_1.ListService, lists_service_1.ListsService])
    ], ListComponent);
    return ListComponent;
}());
exports.ListComponent = ListComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE0RTtBQUM1RSxzREFBK0Q7QUFFL0QsNkRBQTZHO0FBQzdHLGtFQUFnRjtBQUNoRiwyRUFBeUU7QUFDekUsb0RBQXNEO0FBQ3RELDBEQUE0RDtBQUc1RCwwREFBNEQ7QUFLNUQsZ0RBQThDO0FBQzlDLGtEQUFnRDtBQUVoRCwrREFBd0Q7QUFJeEQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBVXJDO0lBU0ksdUJBQW9CLE1BQXdCLEVBQVUsV0FBd0IsRUFBVSxZQUEwQjtRQUE5RixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDOUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxnQ0FBUSxHQUFSO1FBQUEsaUJBc0JDO1FBckJHLEVBQUUsQ0FBQSxDQUFDLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzdELENBQUM7UUFFRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsRUFBRTthQUNoRSxTQUFTLENBQUUsVUFBQSxLQUFLO1lBQ2IsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLEtBQUssR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7Z0JBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ25CLEtBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxrQ0FBZSxFQUFRLENBQUM7Z0JBQzFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUNsQyxLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUVELDRCQUE0QjtZQUNoQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxtQ0FBc0IsRUFBRSxDQUFDO1FBQzFELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxrQ0FBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsc0JBQUksK0NBQW9CO2FBQXhCO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztRQUN0QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLG9DQUFTO2FBQWI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUMzQixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLGdDQUFLO2FBQVQ7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QixDQUFDOzs7T0FBQTtJQUdELHlDQUFpQixHQUFqQjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFFTSx1REFBK0IsR0FBdEMsVUFBdUMsSUFBdUI7UUFDMUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsV0FBVyxDQUFDLFVBQVUsQ0FBRTtZQUNwQixJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztZQUM1RCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxHQUFHLG9CQUFvQixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM3RSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0IsS0FBSyxDQUFDO2dCQUNWLENBQUM7Z0JBQ0QsSUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkYsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLHlCQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsMEJBQTBCLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNySixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUNyQyxDQUFDO1lBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMzQixRQUFRLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztRQUMzQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sZ0RBQXdCLEdBQS9CLFVBQWdDLElBQXVCO1FBQ25ELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hCLFFBQVEsQ0FBQywyQkFBMkIsRUFBRSxDQUFDO0lBRTNDLENBQUM7SUFFRCwrQkFBTyxHQUFQO1FBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELGdDQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsNkJBQUssR0FBTDtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELGlDQUFTLEdBQVQsVUFBVSxJQUFpQjtRQUN2QixJQUFJLENBQUMsSUFBSSxDQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUM7WUFDWixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2QsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0MsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBcEdvQjtRQUFwQixnQkFBUyxDQUFDLFFBQVEsQ0FBQztrQ0FBa0IsZ0NBQXNCOzBEQUFDO0lBRHBELGFBQWE7UUFQekIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsU0FBUztZQUNuQixTQUFTLEVBQUUsQ0FBQywwQkFBVyxDQUFDO1lBQ3hCLFdBQVcsRUFBRSxxQkFBcUI7WUFDbEMsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUM7U0FDcEMsQ0FBQzt5Q0FVOEIseUJBQWdCLEVBQXVCLDBCQUFXLEVBQXdCLDRCQUFZO09BVHpHLGFBQWEsQ0F1R3pCO0lBQUQsb0JBQUM7Q0FBQSxBQXZHRCxJQXVHQztBQXZHWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IFNuYWNrQmFyIH0gZnJvbSAnbmF0aXZlc2NyaXB0LXNuYWNrYmFyJztcclxuaW1wb3J0IHsgRHJhd2VyVHJhbnNpdGlvbkJhc2UsIFNsaWRlSW5PblRvcFRyYW5zaXRpb24sIFJhZFNpZGVEcmF3ZXIgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyXCI7XHJcbmltcG9ydCB7IFJhZFNpZGVEcmF3ZXJDb21wb25lbnQgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyL2FuZ3VsYXJcIjtcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZUFycmF5IH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvZGF0YS9vYnNlcnZhYmxlLWFycmF5XCI7XHJcbmltcG9ydCAqIGFzIHRpbWVyTW9kdWxlIGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvdGltZXInO1xyXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvbiBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzL1N1YnNjcmlwdGlvbic7XHJcblxyXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gJ2FwcGxpY2F0aW9uLXNldHRpbmdzJztcclxuaW1wb3J0ICogYXMgZmlyZWJhc2UgZnJvbSAnbmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZSc7XHJcblxyXG5pbXBvcnQgeyBIdHRwU2VydmljZSB9IGZyb20gJy4uLy4uL2h0dHAuc2VydmljZSc7XHJcbmltcG9ydCB7IEFwcERhdGFTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9hcHBkYXRhLnNlcnZpY2VcIjtcclxuaW1wb3J0IHsgTGlzdFNlcnZpY2UgfSBmcm9tICcuLi9saXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMaXN0c1NlcnZpY2UgfSBmcm9tICcuLi9saXN0cy5zZXJ2aWNlJztcclxuXHJcbmltcG9ydCB7IERhdGFJdGVtIH0gZnJvbSAnLi4vLi4vY2xhc3Nlcy9kYXRhaXRlbS5jbGFzcyc7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tICcuLi8uLi9jbGFzc2VzL2xpc3QuY2xhc3MnO1xyXG5pbXBvcnQgeyBMaXN0Vmlld0V2ZW50RGF0YSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1wcm8tdWkvbGlzdHZpZXcnO1xyXG5cclxudmFyIHBvc3RzID0gcmVxdWlyZSgnLi4vcG9zdHMuanNvbicpO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICAgIHNlbGVjdG9yOiAnbnMtbGlzdCcsXHJcbiAgICBwcm92aWRlcnM6IFtMaXN0U2VydmljZV0sXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2xpc3QuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJ2xpc3QuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICAgIEBWaWV3Q2hpbGQoXCJkcmF3ZXJcIikgZHJhd2VyQ29tcG9uZW50OiBSYWRTaWRlRHJhd2VyQ29tcG9uZW50O1xyXG5cclxuICAgIHByaXZhdGUgX3NpZGVEcmF3ZXJUcmFuc2l0aW9uOiBEcmF3ZXJUcmFuc2l0aW9uQmFzZTtcclxuICAgIHByaXZhdGUgX2RhdGFJdGVtczogT2JzZXJ2YWJsZUFycmF5PERhdGFJdGVtPjtcclxuICAgIHB1YmxpYyBfbGlzdHM6IE9ic2VydmFibGVBcnJheTxMaXN0PjtcclxuICAgIHByaXZhdGUgbGlzdHNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICAgIHByaXZhdGUgX251bWJlck9mQWRkZWRJdGVtcztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlcjogUm91dGVyRXh0ZW5zaW9ucywgcHJpdmF0ZSBsaXN0U2VydmljZTogTGlzdFNlcnZpY2UsIHByaXZhdGUgbGlzdHNTZXJ2aWNlOiBMaXN0c1NlcnZpY2Upe1xyXG4gICAgICAgIHRoaXMuZ2V0TGlzdHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgICAgICBpZighQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCBmYWxzZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2xvZ2luXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubGlzdHNTdWJzY3JpcHRpb24gPSB0aGlzLmxpc3RzU2VydmljZS5nZXRMaXN0c0FzT2JzZXJ2YWJsZSgpXHJcbiAgICAgICAgLnN1YnNjcmliZSggbGlzdHMgPT4ge1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0cykpIHtcclxuICAgICAgICAgICAgICAgIGxpc3RzID0gdGhpcy5zb3J0TGlzdHMobGlzdHMpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSRUNFSVZFRCBMSVNUUyBBVCBMSVNUIENPTVA6OjpcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihsaXN0cyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0cyA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8TGlzdD4oKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaSA8IGxpc3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGlzdHMuc3BsaWNlKDAsIDAsIGxpc3RzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcih0aGlzLl9saXN0cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fc2lkZURyYXdlclRyYW5zaXRpb24gPSBuZXcgU2xpZGVJbk9uVG9wVHJhbnNpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuX2RhdGFJdGVtcyA9IG5ldyBPYnNlcnZhYmxlQXJyYXkodGhpcy5saXN0U2VydmljZS5nZXREYXRhSXRlbXMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNpZGVEcmF3ZXJUcmFuc2l0aW9uKCk6IERyYXdlclRyYW5zaXRpb25CYXNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2lkZURyYXdlclRyYW5zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRhdGFJdGVtcygpOiBPYnNlcnZhYmxlQXJyYXk8RGF0YUl0ZW0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YUl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsaXN0cygpOiBPYnNlcnZhYmxlQXJyYXk8TGlzdD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0cztcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25EcmF3ZXJCdXR0b25UYXAoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXJDb21wb25lbnQuc2lkZURyYXdlci5zaG93RHJhd2VyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uUHVsbFRvUmVmcmVzaEluaXRpYXRlZEV4YW1wbGUoYXJnczogTGlzdFZpZXdFdmVudERhdGEpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IG5ldyBXZWFrUmVmKHRoaXMpO1xyXG4gICAgICAgIHRpbWVyTW9kdWxlLnNldFRpbWVvdXQoICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW5pdGlhbE51bWJlck9mSXRlbXMgPSB0aGF0LmdldCgpLl9udW1iZXJPZkFkZGVkSXRlbXM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSB0aGF0LmdldCgpLl9udW1iZXJPZkFkZGVkSXRlbXM7IGkgPCBpbml0aWFsTnVtYmVyT2ZJdGVtcyArIDI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPiBwb3N0cy5uYW1lcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbWFnZVVyaSA9IEFwcGxpY2F0aW9uLmFuZHJvaWQgPyBwb3N0cy5pbWFnZXNbaV0udG9Mb3dlckNhc2UoKSA6IHBvc3RzLmltYWdlc1tpXTtcclxuICAgICAgICAgICAgICAgIHRoYXQuZ2V0KCkuX2RhdGFJdGVtcy5zcGxpY2UoMCwgMCwgbmV3IERhdGFJdGVtKGksIHBvc3RzLm5hbWVzW2ldLCBcIlRoaXMgaXMgaXRlbSBkZXNjcmlwdGlvblwiLCBwb3N0cy50aXRsZXNbaV0sIHBvc3RzLnRleHRbaV0sIFwicmVzOi8vXCIgKyBpbWFnZVVyaSkpO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5nZXQoKS5fbnVtYmVyT2ZBZGRlZEl0ZW1zKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGxpc3RWaWV3ID0gYXJncy5vYmplY3Q7XHJcbiAgICAgICAgICAgIGxpc3RWaWV3Lm5vdGlmeVB1bGxUb1JlZnJlc2hGaW5pc2hlZCgpO1xyXG4gICAgICAgIH0sIDEwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblB1bGxUb1JlZnJlc2hJbml0aWF0ZWQoYXJnczogTGlzdFZpZXdFdmVudERhdGEpIHtcclxuICAgICAgICB2YXIgbGlzdFZpZXcgPSBhcmdzLm9iamVjdDtcclxuICAgICAgICB0aGlzLmdldExpc3RzKCk7XHJcbiAgICAgICAgbGlzdFZpZXcubm90aWZ5UHVsbFRvUmVmcmVzaEZpbmlzaGVkKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZExpc3QoKSB7XHJcbiAgICAgICAgdGhpcy5saXN0c1NlcnZpY2UuY3JlYXRlTmV3TGlzdChBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygndWlkJykpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExpc3RzKCkge1xyXG4gICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlLmdldFVzZXJMaXN0cyhBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygndWlkJykpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1aWQnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc29ydExpc3RzKGxpc3Q6IEFycmF5PExpc3Q+KSB7XHJcbiAgICAgICAgbGlzdC5zb3J0KCAoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYVsnZGF0ZU1vZGlmaWVkJ10gPCBiWydkYXRlTW9kaWZpZWQnXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFbJ2RhdGVNb2RpZmllZCddID4gYlsnZGF0ZU1vZGlmaWVkJ10pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbiJdfQ==