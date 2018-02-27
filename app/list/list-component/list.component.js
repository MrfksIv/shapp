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
var firebaseWebApi = require("nativescript-plugin-firebase/app");
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
            _this.hideActivityIndicator();
            _this.getLists();
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
            if (a['dateModified'] > b['dateModified']) {
                return -1;
            }
            else if (a['dateModified'] < b['dateModified']) {
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
        this.handleSwipeTapEvent(args);
        this.listViewComponent.listView.notifySwipeToExecuteFinished();
    };
    ListComponent.prototype.onRightSwipeClick = function (args) {
        this.handleSwipeTapEvent(args);
        this.listViewComponent.listView.notifySwipeToExecuteFinished();
    };
    ListComponent.prototype.handleSwipeTapEvent = function (args) {
        var clickedIndex = this.listViewComponent.listView.items.indexOf(args.object.bindingContext);
        if (args.object.id === 'btnDelete') {
            this.deleteList(clickedIndex, this._lists[clickedIndex]['listKey']);
        }
        else if (args.object.id === 'btnArchive') {
            console.log("archive the list:");
            console.dir(this._lists[clickedIndex]);
        }
        else if (args.object.id === 'btnShare') {
            console.log("share the list:");
            console.dir(this._lists[clickedIndex]);
        }
    };
    ListComponent.prototype.deleteList = function (clickedIndex, listID) {
        this._lists.splice(clickedIndex, 1);
        firebaseWebApi.database().ref("/lists").child(listID).set(null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF3RjtBQUN4RixzREFBK0Q7QUFDL0QsK0RBQWlEO0FBQ2pELDZEQUE2RztBQUM3RyxrRUFBZ0Y7QUFDaEYsZ0VBQTRFO0FBRTVFLHNEQUFxRDtBQUNyRCxzREFBc0Q7QUFDdEQsMkVBQXlFO0FBSXpFLDBEQUE0RDtBQUU1RCxpRUFBbUU7QUFDbkUsK0JBQWlDO0FBR2pDLGdFQUE4RDtBQUM5RCxnREFBOEM7QUFDOUMsa0RBQWdEO0FBT2hELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQVNyQztJQW9CSSx1QkFBb0IsTUFBd0IsRUFDeEIsV0FBd0IsRUFDeEIsWUFBMEIsRUFDMUIsT0FBdUI7UUFIdkIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFDeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFkbkMscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBTWpDLG9CQUFlLEdBQVcsRUFBRSxDQUFDO1FBQzdCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsU0FBSSxHQUFXLENBQUMsQ0FBQztRQU9iLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsZ0NBQVEsR0FBUjtRQUFBLGlCQW1CQztRQWxCRyxFQUFFLENBQUEsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBRUQsSUFBSSxDQUFDLGlC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QixnQ0FBc0I7MERBQUM7SUFDOUI7UUFBOUIsZ0JBQVMsQ0FBQyxrQkFBa0IsQ0FBQztrQ0FBbUIsaUJBQVU7MkRBQUM7SUFDbkM7UUFBeEIsZ0JBQVMsQ0FBQyxZQUFZLENBQUM7a0NBQW9CLDhCQUFvQjs0REFBQztJQUp4RCxhQUFhO1FBTnpCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsV0FBVyxFQUFFLHFCQUFxQjtZQUNsQyxTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztTQUNwQyxDQUFDO3lDQXFCOEIseUJBQWdCO1lBQ1gsMEJBQVc7WUFDViw0QkFBWTtZQUNqQixnQ0FBYztPQXZCbEMsYUFBYSxDQXNPekI7SUFBRCxvQkFBQztDQUFBLEFBdE9ELElBc09DO0FBdE9ZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgQWZ0ZXJWaWV3SW5pdCwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgU25hY2tCYXIgfSBmcm9tICduYXRpdmVzY3JpcHQtc25hY2tiYXInO1xyXG5pbXBvcnQgeyBEcmF3ZXJUcmFuc2l0aW9uQmFzZSwgU2xpZGVJbk9uVG9wVHJhbnNpdGlvbiwgUmFkU2lkZURyYXdlciB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL3NpZGVkcmF3ZXJcIjtcclxuaW1wb3J0IHsgUmFkU2lkZURyYXdlckNvbXBvbmVudCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL3NpZGVkcmF3ZXIvYW5ndWxhclwiO1xyXG5pbXBvcnQgeyBSYWRMaXN0Vmlld0NvbXBvbmVudCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL2xpc3R2aWV3L2FuZ3VsYXJcIjtcclxuaW1wb3J0IHsgVGV4dEZpZWxkIH0gZnJvbSBcInVpL3RleHQtZmllbGRcIjtcclxuaW1wb3J0IHsgVmlldyB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2NvcmUvdmlld1wiO1xyXG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91dGlscy91dGlsc1wiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlQXJyYXkgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9kYXRhL29ic2VydmFibGUtYXJyYXlcIjtcclxuLy8gaW1wb3J0ICogYXMgQXBwbGljYXRpb24gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb25cIjtcclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcy9TdWJzY3JpcHRpb24nO1xyXG5cclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tICdhcHBsaWNhdGlvbi1zZXR0aW5ncyc7XHJcbmltcG9ydCAqIGFzIGZpcmViYXNlIGZyb20gJ25hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2UnO1xyXG5pbXBvcnQgKiBhcyBmaXJlYmFzZVdlYkFwaSBmcm9tICduYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlL2FwcCc7XHJcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5cclxuaW1wb3J0IHsgSHR0cFNlcnZpY2UgfSBmcm9tICcuLi8uLi9odHRwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBcHBEYXRhU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvYXBwZGF0YS5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7IExpc3RTZXJ2aWNlIH0gZnJvbSAnLi4vbGlzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTGlzdHNTZXJ2aWNlIH0gZnJvbSAnLi4vbGlzdHMuc2VydmljZSc7XHJcblxyXG5pbXBvcnQgeyBEYXRhSXRlbSB9IGZyb20gJy4uLy4uL2NsYXNzZXMvZGF0YWl0ZW0uY2xhc3MnO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSAnLi4vLi4vY2xhc3Nlcy9saXN0LmNsYXNzJztcclxuaW1wb3J0IHsgTGlzdFZpZXdFdmVudERhdGEgfSBmcm9tICduYXRpdmVzY3JpcHQtcHJvLXVpL2xpc3R2aWV3JztcclxuXHJcblxyXG52YXIgcG9zdHMgPSByZXF1aXJlKCcuLi9wb3N0cy5qc29uJyk7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgc2VsZWN0b3I6ICducy1saXN0JyxcclxuICAgIHRlbXBsYXRlVXJsOiAnbGlzdC5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnbGlzdC5jb21wb25lbnQuY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIExpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICAgIEBWaWV3Q2hpbGQoXCJkcmF3ZXJcIikgZHJhd2VyQ29tcG9uZW50OiBSYWRTaWRlRHJhd2VyQ29tcG9uZW50O1xyXG4gICAgQFZpZXdDaGlsZChcImdyb2NlcnlUZXh0RmllbGRcIikgZ3JvY2VyeVRleHRGaWVsZDogRWxlbWVudFJlZjtcclxuICAgIEBWaWV3Q2hpbGQoXCJteUxpc3RWaWV3XCIpIGxpc3RWaWV3Q29tcG9uZW50OiBSYWRMaXN0Vmlld0NvbXBvbmVudDtcclxuXHJcbiAgICBwcml2YXRlIGxlZnRJdGVtOiBWaWV3O1xyXG4gICAgcHJpdmF0ZSByaWdodEl0ZW06IFZpZXc7XHJcbiAgICBwcml2YXRlIG1haW5WaWV3OiBWaWV3O1xyXG4gICAgcHJpdmF0ZSBhbmltYXRpb25BcHBsaWVkID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9zaWRlRHJhd2VyVHJhbnNpdGlvbjogRHJhd2VyVHJhbnNpdGlvbkJhc2U7XHJcbiAgICBwcml2YXRlIF9kYXRhSXRlbXM6IE9ic2VydmFibGVBcnJheTxEYXRhSXRlbT47XHJcbiAgICBwdWJsaWMgX2xpc3RzOiBBcnJheTxMaXN0PjtcclxuICAgIHByaXZhdGUgbGlzdHNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICAgIHByaXZhdGUgX251bWJlck9mQWRkZWRJdGVtcztcclxuICAgIGxpc3REZXNjcmlwdGlvbjogc3RyaW5nID0gJyc7XHJcbiAgICBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHJhbmQ6IG51bWJlciA9IDA7XHJcbiAgICBcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlcjogUm91dGVyRXh0ZW5zaW9ucywgXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIGxpc3RTZXJ2aWNlOiBMaXN0U2VydmljZSxcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgbGlzdHNTZXJ2aWNlOiBMaXN0c1NlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIGFwcERhdGE6IEFwcERhdGFTZXJ2aWNlKXtcclxuICAgICAgICB0aGlzLmdldExpc3RzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgaWYoIUFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImF1dGhlbnRpY2F0ZWRcIiwgZmFsc2UpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9sb2dpblwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxpc3RzU3Vic2NyaXB0aW9uID0gdGhpcy5saXN0c1NlcnZpY2UuZ2V0TGlzdHNBc09ic2VydmFibGUoKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoIGxpc3RzID0+IHtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobGlzdHMpKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0cyA9IHRoaXMuc29ydExpc3RzKGxpc3RzKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUkVDRUlWRUQgTElTVFMgQVQgTElTVCBDT01QOjo6XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kaXIobGlzdHMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGxpc3RzKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmQgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdHMgPSB0aGlzLl9saXN0cy5zbGljZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NpZGVEcmF3ZXJUcmFuc2l0aW9uID0gbmV3IFNsaWRlSW5PblRvcFRyYW5zaXRpb24oKTtcclxuICAgICAgICB0aGlzLl9kYXRhSXRlbXMgPSBuZXcgT2JzZXJ2YWJsZUFycmF5KHRoaXMubGlzdFNlcnZpY2UuZ2V0RGF0YUl0ZW1zKCkpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXQgc2lkZURyYXdlclRyYW5zaXRpb24oKTogRHJhd2VyVHJhbnNpdGlvbkJhc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaWRlRHJhd2VyVHJhbnNpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGF0YUl0ZW1zKCk6IE9ic2VydmFibGVBcnJheTxEYXRhSXRlbT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhSXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxpc3RzKCk6IEFycmF5PExpc3Q+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdHM7XHJcbiAgICB9XHJcblxyXG4gICAgb25EcmF3ZXJCdXR0b25UYXAoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXJDb21wb25lbnQuc2lkZURyYXdlci5zaG93RHJhd2VyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ29Ub0xpc3QobGlzdGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hcHBEYXRhLnNldEFjdGl2ZUxpc3QobGlzdGtleSk7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2xpc3QtaXRlbVwiXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uUHVsbFRvUmVmcmVzaEluaXRpYXRlZChhcmdzOiBMaXN0Vmlld0V2ZW50RGF0YSkge1xyXG4gICAgICAgIHZhciBsaXN0VmlldyA9IGFyZ3Mub2JqZWN0O1xyXG4gICAgICAgIHRoaXMuZ2V0TGlzdHMoKTtcclxuICAgICAgICBsaXN0Vmlldy5ub3RpZnlQdWxsVG9SZWZyZXNoRmluaXNoZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRMaXN0KHRhcmdldDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ0ZXh0ZmllbGQgaW5wdXQ6XCIsIHRoaXMubGlzdERlc2NyaXB0aW9uKTtcclxuICAgICAgICBsZXQgdGV4dEZpZWxkID0gPFRleHRGaWVsZD50aGlzLmdyb2NlcnlUZXh0RmllbGQubmF0aXZlRWxlbWVudDsgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmxpc3REZXNjcmlwdGlvbi50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZSB1c2VyIGNsaWNrZWQgdGhlIGFkZCBidXR0b24gYW5kIHRoZSB0ZXh0ZmllbGQgaXMgZW1wdHksXHJcbiAgICAgICAgICAgIC8vIGZvY3VzIHRoZSB0ZXh0ZmllbGQgYW5kIHJldHVyblxyXG4gICAgICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShcIlRvIGNyZWF0ZSBhIG5ldyBsaXN0LCBmaXJzdCBlbnRlciBhIGRlc2NyaXB0aW9uXCIpO1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0ID09PSBcImJ1dHRvblwiKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0RmllbGQuZm9jdXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIERpc21pc3MgdGhlIGtleWJvYXJkXHJcbiAgICAgICAgdGV4dEZpZWxkLmRpc21pc3NTb2Z0SW5wdXQoKTtcclxuICAgICAgICB0aGlzLnNob3dBY3Rpdml0eUluZGljYXRvcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSB7XHJcbiAgICAgICAgICAgIGNyZWF0b3JVSUQgOiBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygndWlkJyksXHJcbiAgICAgICAgICAgIGRhdGVDcmVhdGVkOiBtb21lbnQoKS5mb3JtYXQoXCJZWVlZLU1NLUREIEhIOm1tOnNzXCIpLFxyXG4gICAgICAgICAgICBkYXRlTW9kaWZpZWQ6IG1vbWVudCgpLmZvcm1hdChcIllZWVktTU0tREQgSEg6bW06c3NcIiksXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmxpc3REZXNjcmlwdGlvblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbGlzdHMudW5zaGlmdChsaXN0KTtcclxuXHJcbiAgICAgICAgdGhpcy5saXN0c1NlcnZpY2UuY3JlYXRlTmV3TGlzdChsaXN0KVxyXG4gICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlZCFcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdERlc2NyaXB0aW9uID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZUFjdGl2aXR5SW5kaWNhdG9yKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0TGlzdHMoKTtcclxuICAgICAgICB9KS5jYXRjaCggZXJyID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlQWN0aXZpdHlJbmRpY2F0b3IoKTtcclxuICAgICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJMaXN0IGNvdWxkbid0IGJlIGNyZWF0ZWQhXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExpc3RzKCkge1xyXG4gICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlLmdldFVzZXJMaXN0cyhBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygndWlkJykpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1aWQnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc29ydExpc3RzKGxpc3Q6IEFycmF5PExpc3Q+KSB7XHJcbiAgICAgICAgbGlzdC5zb3J0KCAoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYVsnZGF0ZU1vZGlmaWVkJ10gPiBiWydkYXRlTW9kaWZpZWQnXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFbJ2RhdGVNb2RpZmllZCddIDwgYlsnZGF0ZU1vZGlmaWVkJ10pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dBY3Rpdml0eUluZGljYXRvcigpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGhpZGVBY3Rpdml0eUluZGljYXRvcigpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIG9uQ2VsbFN3aXBpbmcoYXJnczogTGlzdFZpZXdFdmVudERhdGEpIHtcclxuICAgICAgICB2YXIgc3dpcGVMaW1pdHMgPSBhcmdzLmRhdGEuc3dpcGVMaW1pdHM7XHJcbiAgICAgICAgdmFyIHN3aXBlVmlldyA9IGFyZ3NbJ3N3aXBlVmlldyddO1xyXG4gICAgICAgIHRoaXMubWFpblZpZXcgPSBhcmdzWydtYWluVmlldyddO1xyXG4gICAgICAgIHRoaXMubGVmdEl0ZW0gPSBzd2lwZVZpZXcuZ2V0Vmlld0J5SWQoJ2xlZnQtc3RhY2snKTtcclxuICAgICAgICB0aGlzLnJpZ2h0SXRlbSA9IHN3aXBlVmlldy5nZXRWaWV3QnlJZCgncmlnaHQtc3RhY2snKTtcclxuXHJcbiAgICAgICAgaWYgKGFyZ3MuZGF0YS54ID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgbGVmdERpbWVuc2lvbnMgPSBWaWV3Lm1lYXN1cmVDaGlsZChcclxuICAgICAgICAgICAgICAgIDxWaWV3PnRoaXMubGVmdEl0ZW0ucGFyZW50LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0SXRlbSxcclxuICAgICAgICAgICAgICAgIGxheW91dC5tYWtlTWVhc3VyZVNwZWMoTWF0aC5hYnMoYXJncy5kYXRhLngpLCBsYXlvdXQuRVhBQ1RMWSksXHJcbiAgICAgICAgICAgICAgICBsYXlvdXQubWFrZU1lYXN1cmVTcGVjKHRoaXMubWFpblZpZXcuZ2V0TWVhc3VyZWRIZWlnaHQoKSwgbGF5b3V0LkVYQUNUTFkpKTtcclxuICAgICAgICAgICAgVmlldy5sYXlvdXRDaGlsZCg8Vmlldz50aGlzLmxlZnRJdGVtLnBhcmVudCwgdGhpcy5sZWZ0SXRlbSwgMCwgMCwgbGVmdERpbWVuc2lvbnMubWVhc3VyZWRXaWR0aCwgbGVmdERpbWVuc2lvbnMubWVhc3VyZWRIZWlnaHQpO1xyXG4gICAgICAgICAgICB0aGlzLmhpZGVPdGhlclN3aXBlVGVtcGxhdGVWaWV3KFwibGVmdFwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcmlnaHREaW1lbnNpb25zID0gVmlldy5tZWFzdXJlQ2hpbGQoXHJcbiAgICAgICAgICAgICAgICA8Vmlldz50aGlzLnJpZ2h0SXRlbS5wYXJlbnQsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0SXRlbSxcclxuICAgICAgICAgICAgICAgIGxheW91dC5tYWtlTWVhc3VyZVNwZWMoTWF0aC5hYnMoYXJncy5kYXRhLngpLCBsYXlvdXQuRVhBQ1RMWSksXHJcbiAgICAgICAgICAgICAgICBsYXlvdXQubWFrZU1lYXN1cmVTcGVjKHRoaXMubWFpblZpZXcuZ2V0TWVhc3VyZWRIZWlnaHQoKSwgbGF5b3V0LkVYQUNUTFkpKTtcclxuXHJcbiAgICAgICAgICAgIFZpZXcubGF5b3V0Q2hpbGQoPFZpZXc+dGhpcy5yaWdodEl0ZW0ucGFyZW50LCB0aGlzLnJpZ2h0SXRlbSwgdGhpcy5tYWluVmlldy5nZXRNZWFzdXJlZFdpZHRoKCkgLSByaWdodERpbWVuc2lvbnMubWVhc3VyZWRXaWR0aCwgMCwgdGhpcy5tYWluVmlldy5nZXRNZWFzdXJlZFdpZHRoKCksIHJpZ2h0RGltZW5zaW9ucy5tZWFzdXJlZEhlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZU90aGVyU3dpcGVUZW1wbGF0ZVZpZXcoXCJyaWdodFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoaWRlT3RoZXJTd2lwZVRlbXBsYXRlVmlldyhjdXJyZW50U3dpcGVWaWV3OiBzdHJpbmcpIHtcclxuICAgICAgICBzd2l0Y2ggKGN1cnJlbnRTd2lwZVZpZXcpIHtcclxuICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJpZ2h0SXRlbS5nZXRBY3R1YWxTaXplKCkud2lkdGggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIFZpZXcubGF5b3V0Q2hpbGQoPFZpZXc+dGhpcy5yaWdodEl0ZW0ucGFyZW50LCB0aGlzLnJpZ2h0SXRlbSwgdGhpcy5tYWluVmlldy5nZXRNZWFzdXJlZFdpZHRoKCksIDAsIHRoaXMubWFpblZpZXcuZ2V0TWVhc3VyZWRXaWR0aCgpLCAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxlZnRJdGVtLmdldEFjdHVhbFNpemUoKS53aWR0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgVmlldy5sYXlvdXRDaGlsZCg8Vmlldz50aGlzLmxlZnRJdGVtLnBhcmVudCwgdGhpcy5sZWZ0SXRlbSwgMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Td2lwZUNlbGxTdGFydGVkKGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKSB7XHJcbiAgICAgICAgdmFyIHN3aXBlTGltaXRzID0gYXJncy5kYXRhLnN3aXBlTGltaXRzO1xyXG4gICAgICAgIHN3aXBlTGltaXRzLnRocmVzaG9sZCA9IGFyZ3NbJ21haW5WaWV3J10uZ2V0TWVhc3VyZWRXaWR0aCgpICogMC4yOyAvLyAyMCUgb2Ygd2hvbGUgd2lkdGhcclxuICAgICAgICBzd2lwZUxpbWl0cy5sZWZ0ID0gc3dpcGVMaW1pdHMucmlnaHQgPSBhcmdzWydtYWluVmlldyddLmdldE1lYXN1cmVkV2lkdGgoKSAqIDAuNjUgLy8gNjUlIG9mIHdob2xlIHdpZHRoXHJcbiAgICB9XHJcbiAgICAvLyA8PCBhbmd1bGFyLWxpc3R2aWV3LXN3aXBlLWFjdGlvbi1tdWx0aXBsZS1saW1pdHNcclxuXHJcbiAgICBwdWJsaWMgb25Td2lwZUNlbGxGaW5pc2hlZChhcmdzOiBMaXN0Vmlld0V2ZW50RGF0YSkge1xyXG4gICAgICAgIGlmIChhcmdzLmRhdGEueCA+IDIwMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBlcmZvcm0gbGVmdCBhY3Rpb25cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmRhdGEueCA8IC0yMDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQZXJmb3JtIHJpZ2h0IGFjdGlvblwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25BcHBsaWVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTGVmdFN3aXBlQ2xpY2soYXJnczogTGlzdFZpZXdFdmVudERhdGEpIHtcclxuICAgICAgICB0aGlzLmhhbmRsZVN3aXBlVGFwRXZlbnQoYXJncyk7XHJcbiAgICAgICAgdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uUmlnaHRTd2lwZUNsaWNrKGFyZ3MpIHtcclxuICAgICAgICB0aGlzLmhhbmRsZVN3aXBlVGFwRXZlbnQoYXJncyk7XHJcbiAgICAgICAgdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5ub3RpZnlTd2lwZVRvRXhlY3V0ZUZpbmlzaGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVTd2lwZVRhcEV2ZW50KGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKSB7XHJcbiAgICAgICAgY29uc3QgY2xpY2tlZEluZGV4ID0gdGhpcy5saXN0Vmlld0NvbXBvbmVudC5saXN0Vmlldy5pdGVtcy5pbmRleE9mKGFyZ3Mub2JqZWN0LmJpbmRpbmdDb250ZXh0KTtcclxuICAgICAgICBpZiAoYXJncy5vYmplY3QuaWQgPT09ICdidG5EZWxldGUnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlTGlzdChjbGlja2VkSW5kZXgsIHRoaXMuX2xpc3RzW2NsaWNrZWRJbmRleF1bJ2xpc3RLZXknXSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLm9iamVjdC5pZCA9PT0gJ2J0bkFyY2hpdmUnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXJjaGl2ZSB0aGUgbGlzdDpcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKHRoaXMuX2xpc3RzW2NsaWNrZWRJbmRleF0pO1xyXG4gICAgICAgIH0gZWxzZSAgaWYgKGFyZ3Mub2JqZWN0LmlkID09PSAnYnRuU2hhcmUnKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaGFyZSB0aGUgbGlzdDpcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKHRoaXMuX2xpc3RzW2NsaWNrZWRJbmRleF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlbGV0ZUxpc3QoY2xpY2tlZEluZGV4LCBsaXN0SUQpIHtcclxuICAgICAgICB0aGlzLl9saXN0cy5zcGxpY2UoY2xpY2tlZEluZGV4LCAxKTtcclxuICAgICAgICBmaXJlYmFzZVdlYkFwaS5kYXRhYmFzZSgpLnJlZihcIi9saXN0c1wiKS5jaGlsZChsaXN0SUQpLnNldChudWxsKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbiJdfQ==