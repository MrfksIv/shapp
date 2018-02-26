"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var nativescript_snackbar_1 = require("nativescript-snackbar");
var sidedrawer_1 = require("nativescript-pro-ui/sidedrawer");
var angular_1 = require("nativescript-pro-ui/sidedrawer/angular");
var angular_2 = require("nativescript-pro-ui/listview/angular");
var view_1 = require("tns-core-modules/ui/core/view");
var utils_1 = require("tns-core-modules/utils/utils");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var ApplicationSettings = require("application-settings");
var moment = require("moment");
var appdata_service_1 = require("../../shared/appdata.service");
var list_service_1 = require("../list.service");
var lists_service_1 = require("../lists.service");
var posts = require('../posts.json');
var ListComponent = /** @class */ (function () {
    function ListComponent(router, listService, listsService, appData) {
        this.router = router;
        this.listService = listService;
        this.listsService = listsService;
        this.appData = appData;
        this.animationApplied = false;
        this.listDescription = '';
        this.isLoading = false;
        this.rand = 0;
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
                _this._lists = JSON.parse(JSON.stringify(lists));
                _this.rand = Math.random();
                _this._lists = _this._lists.slice();
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
    ListComponent.prototype.goToList = function (listkey) {
        this.appData.setActiveList(listkey);
        this.router.navigate(["/list-item"]);
    };
    ListComponent.prototype.onPullToRefreshInitiated = function (args) {
        var listView = args.object;
        this.getLists();
        listView.notifyPullToRefreshFinished();
    };
    ListComponent.prototype.addList = function (target) {
        var _this = this;
        console.log("textfield input:", this.listDescription);
        var textField = this.groceryTextField.nativeElement;
        if (this.listDescription.trim() === '') {
            // if the user clicked the add button and the textfield is empty,
            // focus the textfield and return
            (new nativescript_snackbar_1.SnackBar()).simple("To create a new list, first enter a description");
            if (target === "button") {
                textField.focus();
            }
            return;
        }
        // Dismiss the keyboard
        textField.dismissSoftInput();
        this.showActivityIndicator();
        var list = {
            creatorUID: ApplicationSettings.getString('uid'),
            dateCreated: moment().format("YYYY-MM-DD HH:mm:ss"),
            dateModified: moment().format("YYYY-MM-DD HH:mm:ss"),
            description: this.listDescription
        };
        this._lists.unshift(list);
        this.listsService.createNewList(list)
            .then(function (result) {
            console.log("saved!");
            console.dir(result);
            _this.listDescription = '';
            setTimeout(function () {
                _this.hideActivityIndicator();
                _this.getLists();
            }, 1500);
        }).catch(function (err) {
            _this.hideActivityIndicator();
            (new nativescript_snackbar_1.SnackBar()).simple("List couldn't be created!");
        });
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
    ListComponent.prototype.showActivityIndicator = function () {
        this.isLoading = true;
    };
    ListComponent.prototype.hideActivityIndicator = function () {
        this.isLoading = false;
    };
    ListComponent.prototype.onCellSwiping = function (args) {
        var swipeLimits = args.data.swipeLimits;
        var swipeView = args['swipeView'];
        this.mainView = args['mainView'];
        this.leftItem = swipeView.getViewById('left-stack');
        this.rightItem = swipeView.getViewById('right-stack');
        if (args.data.x > 0) {
            var leftDimensions = view_1.View.measureChild(this.leftItem.parent, this.leftItem, utils_1.layout.makeMeasureSpec(Math.abs(args.data.x), utils_1.layout.EXACTLY), utils_1.layout.makeMeasureSpec(this.mainView.getMeasuredHeight(), utils_1.layout.EXACTLY));
            view_1.View.layoutChild(this.leftItem.parent, this.leftItem, 0, 0, leftDimensions.measuredWidth, leftDimensions.measuredHeight);
            this.hideOtherSwipeTemplateView("left");
        }
        else {
            var rightDimensions = view_1.View.measureChild(this.rightItem.parent, this.rightItem, utils_1.layout.makeMeasureSpec(Math.abs(args.data.x), utils_1.layout.EXACTLY), utils_1.layout.makeMeasureSpec(this.mainView.getMeasuredHeight(), utils_1.layout.EXACTLY));
            view_1.View.layoutChild(this.rightItem.parent, this.rightItem, this.mainView.getMeasuredWidth() - rightDimensions.measuredWidth, 0, this.mainView.getMeasuredWidth(), rightDimensions.measuredHeight);
            this.hideOtherSwipeTemplateView("right");
        }
    };
    ListComponent.prototype.hideOtherSwipeTemplateView = function (currentSwipeView) {
        switch (currentSwipeView) {
            case "left":
                if (this.rightItem.getActualSize().width != 0) {
                    view_1.View.layoutChild(this.rightItem.parent, this.rightItem, this.mainView.getMeasuredWidth(), 0, this.mainView.getMeasuredWidth(), 0);
                }
                break;
            case "right":
                if (this.leftItem.getActualSize().width != 0) {
                    view_1.View.layoutChild(this.leftItem.parent, this.leftItem, 0, 0, 0, 0);
                }
                break;
            default:
                break;
        }
    };
    ListComponent.prototype.onSwipeCellStarted = function (args) {
        var swipeLimits = args.data.swipeLimits;
        swipeLimits.threshold = args['mainView'].getMeasuredWidth() * 0.2; // 20% of whole width
        swipeLimits.left = swipeLimits.right = args['mainView'].getMeasuredWidth() * 0.65; // 65% of whole width
    };
    // << angular-listview-swipe-action-multiple-limits
    ListComponent.prototype.onSwipeCellFinished = function (args) {
        if (args.data.x > 200) {
            console.log("Perform left action");
        }
        else if (args.data.x < -200) {
            console.log("Perform right action");
        }
        this.animationApplied = false;
    };
    ListComponent.prototype.onLeftSwipeClick = function (args) {
        console.log("Button clicked: " + args.object.id + " for item with index: " + this.listViewComponent.listView.items.indexOf(args.object.bindingContext));
        this.listViewComponent.listView.notifySwipeToExecuteFinished();
    };
    ListComponent.prototype.onRightSwipeClick = function (args) {
        console.log("Button clicked: " + args.object.id + " for item with index: " + this.listViewComponent.listView.items.indexOf(args.object.bindingContext));
        this.listViewComponent.listView.notifySwipeToExecuteFinished();
    };
    __decorate([
        core_1.ViewChild("drawer"),
        __metadata("design:type", angular_1.RadSideDrawerComponent)
    ], ListComponent.prototype, "drawerComponent", void 0);
    __decorate([
        core_1.ViewChild("groceryTextField"),
        __metadata("design:type", core_1.ElementRef)
    ], ListComponent.prototype, "groceryTextField", void 0);
    __decorate([
        core_1.ViewChild("myListView"),
        __metadata("design:type", angular_2.RadListViewComponent)
    ], ListComponent.prototype, "listViewComponent", void 0);
    ListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ns-list',
            templateUrl: 'list.component.html',
            styleUrls: ['list.component.css']
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            list_service_1.ListService,
            lists_service_1.ListsService,
            appdata_service_1.AppDataService])
    ], ListComponent);
    return ListComponent;
}());
exports.ListComponent = ListComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF3RjtBQUN4RixzREFBK0Q7QUFDL0QsK0RBQWlEO0FBQ2pELDZEQUE2RztBQUM3RyxrRUFBZ0Y7QUFDaEYsZ0VBQTRFO0FBRTVFLHNEQUFxRDtBQUNyRCxzREFBc0Q7QUFDdEQsMkVBQXlFO0FBSXpFLDBEQUE0RDtBQUU1RCwrQkFBaUM7QUFHakMsZ0VBQThEO0FBQzlELGdEQUE4QztBQUM5QyxrREFBZ0Q7QUFPaEQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBU3JDO0lBb0JJLHVCQUFvQixNQUF3QixFQUN4QixXQUF3QixFQUN4QixZQUEwQixFQUMxQixPQUF1QjtRQUh2QixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUN4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQWRuQyxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFNakMsb0JBQWUsR0FBVyxFQUFFLENBQUM7UUFDN0IsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBT2IsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxnQ0FBUSxHQUFSO1FBQUEsaUJBbUJDO1FBbEJHLEVBQUUsQ0FBQSxDQUFDLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzdELENBQUM7UUFFRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFB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QUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLHdCQUF3QixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDeEosSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO0lBQ25FLENBQUM7SUFyTm9CO1FBQXBCLGdCQUFTLENBQUMsUUFBUSxDQUFDO2tDQUFrQixnQ0FBc0I7MERBQUM7SUFDOUI7UUFBOUIsZ0JBQVMsQ0FBQyxrQkFBa0IsQ0FBQztrQ0FBbUIsaUJBQVU7MkRBQUM7SUFDbkM7UUFBeEIsZ0JBQVMsQ0FBQyxZQUFZLENBQUM7a0NBQW9CLDhCQUFvQjs0REFBQztJQUp4RCxhQUFhO1FBTnpCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsV0FBVyxFQUFFLHFCQUFxQjtZQUNsQyxTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztTQUNwQyxDQUFDO3lDQXFCOEIseUJBQWdCO1lBQ1gsMEJBQVc7WUFDViw0QkFBWTtZQUNqQixnQ0FBYztPQXZCbEMsYUFBYSxDQXlOekI7SUFBRCxvQkFBQztDQUFBLEFBek5ELElBeU5DO0FBek5ZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgQWZ0ZXJWaWV3SW5pdCwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgU25hY2tCYXIgfSBmcm9tICduYXRpdmVzY3JpcHQtc25hY2tiYXInO1xyXG5pbXBvcnQgeyBEcmF3ZXJUcmFuc2l0aW9uQmFzZSwgU2xpZGVJbk9uVG9wVHJhbnNpdGlvbiwgUmFkU2lkZURyYXdlciB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL3NpZGVkcmF3ZXJcIjtcclxuaW1wb3J0IHsgUmFkU2lkZURyYXdlckNvbXBvbmVudCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL3NpZGVkcmF3ZXIvYW5ndWxhclwiO1xyXG5pbXBvcnQgeyBSYWRMaXN0Vmlld0NvbXBvbmVudCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL2xpc3R2aWV3L2FuZ3VsYXJcIjtcclxuaW1wb3J0IHsgVGV4dEZpZWxkIH0gZnJvbSBcInVpL3RleHQtZmllbGRcIjtcclxuaW1wb3J0IHsgVmlldyB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2NvcmUvdmlld1wiO1xyXG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91dGlscy91dGlsc1wiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlQXJyYXkgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9kYXRhL29ic2VydmFibGUtYXJyYXlcIjtcclxuLy8gaW1wb3J0ICogYXMgQXBwbGljYXRpb24gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb25cIjtcclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcy9TdWJzY3JpcHRpb24nO1xyXG5cclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tICdhcHBsaWNhdGlvbi1zZXR0aW5ncyc7XHJcbmltcG9ydCAqIGFzIGZpcmViYXNlIGZyb20gJ25hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2UnO1xyXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcbmltcG9ydCB7IEh0dHBTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vaHR0cC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXBwRGF0YVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2FwcGRhdGEuc2VydmljZVwiO1xyXG5pbXBvcnQgeyBMaXN0U2VydmljZSB9IGZyb20gJy4uL2xpc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IExpc3RzU2VydmljZSB9IGZyb20gJy4uL2xpc3RzLnNlcnZpY2UnO1xyXG5cclxuaW1wb3J0IHsgRGF0YUl0ZW0gfSBmcm9tICcuLi8uLi9jbGFzc2VzL2RhdGFpdGVtLmNsYXNzJztcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gJy4uLy4uL2NsYXNzZXMvbGlzdC5jbGFzcyc7XHJcbmltcG9ydCB7IExpc3RWaWV3RXZlbnREYXRhIH0gZnJvbSAnbmF0aXZlc2NyaXB0LXByby11aS9saXN0dmlldyc7XHJcblxyXG5cclxudmFyIHBvc3RzID0gcmVxdWlyZSgnLi4vcG9zdHMuanNvbicpO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICAgIHNlbGVjdG9yOiAnbnMtbGlzdCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2xpc3QuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJ2xpc3QuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBAVmlld0NoaWxkKFwiZHJhd2VyXCIpIGRyYXdlckNvbXBvbmVudDogUmFkU2lkZURyYXdlckNvbXBvbmVudDtcclxuICAgIEBWaWV3Q2hpbGQoXCJncm9jZXJ5VGV4dEZpZWxkXCIpIGdyb2NlcnlUZXh0RmllbGQ6IEVsZW1lbnRSZWY7XHJcbiAgICBAVmlld0NoaWxkKFwibXlMaXN0Vmlld1wiKSBsaXN0Vmlld0NvbXBvbmVudDogUmFkTGlzdFZpZXdDb21wb25lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBsZWZ0SXRlbTogVmlldztcclxuICAgIHByaXZhdGUgcmlnaHRJdGVtOiBWaWV3O1xyXG4gICAgcHJpdmF0ZSBtYWluVmlldzogVmlldztcclxuICAgIHByaXZhdGUgYW5pbWF0aW9uQXBwbGllZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfc2lkZURyYXdlclRyYW5zaXRpb246IERyYXdlclRyYW5zaXRpb25CYXNlO1xyXG4gICAgcHJpdmF0ZSBfZGF0YUl0ZW1zOiBPYnNlcnZhYmxlQXJyYXk8RGF0YUl0ZW0+O1xyXG4gICAgcHVibGljIF9saXN0czogQXJyYXk8TGlzdD47XHJcbiAgICBwcml2YXRlIGxpc3RzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgICBwcml2YXRlIF9udW1iZXJPZkFkZGVkSXRlbXM7XHJcbiAgICBsaXN0RGVzY3JpcHRpb246IHN0cmluZyA9ICcnO1xyXG4gICAgaXNMb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICByYW5kOiBudW1iZXIgPSAwO1xyXG4gICAgXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXI6IFJvdXRlckV4dGVuc2lvbnMsIFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBsaXN0U2VydmljZTogTGlzdFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIGxpc3RzU2VydmljZTogTGlzdHNTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBhcHBEYXRhOiBBcHBEYXRhU2VydmljZSl7XHJcbiAgICAgICAgdGhpcy5nZXRMaXN0cygpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmKCFBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJhdXRoZW50aWNhdGVkXCIsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbG9naW5cIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5saXN0c1N1YnNjcmlwdGlvbiA9IHRoaXMubGlzdHNTZXJ2aWNlLmdldExpc3RzQXNPYnNlcnZhYmxlKClcclxuICAgICAgICAuc3Vic2NyaWJlKCBsaXN0cyA9PiB7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxpc3RzKSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdHMgPSB0aGlzLnNvcnRMaXN0cyhsaXN0cyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJFQ0VJVkVEIExJU1RTIEFUIExJU1QgQ09NUDo6OlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGxpc3RzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShsaXN0cykpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5kID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RzID0gdGhpcy5fbGlzdHMuc2xpY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9zaWRlRHJhd2VyVHJhbnNpdGlvbiA9IG5ldyBTbGlkZUluT25Ub3BUcmFuc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5fZGF0YUl0ZW1zID0gbmV3IE9ic2VydmFibGVBcnJheSh0aGlzLmxpc3RTZXJ2aWNlLmdldERhdGFJdGVtcygpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IHNpZGVEcmF3ZXJUcmFuc2l0aW9uKCk6IERyYXdlclRyYW5zaXRpb25CYXNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2lkZURyYXdlclRyYW5zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRhdGFJdGVtcygpOiBPYnNlcnZhYmxlQXJyYXk8RGF0YUl0ZW0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YUl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsaXN0cygpOiBBcnJheTxMaXN0PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RzO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRHJhd2VyQnV0dG9uVGFwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyQ29tcG9uZW50LnNpZGVEcmF3ZXIuc2hvd0RyYXdlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdvVG9MaXN0KGxpc3RrZXk6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYXBwRGF0YS5zZXRBY3RpdmVMaXN0KGxpc3RrZXkpO1xyXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9saXN0LWl0ZW1cIl0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblB1bGxUb1JlZnJlc2hJbml0aWF0ZWQoYXJnczogTGlzdFZpZXdFdmVudERhdGEpIHtcclxuICAgICAgICB2YXIgbGlzdFZpZXcgPSBhcmdzLm9iamVjdDtcclxuICAgICAgICB0aGlzLmdldExpc3RzKCk7XHJcbiAgICAgICAgbGlzdFZpZXcubm90aWZ5UHVsbFRvUmVmcmVzaEZpbmlzaGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdCh0YXJnZXQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidGV4dGZpZWxkIGlucHV0OlwiLCB0aGlzLmxpc3REZXNjcmlwdGlvbik7XHJcbiAgICAgICAgbGV0IHRleHRGaWVsZCA9IDxUZXh0RmllbGQ+dGhpcy5ncm9jZXJ5VGV4dEZpZWxkLm5hdGl2ZUVsZW1lbnQ7IFxyXG5cclxuICAgICAgICBpZiAodGhpcy5saXN0RGVzY3JpcHRpb24udHJpbSgpID09PSAnJykge1xyXG4gICAgICAgICAgICAvLyBpZiB0aGUgdXNlciBjbGlja2VkIHRoZSBhZGQgYnV0dG9uIGFuZCB0aGUgdGV4dGZpZWxkIGlzIGVtcHR5LFxyXG4gICAgICAgICAgICAvLyBmb2N1cyB0aGUgdGV4dGZpZWxkIGFuZCByZXR1cm5cclxuICAgICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJUbyBjcmVhdGUgYSBuZXcgbGlzdCwgZmlyc3QgZW50ZXIgYSBkZXNjcmlwdGlvblwiKTtcclxuICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gXCJidXR0b25cIikge1xyXG4gICAgICAgICAgICAgICAgdGV4dEZpZWxkLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBEaXNtaXNzIHRoZSBrZXlib2FyZFxyXG4gICAgICAgIHRleHRGaWVsZC5kaXNtaXNzU29mdElucHV0KCk7XHJcbiAgICAgICAgdGhpcy5zaG93QWN0aXZpdHlJbmRpY2F0b3IoKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBsaXN0ID0ge1xyXG4gICAgICAgICAgICBjcmVhdG9yVUlEIDogQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ3VpZCcpLFxyXG4gICAgICAgICAgICBkYXRlQ3JlYXRlZDogbW9tZW50KCkuZm9ybWF0KFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKSxcclxuICAgICAgICAgICAgZGF0ZU1vZGlmaWVkOiBtb21lbnQoKS5mb3JtYXQoXCJZWVlZLU1NLUREIEhIOm1tOnNzXCIpLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy5saXN0RGVzY3JpcHRpb25cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2xpc3RzLnVuc2hpZnQobGlzdCk7XHJcblxyXG4gICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlLmNyZWF0ZU5ld0xpc3QobGlzdClcclxuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVkIVwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3REZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZUFjdGl2aXR5SW5kaWNhdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRMaXN0cygpO1xyXG4gICAgICAgICAgICAgICAgfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICApLmNhdGNoKCBlcnIgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmhpZGVBY3Rpdml0eUluZGljYXRvcigpO1xyXG4gICAgICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShcIkxpc3QgY291bGRuJ3QgYmUgY3JlYXRlZCFcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGlzdHMoKSB7XHJcbiAgICAgICAgdGhpcy5saXN0c1NlcnZpY2UuZ2V0VXNlckxpc3RzKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1aWQnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2soKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ3VpZCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzb3J0TGlzdHMobGlzdDogQXJyYXk8TGlzdD4pIHtcclxuICAgICAgICBsaXN0LnNvcnQoIChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhWydkYXRlTW9kaWZpZWQnXSA8IGJbJ2RhdGVNb2RpZmllZCddKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYVsnZGF0ZU1vZGlmaWVkJ10gPiBiWydkYXRlTW9kaWZpZWQnXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvd0FjdGl2aXR5SW5kaWNhdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaGlkZUFjdGl2aXR5SW5kaWNhdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgb25DZWxsU3dpcGluZyhhcmdzOiBMaXN0Vmlld0V2ZW50RGF0YSkge1xyXG4gICAgICAgIHZhciBzd2lwZUxpbWl0cyA9IGFyZ3MuZGF0YS5zd2lwZUxpbWl0cztcclxuICAgICAgICB2YXIgc3dpcGVWaWV3ID0gYXJnc1snc3dpcGVWaWV3J107XHJcbiAgICAgICAgdGhpcy5tYWluVmlldyA9IGFyZ3NbJ21haW5WaWV3J107XHJcbiAgICAgICAgdGhpcy5sZWZ0SXRlbSA9IHN3aXBlVmlldy5nZXRWaWV3QnlJZCgnbGVmdC1zdGFjaycpO1xyXG4gICAgICAgIHRoaXMucmlnaHRJdGVtID0gc3dpcGVWaWV3LmdldFZpZXdCeUlkKCdyaWdodC1zdGFjaycpO1xyXG5cclxuICAgICAgICBpZiAoYXJncy5kYXRhLnggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0RGltZW5zaW9ucyA9IFZpZXcubWVhc3VyZUNoaWxkKFxyXG4gICAgICAgICAgICAgICAgPFZpZXc+dGhpcy5sZWZ0SXRlbS5wYXJlbnQsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRJdGVtLFxyXG4gICAgICAgICAgICAgICAgbGF5b3V0Lm1ha2VNZWFzdXJlU3BlYyhNYXRoLmFicyhhcmdzLmRhdGEueCksIGxheW91dC5FWEFDVExZKSxcclxuICAgICAgICAgICAgICAgIGxheW91dC5tYWtlTWVhc3VyZVNwZWModGhpcy5tYWluVmlldy5nZXRNZWFzdXJlZEhlaWdodCgpLCBsYXlvdXQuRVhBQ1RMWSkpO1xyXG4gICAgICAgICAgICBWaWV3LmxheW91dENoaWxkKDxWaWV3PnRoaXMubGVmdEl0ZW0ucGFyZW50LCB0aGlzLmxlZnRJdGVtLCAwLCAwLCBsZWZ0RGltZW5zaW9ucy5tZWFzdXJlZFdpZHRoLCBsZWZ0RGltZW5zaW9ucy5tZWFzdXJlZEhlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZU90aGVyU3dpcGVUZW1wbGF0ZVZpZXcoXCJsZWZ0XCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciByaWdodERpbWVuc2lvbnMgPSBWaWV3Lm1lYXN1cmVDaGlsZChcclxuICAgICAgICAgICAgICAgIDxWaWV3PnRoaXMucmlnaHRJdGVtLnBhcmVudCxcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRJdGVtLFxyXG4gICAgICAgICAgICAgICAgbGF5b3V0Lm1ha2VNZWFzdXJlU3BlYyhNYXRoLmFicyhhcmdzLmRhdGEueCksIGxheW91dC5FWEFDVExZKSxcclxuICAgICAgICAgICAgICAgIGxheW91dC5tYWtlTWVhc3VyZVNwZWModGhpcy5tYWluVmlldy5nZXRNZWFzdXJlZEhlaWdodCgpLCBsYXlvdXQuRVhBQ1RMWSkpO1xyXG5cclxuICAgICAgICAgICAgVmlldy5sYXlvdXRDaGlsZCg8Vmlldz50aGlzLnJpZ2h0SXRlbS5wYXJlbnQsIHRoaXMucmlnaHRJdGVtLCB0aGlzLm1haW5WaWV3LmdldE1lYXN1cmVkV2lkdGgoKSAtIHJpZ2h0RGltZW5zaW9ucy5tZWFzdXJlZFdpZHRoLCAwLCB0aGlzLm1haW5WaWV3LmdldE1lYXN1cmVkV2lkdGgoKSwgcmlnaHREaW1lbnNpb25zLm1lYXN1cmVkSGVpZ2h0KTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlT3RoZXJTd2lwZVRlbXBsYXRlVmlldyhcInJpZ2h0XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhpZGVPdGhlclN3aXBlVGVtcGxhdGVWaWV3KGN1cnJlbnRTd2lwZVZpZXc6IHN0cmluZykge1xyXG4gICAgICAgIHN3aXRjaCAoY3VycmVudFN3aXBlVmlldykge1xyXG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmlnaHRJdGVtLmdldEFjdHVhbFNpemUoKS53aWR0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgVmlldy5sYXlvdXRDaGlsZCg8Vmlldz50aGlzLnJpZ2h0SXRlbS5wYXJlbnQsIHRoaXMucmlnaHRJdGVtLCB0aGlzLm1haW5WaWV3LmdldE1lYXN1cmVkV2lkdGgoKSwgMCwgdGhpcy5tYWluVmlldy5nZXRNZWFzdXJlZFdpZHRoKCksIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGVmdEl0ZW0uZ2V0QWN0dWFsU2l6ZSgpLndpZHRoICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBWaWV3LmxheW91dENoaWxkKDxWaWV3PnRoaXMubGVmdEl0ZW0ucGFyZW50LCB0aGlzLmxlZnRJdGVtLCAwLCAwLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblN3aXBlQ2VsbFN0YXJ0ZWQoYXJnczogTGlzdFZpZXdFdmVudERhdGEpIHtcclxuICAgICAgICB2YXIgc3dpcGVMaW1pdHMgPSBhcmdzLmRhdGEuc3dpcGVMaW1pdHM7XHJcbiAgICAgICAgc3dpcGVMaW1pdHMudGhyZXNob2xkID0gYXJnc1snbWFpblZpZXcnXS5nZXRNZWFzdXJlZFdpZHRoKCkgKiAwLjI7IC8vIDIwJSBvZiB3aG9sZSB3aWR0aFxyXG4gICAgICAgIHN3aXBlTGltaXRzLmxlZnQgPSBzd2lwZUxpbWl0cy5yaWdodCA9IGFyZ3NbJ21haW5WaWV3J10uZ2V0TWVhc3VyZWRXaWR0aCgpICogMC42NSAvLyA2NSUgb2Ygd2hvbGUgd2lkdGhcclxuICAgIH1cclxuICAgIC8vIDw8IGFuZ3VsYXItbGlzdHZpZXctc3dpcGUtYWN0aW9uLW11bHRpcGxlLWxpbWl0c1xyXG5cclxuICAgIHB1YmxpYyBvblN3aXBlQ2VsbEZpbmlzaGVkKGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKSB7XHJcbiAgICAgICAgaWYgKGFyZ3MuZGF0YS54ID4gMjAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGVyZm9ybSBsZWZ0IGFjdGlvblwiKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MuZGF0YS54IDwgLTIwMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBlcmZvcm0gcmlnaHQgYWN0aW9uXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFuaW1hdGlvbkFwcGxpZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25MZWZ0U3dpcGVDbGljayhhcmdzOiBMaXN0Vmlld0V2ZW50RGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQnV0dG9uIGNsaWNrZWQ6IFwiICsgYXJncy5vYmplY3QuaWQgKyBcIiBmb3IgaXRlbSB3aXRoIGluZGV4OiBcIiArIHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcuaXRlbXMuaW5kZXhPZihhcmdzLm9iamVjdC5iaW5kaW5nQ29udGV4dCkpO1xyXG4gICAgICAgIHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblJpZ2h0U3dpcGVDbGljayhhcmdzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJCdXR0b24gY2xpY2tlZDogXCIgKyBhcmdzLm9iamVjdC5pZCArIFwiIGZvciBpdGVtIHdpdGggaW5kZXg6IFwiICsgdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5pdGVtcy5pbmRleE9mKGFyZ3Mub2JqZWN0LmJpbmRpbmdDb250ZXh0KSk7XHJcbiAgICAgICAgdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4iXX0=