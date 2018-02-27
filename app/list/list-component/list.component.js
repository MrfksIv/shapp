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
            this.archiveList(clickedIndex, this._lists[clickedIndex]['listKey']);
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
    ListComponent.prototype.archiveList = function (clickedIndex, listID) {
        var tmpList = this._lists[clickedIndex];
        tmpList.archived = true;
        firebaseWebApi.database().ref("/lists").child(listID).set(tmpList);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF3RjtBQUN4RixzREFBK0Q7QUFDL0QsK0RBQWlEO0FBQ2pELDZEQUE2RztBQUM3RyxrRUFBZ0Y7QUFDaEYsZ0VBQTRFO0FBRTVFLHNEQUFxRDtBQUNyRCxzREFBc0Q7QUFDdEQsMkVBQXlFO0FBSXpFLDBEQUE0RDtBQUU1RCxpRUFBbUU7QUFDbkUsK0JBQWlDO0FBR2pDLGdFQUE4RDtBQUM5RCxnREFBOEM7QUFDOUMsa0RBQWdEO0FBT2hELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQVNyQztJQW9CSSx1QkFBb0IsTUFBd0IsRUFDeEIsV0FBd0IsRUFDeEIsWUFBMEIsRUFDMUIsT0FBdUI7UUFIdkIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFDeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFkbkMscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBTWpDLG9CQUFlLEdBQVcsRUFBRSxDQUFDO1FBQzdCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsU0FBSSxHQUFXLENBQUMsQ0FBQztRQU9iLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsZ0NBQVEsR0FBUjtRQUFBLGlCQW1CQztRQWxCRyxFQUFFLENBQUEsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBRUQsSUFBSSxDQUFDLGlC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LE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRU8sbUNBQVcsR0FBbkIsVUFBb0IsWUFBWSxFQUFFLE1BQU07UUFDcEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4QyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUN4QixjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQXpPb0I7UUFBcEIsZ0JBQVMsQ0FBQyxRQUFRLENBQUM7a0NBQWtCLGdDQUFzQjswREFBQztJQUM5QjtRQUE5QixnQkFBUyxDQUFDLGtCQUFrQixDQUFDO2tDQUFtQixpQkFBVTsyREFBQztJQUNuQztRQUF4QixnQkFBUyxDQUFDLFlBQVksQ0FBQztrQ0FBb0IsOEJBQW9COzREQUFDO0lBSnhELGFBQWE7UUFOekIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsU0FBUztZQUNuQixXQUFXLEVBQUUscUJBQXFCO1lBQ2xDLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO1NBQ3BDLENBQUM7eUNBcUI4Qix5QkFBZ0I7WUFDWCwwQkFBVztZQUNWLDRCQUFZO1lBQ2pCLGdDQUFjO09BdkJsQyxhQUFhLENBNk96QjtJQUFELG9CQUFDO0NBQUEsQUE3T0QsSUE2T0M7QUE3T1ksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBBZnRlclZpZXdJbml0LCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBTbmFja0JhciB9IGZyb20gJ25hdGl2ZXNjcmlwdC1zbmFja2Jhcic7XHJcbmltcG9ydCB7IERyYXdlclRyYW5zaXRpb25CYXNlLCBTbGlkZUluT25Ub3BUcmFuc2l0aW9uLCBSYWRTaWRlRHJhd2VyIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcm8tdWkvc2lkZWRyYXdlclwiO1xyXG5pbXBvcnQgeyBSYWRTaWRlRHJhd2VyQ29tcG9uZW50IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcm8tdWkvc2lkZWRyYXdlci9hbmd1bGFyXCI7XHJcbmltcG9ydCB7IFJhZExpc3RWaWV3Q29tcG9uZW50IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcm8tdWkvbGlzdHZpZXcvYW5ndWxhclwiO1xyXG5pbXBvcnQgeyBUZXh0RmllbGQgfSBmcm9tIFwidWkvdGV4dC1maWVsZFwiO1xyXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvY29yZS92aWV3XCI7XHJcbmltcG9ydCB7IGxheW91dCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3V0aWxzL3V0aWxzXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGVBcnJheSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2RhdGEvb2JzZXJ2YWJsZS1hcnJheVwiO1xyXG4vLyBpbXBvcnQgKiBhcyBBcHBsaWNhdGlvbiBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzL1N1YnNjcmlwdGlvbic7XHJcblxyXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gJ2FwcGxpY2F0aW9uLXNldHRpbmdzJztcclxuaW1wb3J0ICogYXMgZmlyZWJhc2UgZnJvbSAnbmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZSc7XHJcbmltcG9ydCAqIGFzIGZpcmViYXNlV2ViQXBpIGZyb20gJ25hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2UvYXBwJztcclxuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcblxyXG5pbXBvcnQgeyBIdHRwU2VydmljZSB9IGZyb20gJy4uLy4uL2h0dHAuc2VydmljZSc7XHJcbmltcG9ydCB7IEFwcERhdGFTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9hcHBkYXRhLnNlcnZpY2VcIjtcclxuaW1wb3J0IHsgTGlzdFNlcnZpY2UgfSBmcm9tICcuLi9saXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMaXN0c1NlcnZpY2UgfSBmcm9tICcuLi9saXN0cy5zZXJ2aWNlJztcclxuXHJcbmltcG9ydCB7IERhdGFJdGVtIH0gZnJvbSAnLi4vLi4vY2xhc3Nlcy9kYXRhaXRlbS5jbGFzcyc7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tICcuLi8uLi9jbGFzc2VzL2xpc3QuY2xhc3MnO1xyXG5pbXBvcnQgeyBMaXN0Vmlld0V2ZW50RGF0YSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1wcm8tdWkvbGlzdHZpZXcnO1xyXG5cclxuXHJcbnZhciBwb3N0cyA9IHJlcXVpcmUoJy4uL3Bvc3RzLmpzb24nKTtcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICBzZWxlY3RvcjogJ25zLWxpc3QnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICdsaXN0LmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWydsaXN0LmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgQFZpZXdDaGlsZChcImRyYXdlclwiKSBkcmF3ZXJDb21wb25lbnQ6IFJhZFNpZGVEcmF3ZXJDb21wb25lbnQ7XHJcbiAgICBAVmlld0NoaWxkKFwiZ3JvY2VyeVRleHRGaWVsZFwiKSBncm9jZXJ5VGV4dEZpZWxkOiBFbGVtZW50UmVmO1xyXG4gICAgQFZpZXdDaGlsZChcIm15TGlzdFZpZXdcIikgbGlzdFZpZXdDb21wb25lbnQ6IFJhZExpc3RWaWV3Q29tcG9uZW50O1xyXG5cclxuICAgIHByaXZhdGUgbGVmdEl0ZW06IFZpZXc7XHJcbiAgICBwcml2YXRlIHJpZ2h0SXRlbTogVmlldztcclxuICAgIHByaXZhdGUgbWFpblZpZXc6IFZpZXc7XHJcbiAgICBwcml2YXRlIGFuaW1hdGlvbkFwcGxpZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX3NpZGVEcmF3ZXJUcmFuc2l0aW9uOiBEcmF3ZXJUcmFuc2l0aW9uQmFzZTtcclxuICAgIHByaXZhdGUgX2RhdGFJdGVtczogT2JzZXJ2YWJsZUFycmF5PERhdGFJdGVtPjtcclxuICAgIHB1YmxpYyBfbGlzdHM6IEFycmF5PExpc3Q+O1xyXG4gICAgcHJpdmF0ZSBsaXN0c1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG4gICAgcHJpdmF0ZSBfbnVtYmVyT2ZBZGRlZEl0ZW1zO1xyXG4gICAgbGlzdERlc2NyaXB0aW9uOiBzdHJpbmcgPSAnJztcclxuICAgIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcmFuZDogbnVtYmVyID0gMDtcclxuICAgIFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLCBcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgbGlzdFNlcnZpY2U6IExpc3RTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBsaXN0c1NlcnZpY2U6IExpc3RzU2VydmljZSxcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgYXBwRGF0YTogQXBwRGF0YVNlcnZpY2Upe1xyXG4gICAgICAgIHRoaXMuZ2V0TGlzdHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgICAgICBpZighQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiYXV0aGVudGljYXRlZFwiLCBmYWxzZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2xvZ2luXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubGlzdHNTdWJzY3JpcHRpb24gPSB0aGlzLmxpc3RzU2VydmljZS5nZXRMaXN0c0FzT2JzZXJ2YWJsZSgpXHJcbiAgICAgICAgLnN1YnNjcmliZSggbGlzdHMgPT4ge1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0cykpIHtcclxuICAgICAgICAgICAgICAgIGxpc3RzID0gdGhpcy5zb3J0TGlzdHMobGlzdHMpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSRUNFSVZFRCBMSVNUUyBBVCBMSVNUIENPTVA6OjpcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihsaXN0cyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0cyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobGlzdHMpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFuZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0cyA9IHRoaXMuX2xpc3RzLnNsaWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fc2lkZURyYXdlclRyYW5zaXRpb24gPSBuZXcgU2xpZGVJbk9uVG9wVHJhbnNpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuX2RhdGFJdGVtcyA9IG5ldyBPYnNlcnZhYmxlQXJyYXkodGhpcy5saXN0U2VydmljZS5nZXREYXRhSXRlbXMoKSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldCBzaWRlRHJhd2VyVHJhbnNpdGlvbigpOiBEcmF3ZXJUcmFuc2l0aW9uQmFzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpZGVEcmF3ZXJUcmFuc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBkYXRhSXRlbXMoKTogT2JzZXJ2YWJsZUFycmF5PERhdGFJdGVtPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFJdGVtcztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGlzdHMoKTogQXJyYXk8TGlzdD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0cztcclxuICAgIH1cclxuXHJcbiAgICBvbkRyYXdlckJ1dHRvblRhcCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlckNvbXBvbmVudC5zaWRlRHJhd2VyLnNob3dEcmF3ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBnb1RvTGlzdChsaXN0a2V5OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFwcERhdGEuc2V0QWN0aXZlTGlzdChsaXN0a2V5KTtcclxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbGlzdC1pdGVtXCJdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25QdWxsVG9SZWZyZXNoSW5pdGlhdGVkKGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKSB7XHJcbiAgICAgICAgdmFyIGxpc3RWaWV3ID0gYXJncy5vYmplY3Q7XHJcbiAgICAgICAgdGhpcy5nZXRMaXN0cygpO1xyXG4gICAgICAgIGxpc3RWaWV3Lm5vdGlmeVB1bGxUb1JlZnJlc2hGaW5pc2hlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZExpc3QodGFyZ2V0OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInRleHRmaWVsZCBpbnB1dDpcIiwgdGhpcy5saXN0RGVzY3JpcHRpb24pO1xyXG4gICAgICAgIGxldCB0ZXh0RmllbGQgPSA8VGV4dEZpZWxkPnRoaXMuZ3JvY2VyeVRleHRGaWVsZC5uYXRpdmVFbGVtZW50OyBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubGlzdERlc2NyaXB0aW9uLnRyaW0oKSA9PT0gJycpIHtcclxuICAgICAgICAgICAgLy8gaWYgdGhlIHVzZXIgY2xpY2tlZCB0aGUgYWRkIGJ1dHRvbiBhbmQgdGhlIHRleHRmaWVsZCBpcyBlbXB0eSxcclxuICAgICAgICAgICAgLy8gZm9jdXMgdGhlIHRleHRmaWVsZCBhbmQgcmV0dXJuXHJcbiAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiVG8gY3JlYXRlIGEgbmV3IGxpc3QsIGZpcnN0IGVudGVyIGEgZGVzY3JpcHRpb25cIik7XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IFwiYnV0dG9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHRleHRGaWVsZC5mb2N1cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRGlzbWlzcyB0aGUga2V5Ym9hcmRcclxuICAgICAgICB0ZXh0RmllbGQuZGlzbWlzc1NvZnRJbnB1dCgpO1xyXG4gICAgICAgIHRoaXMuc2hvd0FjdGl2aXR5SW5kaWNhdG9yKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgbGlzdCA9IHtcclxuICAgICAgICAgICAgY3JlYXRvclVJRCA6IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1aWQnKSxcclxuICAgICAgICAgICAgZGF0ZUNyZWF0ZWQ6IG1vbWVudCgpLmZvcm1hdChcIllZWVktTU0tREQgSEg6bW06c3NcIiksXHJcbiAgICAgICAgICAgIGRhdGVNb2RpZmllZDogbW9tZW50KCkuZm9ybWF0KFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMubGlzdERlc2NyaXB0aW9uXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9saXN0cy51bnNoaWZ0KGxpc3QpO1xyXG5cclxuICAgICAgICB0aGlzLmxpc3RzU2VydmljZS5jcmVhdGVOZXdMaXN0KGxpc3QpXHJcbiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVkIVwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5kaXIocmVzdWx0KTtcclxuICAgICAgICAgICAgdGhpcy5saXN0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgdGhpcy5oaWRlQWN0aXZpdHlJbmRpY2F0b3IoKTtcclxuICAgICAgICAgICAgdGhpcy5nZXRMaXN0cygpO1xyXG4gICAgICAgIH0pLmNhdGNoKCBlcnIgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmhpZGVBY3Rpdml0eUluZGljYXRvcigpO1xyXG4gICAgICAgICAgICAobmV3IFNuYWNrQmFyKCkpLnNpbXBsZShcIkxpc3QgY291bGRuJ3QgYmUgY3JlYXRlZCFcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGlzdHMoKSB7XHJcbiAgICAgICAgdGhpcy5saXN0c1NlcnZpY2UuZ2V0VXNlckxpc3RzKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1aWQnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2soKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ3VpZCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzb3J0TGlzdHMobGlzdDogQXJyYXk8TGlzdD4pIHtcclxuICAgICAgICBsaXN0LnNvcnQoIChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhWydkYXRlTW9kaWZpZWQnXSA+IGJbJ2RhdGVNb2RpZmllZCddKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYVsnZGF0ZU1vZGlmaWVkJ10gPCBiWydkYXRlTW9kaWZpZWQnXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvd0FjdGl2aXR5SW5kaWNhdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaGlkZUFjdGl2aXR5SW5kaWNhdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgb25DZWxsU3dpcGluZyhhcmdzOiBMaXN0Vmlld0V2ZW50RGF0YSkge1xyXG4gICAgICAgIHZhciBzd2lwZUxpbWl0cyA9IGFyZ3MuZGF0YS5zd2lwZUxpbWl0cztcclxuICAgICAgICB2YXIgc3dpcGVWaWV3ID0gYXJnc1snc3dpcGVWaWV3J107XHJcbiAgICAgICAgdGhpcy5tYWluVmlldyA9IGFyZ3NbJ21haW5WaWV3J107XHJcbiAgICAgICAgdGhpcy5sZWZ0SXRlbSA9IHN3aXBlVmlldy5nZXRWaWV3QnlJZCgnbGVmdC1zdGFjaycpO1xyXG4gICAgICAgIHRoaXMucmlnaHRJdGVtID0gc3dpcGVWaWV3LmdldFZpZXdCeUlkKCdyaWdodC1zdGFjaycpO1xyXG5cclxuICAgICAgICBpZiAoYXJncy5kYXRhLnggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0RGltZW5zaW9ucyA9IFZpZXcubWVhc3VyZUNoaWxkKFxyXG4gICAgICAgICAgICAgICAgPFZpZXc+dGhpcy5sZWZ0SXRlbS5wYXJlbnQsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRJdGVtLFxyXG4gICAgICAgICAgICAgICAgbGF5b3V0Lm1ha2VNZWFzdXJlU3BlYyhNYXRoLmFicyhhcmdzLmRhdGEueCksIGxheW91dC5FWEFDVExZKSxcclxuICAgICAgICAgICAgICAgIGxheW91dC5tYWtlTWVhc3VyZVNwZWModGhpcy5tYWluVmlldy5nZXRNZWFzdXJlZEhlaWdodCgpLCBsYXlvdXQuRVhBQ1RMWSkpO1xyXG4gICAgICAgICAgICBWaWV3LmxheW91dENoaWxkKDxWaWV3PnRoaXMubGVmdEl0ZW0ucGFyZW50LCB0aGlzLmxlZnRJdGVtLCAwLCAwLCBsZWZ0RGltZW5zaW9ucy5tZWFzdXJlZFdpZHRoLCBsZWZ0RGltZW5zaW9ucy5tZWFzdXJlZEhlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZU90aGVyU3dpcGVUZW1wbGF0ZVZpZXcoXCJsZWZ0XCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciByaWdodERpbWVuc2lvbnMgPSBWaWV3Lm1lYXN1cmVDaGlsZChcclxuICAgICAgICAgICAgICAgIDxWaWV3PnRoaXMucmlnaHRJdGVtLnBhcmVudCxcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRJdGVtLFxyXG4gICAgICAgICAgICAgICAgbGF5b3V0Lm1ha2VNZWFzdXJlU3BlYyhNYXRoLmFicyhhcmdzLmRhdGEueCksIGxheW91dC5FWEFDVExZKSxcclxuICAgICAgICAgICAgICAgIGxheW91dC5tYWtlTWVhc3VyZVNwZWModGhpcy5tYWluVmlldy5nZXRNZWFzdXJlZEhlaWdodCgpLCBsYXlvdXQuRVhBQ1RMWSkpO1xyXG5cclxuICAgICAgICAgICAgVmlldy5sYXlvdXRDaGlsZCg8Vmlldz50aGlzLnJpZ2h0SXRlbS5wYXJlbnQsIHRoaXMucmlnaHRJdGVtLCB0aGlzLm1haW5WaWV3LmdldE1lYXN1cmVkV2lkdGgoKSAtIHJpZ2h0RGltZW5zaW9ucy5tZWFzdXJlZFdpZHRoLCAwLCB0aGlzLm1haW5WaWV3LmdldE1lYXN1cmVkV2lkdGgoKSwgcmlnaHREaW1lbnNpb25zLm1lYXN1cmVkSGVpZ2h0KTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlT3RoZXJTd2lwZVRlbXBsYXRlVmlldyhcInJpZ2h0XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhpZGVPdGhlclN3aXBlVGVtcGxhdGVWaWV3KGN1cnJlbnRTd2lwZVZpZXc6IHN0cmluZykge1xyXG4gICAgICAgIHN3aXRjaCAoY3VycmVudFN3aXBlVmlldykge1xyXG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmlnaHRJdGVtLmdldEFjdHVhbFNpemUoKS53aWR0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgVmlldy5sYXlvdXRDaGlsZCg8Vmlldz50aGlzLnJpZ2h0SXRlbS5wYXJlbnQsIHRoaXMucmlnaHRJdGVtLCB0aGlzLm1haW5WaWV3LmdldE1lYXN1cmVkV2lkdGgoKSwgMCwgdGhpcy5tYWluVmlldy5nZXRNZWFzdXJlZFdpZHRoKCksIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGVmdEl0ZW0uZ2V0QWN0dWFsU2l6ZSgpLndpZHRoICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBWaWV3LmxheW91dENoaWxkKDxWaWV3PnRoaXMubGVmdEl0ZW0ucGFyZW50LCB0aGlzLmxlZnRJdGVtLCAwLCAwLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblN3aXBlQ2VsbFN0YXJ0ZWQoYXJnczogTGlzdFZpZXdFdmVudERhdGEpIHtcclxuICAgICAgICB2YXIgc3dpcGVMaW1pdHMgPSBhcmdzLmRhdGEuc3dpcGVMaW1pdHM7XHJcbiAgICAgICAgc3dpcGVMaW1pdHMudGhyZXNob2xkID0gYXJnc1snbWFpblZpZXcnXS5nZXRNZWFzdXJlZFdpZHRoKCkgKiAwLjI7IC8vIDIwJSBvZiB3aG9sZSB3aWR0aFxyXG4gICAgICAgIHN3aXBlTGltaXRzLmxlZnQgPSBzd2lwZUxpbWl0cy5yaWdodCA9IGFyZ3NbJ21haW5WaWV3J10uZ2V0TWVhc3VyZWRXaWR0aCgpICogMC42NSAvLyA2NSUgb2Ygd2hvbGUgd2lkdGhcclxuICAgIH1cclxuICAgIC8vIDw8IGFuZ3VsYXItbGlzdHZpZXctc3dpcGUtYWN0aW9uLW11bHRpcGxlLWxpbWl0c1xyXG5cclxuICAgIHB1YmxpYyBvblN3aXBlQ2VsbEZpbmlzaGVkKGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKSB7XHJcbiAgICAgICAgaWYgKGFyZ3MuZGF0YS54ID4gMjAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGVyZm9ybSBsZWZ0IGFjdGlvblwiKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MuZGF0YS54IDwgLTIwMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBlcmZvcm0gcmlnaHQgYWN0aW9uXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFuaW1hdGlvbkFwcGxpZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25MZWZ0U3dpcGVDbGljayhhcmdzOiBMaXN0Vmlld0V2ZW50RGF0YSkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU3dpcGVUYXBFdmVudChhcmdzKTtcclxuICAgICAgICB0aGlzLmxpc3RWaWV3Q29tcG9uZW50Lmxpc3RWaWV3Lm5vdGlmeVN3aXBlVG9FeGVjdXRlRmluaXNoZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25SaWdodFN3aXBlQ2xpY2soYXJncykge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU3dpcGVUYXBFdmVudChhcmdzKTtcclxuICAgICAgICB0aGlzLmxpc3RWaWV3Q29tcG9uZW50Lmxpc3RWaWV3Lm5vdGlmeVN3aXBlVG9FeGVjdXRlRmluaXNoZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZVN3aXBlVGFwRXZlbnQoYXJnczogTGlzdFZpZXdFdmVudERhdGEpIHtcclxuICAgICAgICBjb25zdCBjbGlja2VkSW5kZXggPSB0aGlzLmxpc3RWaWV3Q29tcG9uZW50Lmxpc3RWaWV3Lml0ZW1zLmluZGV4T2YoYXJncy5vYmplY3QuYmluZGluZ0NvbnRleHQpO1xyXG4gICAgICAgIGlmIChhcmdzLm9iamVjdC5pZCA9PT0gJ2J0bkRlbGV0ZScpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVMaXN0KGNsaWNrZWRJbmRleCwgdGhpcy5fbGlzdHNbY2xpY2tlZEluZGV4XVsnbGlzdEtleSddKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3Mub2JqZWN0LmlkID09PSAnYnRuQXJjaGl2ZScpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhcmNoaXZlIHRoZSBsaXN0OlwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5kaXIodGhpcy5fbGlzdHNbY2xpY2tlZEluZGV4XSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXJjaGl2ZUxpc3QoY2xpY2tlZEluZGV4LCB0aGlzLl9saXN0c1tjbGlja2VkSW5kZXhdWydsaXN0S2V5J10pO1xyXG4gICAgICAgIH0gZWxzZSAgaWYgKGFyZ3Mub2JqZWN0LmlkID09PSAnYnRuU2hhcmUnKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaGFyZSB0aGUgbGlzdDpcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKHRoaXMuX2xpc3RzW2NsaWNrZWRJbmRleF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlbGV0ZUxpc3QoY2xpY2tlZEluZGV4LCBsaXN0SUQpIHtcclxuICAgICAgICB0aGlzLl9saXN0cy5zcGxpY2UoY2xpY2tlZEluZGV4LCAxKTtcclxuICAgICAgICBmaXJlYmFzZVdlYkFwaS5kYXRhYmFzZSgpLnJlZihcIi9saXN0c1wiKS5jaGlsZChsaXN0SUQpLnNldChudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFyY2hpdmVMaXN0KGNsaWNrZWRJbmRleCwgbGlzdElEKSB7XHJcbiAgICAgICAgbGV0IHRtcExpc3QgPSB0aGlzLl9saXN0c1tjbGlja2VkSW5kZXhdO1xyXG4gICAgICAgIHRtcExpc3QuYXJjaGl2ZWQgPSB0cnVlO1xyXG4gICAgICAgIGZpcmViYXNlV2ViQXBpLmRhdGFiYXNlKCkucmVmKFwiL2xpc3RzXCIpLmNoaWxkKGxpc3RJRCkuc2V0KHRtcExpc3QpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuIl19