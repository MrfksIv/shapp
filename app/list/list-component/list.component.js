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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF3RjtBQUN4RixzREFBK0Q7QUFDL0QsK0RBQWlEO0FBQ2pELDZEQUE2RztBQUM3RyxrRUFBZ0Y7QUFDaEYsZ0VBQTRFO0FBRTVFLHNEQUFxRDtBQUNyRCxzREFBc0Q7QUFDdEQsMkVBQXlFO0FBSXpFLDBEQUE0RDtBQUU1RCxpRUFBbUU7QUFDbkUsK0JBQWlDO0FBR2pDLGdFQUE4RDtBQUM5RCxnREFBOEM7QUFDOUMsa0RBQWdEO0FBT2hELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQVNyQztJQW9CSSx1QkFBb0IsTUFBd0IsRUFDeEIsV0FBd0IsRUFDeEIsWUFBMEIsRUFDMUIsT0FBdUI7UUFIdkIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFDeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFkbkMscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBTWpDLG9CQUFlLEdBQVcsRUFBRSxDQUFDO1FBQzdCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsU0FBSSxHQUFXLENBQUMsQ0FBQztRQU9iLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsZ0NBQVEsR0FBUjtRQUFBLGlCQW1CQztRQWxCRyxFQUFFLENBQUEsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBRUQsSUFBSSxDQUFDLGlC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RyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBdk9vQjtRQUFwQixnQkFBUyxDQUFDLFFBQVEsQ0FBQztrQ0FBa0IsZ0NBQXNCOzBEQUFDO0lBQzlCO1FBQTlCLGdCQUFTLENBQUMsa0JBQWtCLENBQUM7a0NBQW1CLGlCQUFVOzJEQUFDO0lBQ25DO1FBQXhCLGdCQUFTLENBQUMsWUFBWSxDQUFDO2tDQUFvQiw4QkFBb0I7NERBQUM7SUFKeEQsYUFBYTtRQU56QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxTQUFTO1lBQ25CLFdBQVcsRUFBRSxxQkFBcUI7WUFDbEMsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUM7U0FDcEMsQ0FBQzt5Q0FxQjhCLHlCQUFnQjtZQUNYLDBCQUFXO1lBQ1YsNEJBQVk7WUFDakIsZ0NBQWM7T0F2QmxDLGFBQWEsQ0EyT3pCO0lBQUQsb0JBQUM7Q0FBQSxBQTNPRCxJQTJPQztBQTNPWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEFmdGVyVmlld0luaXQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IFNuYWNrQmFyIH0gZnJvbSAnbmF0aXZlc2NyaXB0LXNuYWNrYmFyJztcclxuaW1wb3J0IHsgRHJhd2VyVHJhbnNpdGlvbkJhc2UsIFNsaWRlSW5PblRvcFRyYW5zaXRpb24sIFJhZFNpZGVEcmF3ZXIgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyXCI7XHJcbmltcG9ydCB7IFJhZFNpZGVEcmF3ZXJDb21wb25lbnQgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyL2FuZ3VsYXJcIjtcclxuaW1wb3J0IHsgUmFkTGlzdFZpZXdDb21wb25lbnQgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9saXN0dmlldy9hbmd1bGFyXCI7XHJcbmltcG9ydCB7IFRleHRGaWVsZCB9IGZyb20gXCJ1aS90ZXh0LWZpZWxkXCI7XHJcbmltcG9ydCB7IFZpZXcgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9jb3JlL3ZpZXdcIjtcclxuaW1wb3J0IHsgbGF5b3V0IH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdXRpbHMvdXRpbHNcIjtcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZUFycmF5IH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvZGF0YS9vYnNlcnZhYmxlLWFycmF5XCI7XHJcbi8vIGltcG9ydCAqIGFzIEFwcGxpY2F0aW9uIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uXCI7XHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMvU3Vic2NyaXB0aW9uJztcclxuXHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSAnYXBwbGljYXRpb24tc2V0dGluZ3MnO1xyXG5pbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tICduYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlJztcclxuaW1wb3J0ICogYXMgZmlyZWJhc2VXZWJBcGkgZnJvbSAnbmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZS9hcHAnO1xyXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcbmltcG9ydCB7IEh0dHBTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vaHR0cC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXBwRGF0YVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2FwcGRhdGEuc2VydmljZVwiO1xyXG5pbXBvcnQgeyBMaXN0U2VydmljZSB9IGZyb20gJy4uL2xpc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IExpc3RzU2VydmljZSB9IGZyb20gJy4uL2xpc3RzLnNlcnZpY2UnO1xyXG5cclxuaW1wb3J0IHsgRGF0YUl0ZW0gfSBmcm9tICcuLi8uLi9jbGFzc2VzL2RhdGFpdGVtLmNsYXNzJztcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gJy4uLy4uL2NsYXNzZXMvbGlzdC5jbGFzcyc7XHJcbmltcG9ydCB7IExpc3RWaWV3RXZlbnREYXRhIH0gZnJvbSAnbmF0aXZlc2NyaXB0LXByby11aS9saXN0dmlldyc7XHJcblxyXG5cclxudmFyIHBvc3RzID0gcmVxdWlyZSgnLi4vcG9zdHMuanNvbicpO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICAgIHNlbGVjdG9yOiAnbnMtbGlzdCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2xpc3QuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJ2xpc3QuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBAVmlld0NoaWxkKFwiZHJhd2VyXCIpIGRyYXdlckNvbXBvbmVudDogUmFkU2lkZURyYXdlckNvbXBvbmVudDtcclxuICAgIEBWaWV3Q2hpbGQoXCJncm9jZXJ5VGV4dEZpZWxkXCIpIGdyb2NlcnlUZXh0RmllbGQ6IEVsZW1lbnRSZWY7XHJcbiAgICBAVmlld0NoaWxkKFwibXlMaXN0Vmlld1wiKSBsaXN0Vmlld0NvbXBvbmVudDogUmFkTGlzdFZpZXdDb21wb25lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBsZWZ0SXRlbTogVmlldztcclxuICAgIHByaXZhdGUgcmlnaHRJdGVtOiBWaWV3O1xyXG4gICAgcHJpdmF0ZSBtYWluVmlldzogVmlldztcclxuICAgIHByaXZhdGUgYW5pbWF0aW9uQXBwbGllZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfc2lkZURyYXdlclRyYW5zaXRpb246IERyYXdlclRyYW5zaXRpb25CYXNlO1xyXG4gICAgcHJpdmF0ZSBfZGF0YUl0ZW1zOiBPYnNlcnZhYmxlQXJyYXk8RGF0YUl0ZW0+O1xyXG4gICAgcHVibGljIF9saXN0czogQXJyYXk8TGlzdD47XHJcbiAgICBwcml2YXRlIGxpc3RzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgICBwcml2YXRlIF9udW1iZXJPZkFkZGVkSXRlbXM7XHJcbiAgICBsaXN0RGVzY3JpcHRpb246IHN0cmluZyA9ICcnO1xyXG4gICAgaXNMb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICByYW5kOiBudW1iZXIgPSAwO1xyXG4gICAgXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXI6IFJvdXRlckV4dGVuc2lvbnMsIFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBsaXN0U2VydmljZTogTGlzdFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIGxpc3RzU2VydmljZTogTGlzdHNTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBhcHBEYXRhOiBBcHBEYXRhU2VydmljZSl7XHJcbiAgICAgICAgdGhpcy5nZXRMaXN0cygpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmKCFBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJhdXRoZW50aWNhdGVkXCIsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbG9naW5cIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5saXN0c1N1YnNjcmlwdGlvbiA9IHRoaXMubGlzdHNTZXJ2aWNlLmdldExpc3RzQXNPYnNlcnZhYmxlKClcclxuICAgICAgICAuc3Vic2NyaWJlKCBsaXN0cyA9PiB7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxpc3RzKSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdHMgPSB0aGlzLnNvcnRMaXN0cyhsaXN0cyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJFQ0VJVkVEIExJU1RTIEFUIExJU1QgQ09NUDo6OlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGxpc3RzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShsaXN0cykpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5kID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RzID0gdGhpcy5fbGlzdHMuc2xpY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9zaWRlRHJhd2VyVHJhbnNpdGlvbiA9IG5ldyBTbGlkZUluT25Ub3BUcmFuc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5fZGF0YUl0ZW1zID0gbmV3IE9ic2VydmFibGVBcnJheSh0aGlzLmxpc3RTZXJ2aWNlLmdldERhdGFJdGVtcygpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IHNpZGVEcmF3ZXJUcmFuc2l0aW9uKCk6IERyYXdlclRyYW5zaXRpb25CYXNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2lkZURyYXdlclRyYW5zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRhdGFJdGVtcygpOiBPYnNlcnZhYmxlQXJyYXk8RGF0YUl0ZW0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YUl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsaXN0cygpOiBBcnJheTxMaXN0PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RzO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRHJhd2VyQnV0dG9uVGFwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyQ29tcG9uZW50LnNpZGVEcmF3ZXIuc2hvd0RyYXdlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdvVG9MaXN0KGxpc3RrZXk6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYXBwRGF0YS5zZXRBY3RpdmVMaXN0KGxpc3RrZXkpO1xyXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9saXN0LWl0ZW1cIl0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblB1bGxUb1JlZnJlc2hJbml0aWF0ZWQoYXJnczogTGlzdFZpZXdFdmVudERhdGEpIHtcclxuICAgICAgICB2YXIgbGlzdFZpZXcgPSBhcmdzLm9iamVjdDtcclxuICAgICAgICB0aGlzLmdldExpc3RzKCk7XHJcbiAgICAgICAgbGlzdFZpZXcubm90aWZ5UHVsbFRvUmVmcmVzaEZpbmlzaGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdCh0YXJnZXQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidGV4dGZpZWxkIGlucHV0OlwiLCB0aGlzLmxpc3REZXNjcmlwdGlvbik7XHJcbiAgICAgICAgbGV0IHRleHRGaWVsZCA9IDxUZXh0RmllbGQ+dGhpcy5ncm9jZXJ5VGV4dEZpZWxkLm5hdGl2ZUVsZW1lbnQ7IFxyXG5cclxuICAgICAgICBpZiAodGhpcy5saXN0RGVzY3JpcHRpb24udHJpbSgpID09PSAnJykge1xyXG4gICAgICAgICAgICAvLyBpZiB0aGUgdXNlciBjbGlja2VkIHRoZSBhZGQgYnV0dG9uIGFuZCB0aGUgdGV4dGZpZWxkIGlzIGVtcHR5LFxyXG4gICAgICAgICAgICAvLyBmb2N1cyB0aGUgdGV4dGZpZWxkIGFuZCByZXR1cm5cclxuICAgICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJUbyBjcmVhdGUgYSBuZXcgbGlzdCwgZmlyc3QgZW50ZXIgYSBkZXNjcmlwdGlvblwiKTtcclxuICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gXCJidXR0b25cIikge1xyXG4gICAgICAgICAgICAgICAgdGV4dEZpZWxkLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBEaXNtaXNzIHRoZSBrZXlib2FyZFxyXG4gICAgICAgIHRleHRGaWVsZC5kaXNtaXNzU29mdElucHV0KCk7XHJcbiAgICAgICAgdGhpcy5zaG93QWN0aXZpdHlJbmRpY2F0b3IoKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBsaXN0ID0ge1xyXG4gICAgICAgICAgICBjcmVhdG9yVUlEIDogQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ3VpZCcpLFxyXG4gICAgICAgICAgICBkYXRlQ3JlYXRlZDogbW9tZW50KCkuZm9ybWF0KFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKSxcclxuICAgICAgICAgICAgZGF0ZU1vZGlmaWVkOiBtb21lbnQoKS5mb3JtYXQoXCJZWVlZLU1NLUREIEhIOm1tOnNzXCIpLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy5saXN0RGVzY3JpcHRpb25cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2xpc3RzLnVuc2hpZnQobGlzdCk7XHJcblxyXG4gICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlLmNyZWF0ZU5ld0xpc3QobGlzdClcclxuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZWQhXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmRpcihyZXN1bHQpO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3REZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLmhpZGVBY3Rpdml0eUluZGljYXRvcigpO1xyXG4gICAgICAgICAgICB0aGlzLmdldExpc3RzKCk7XHJcbiAgICAgICAgfSkuY2F0Y2goIGVyciA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZUFjdGl2aXR5SW5kaWNhdG9yKCk7XHJcbiAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiTGlzdCBjb3VsZG4ndCBiZSBjcmVhdGVkIVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRMaXN0cygpIHtcclxuICAgICAgICB0aGlzLmxpc3RzU2VydmljZS5nZXRVc2VyTGlzdHMoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoJ3VpZCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVjaygpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygndWlkJykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNvcnRMaXN0cyhsaXN0OiBBcnJheTxMaXN0Pikge1xyXG4gICAgICAgIGxpc3Quc29ydCggKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgaWYgKGFbJ2RhdGVNb2RpZmllZCddID4gYlsnZGF0ZU1vZGlmaWVkJ10pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChhWydkYXRlTW9kaWZpZWQnXSA8IGJbJ2RhdGVNb2RpZmllZCddKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93QWN0aXZpdHlJbmRpY2F0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBoaWRlQWN0aXZpdHlJbmRpY2F0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBvbkNlbGxTd2lwaW5nKGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKSB7XHJcbiAgICAgICAgdmFyIHN3aXBlTGltaXRzID0gYXJncy5kYXRhLnN3aXBlTGltaXRzO1xyXG4gICAgICAgIHZhciBzd2lwZVZpZXcgPSBhcmdzWydzd2lwZVZpZXcnXTtcclxuICAgICAgICB0aGlzLm1haW5WaWV3ID0gYXJnc1snbWFpblZpZXcnXTtcclxuICAgICAgICB0aGlzLmxlZnRJdGVtID0gc3dpcGVWaWV3LmdldFZpZXdCeUlkKCdsZWZ0LXN0YWNrJyk7XHJcbiAgICAgICAgdGhpcy5yaWdodEl0ZW0gPSBzd2lwZVZpZXcuZ2V0Vmlld0J5SWQoJ3JpZ2h0LXN0YWNrJyk7XHJcblxyXG4gICAgICAgIGlmIChhcmdzLmRhdGEueCA+IDApIHtcclxuICAgICAgICAgICAgdmFyIGxlZnREaW1lbnNpb25zID0gVmlldy5tZWFzdXJlQ2hpbGQoXHJcbiAgICAgICAgICAgICAgICA8Vmlldz50aGlzLmxlZnRJdGVtLnBhcmVudCxcclxuICAgICAgICAgICAgICAgIHRoaXMubGVmdEl0ZW0sXHJcbiAgICAgICAgICAgICAgICBsYXlvdXQubWFrZU1lYXN1cmVTcGVjKE1hdGguYWJzKGFyZ3MuZGF0YS54KSwgbGF5b3V0LkVYQUNUTFkpLFxyXG4gICAgICAgICAgICAgICAgbGF5b3V0Lm1ha2VNZWFzdXJlU3BlYyh0aGlzLm1haW5WaWV3LmdldE1lYXN1cmVkSGVpZ2h0KCksIGxheW91dC5FWEFDVExZKSk7XHJcbiAgICAgICAgICAgIFZpZXcubGF5b3V0Q2hpbGQoPFZpZXc+dGhpcy5sZWZ0SXRlbS5wYXJlbnQsIHRoaXMubGVmdEl0ZW0sIDAsIDAsIGxlZnREaW1lbnNpb25zLm1lYXN1cmVkV2lkdGgsIGxlZnREaW1lbnNpb25zLm1lYXN1cmVkSGVpZ2h0KTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlT3RoZXJTd2lwZVRlbXBsYXRlVmlldyhcImxlZnRcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHJpZ2h0RGltZW5zaW9ucyA9IFZpZXcubWVhc3VyZUNoaWxkKFxyXG4gICAgICAgICAgICAgICAgPFZpZXc+dGhpcy5yaWdodEl0ZW0ucGFyZW50LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yaWdodEl0ZW0sXHJcbiAgICAgICAgICAgICAgICBsYXlvdXQubWFrZU1lYXN1cmVTcGVjKE1hdGguYWJzKGFyZ3MuZGF0YS54KSwgbGF5b3V0LkVYQUNUTFkpLFxyXG4gICAgICAgICAgICAgICAgbGF5b3V0Lm1ha2VNZWFzdXJlU3BlYyh0aGlzLm1haW5WaWV3LmdldE1lYXN1cmVkSGVpZ2h0KCksIGxheW91dC5FWEFDVExZKSk7XHJcblxyXG4gICAgICAgICAgICBWaWV3LmxheW91dENoaWxkKDxWaWV3PnRoaXMucmlnaHRJdGVtLnBhcmVudCwgdGhpcy5yaWdodEl0ZW0sIHRoaXMubWFpblZpZXcuZ2V0TWVhc3VyZWRXaWR0aCgpIC0gcmlnaHREaW1lbnNpb25zLm1lYXN1cmVkV2lkdGgsIDAsIHRoaXMubWFpblZpZXcuZ2V0TWVhc3VyZWRXaWR0aCgpLCByaWdodERpbWVuc2lvbnMubWVhc3VyZWRIZWlnaHQpO1xyXG4gICAgICAgICAgICB0aGlzLmhpZGVPdGhlclN3aXBlVGVtcGxhdGVWaWV3KFwicmlnaHRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGlkZU90aGVyU3dpcGVUZW1wbGF0ZVZpZXcoY3VycmVudFN3aXBlVmlldzogc3RyaW5nKSB7XHJcbiAgICAgICAgc3dpdGNoIChjdXJyZW50U3dpcGVWaWV3KSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yaWdodEl0ZW0uZ2V0QWN0dWFsU2l6ZSgpLndpZHRoICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBWaWV3LmxheW91dENoaWxkKDxWaWV3PnRoaXMucmlnaHRJdGVtLnBhcmVudCwgdGhpcy5yaWdodEl0ZW0sIHRoaXMubWFpblZpZXcuZ2V0TWVhc3VyZWRXaWR0aCgpLCAwLCB0aGlzLm1haW5WaWV3LmdldE1lYXN1cmVkV2lkdGgoKSwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sZWZ0SXRlbS5nZXRBY3R1YWxTaXplKCkud2lkdGggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIFZpZXcubGF5b3V0Q2hpbGQoPFZpZXc+dGhpcy5sZWZ0SXRlbS5wYXJlbnQsIHRoaXMubGVmdEl0ZW0sIDAsIDAsIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uU3dpcGVDZWxsU3RhcnRlZChhcmdzOiBMaXN0Vmlld0V2ZW50RGF0YSkge1xyXG4gICAgICAgIHZhciBzd2lwZUxpbWl0cyA9IGFyZ3MuZGF0YS5zd2lwZUxpbWl0cztcclxuICAgICAgICBzd2lwZUxpbWl0cy50aHJlc2hvbGQgPSBhcmdzWydtYWluVmlldyddLmdldE1lYXN1cmVkV2lkdGgoKSAqIDAuMjsgLy8gMjAlIG9mIHdob2xlIHdpZHRoXHJcbiAgICAgICAgc3dpcGVMaW1pdHMubGVmdCA9IHN3aXBlTGltaXRzLnJpZ2h0ID0gYXJnc1snbWFpblZpZXcnXS5nZXRNZWFzdXJlZFdpZHRoKCkgKiAwLjY1IC8vIDY1JSBvZiB3aG9sZSB3aWR0aFxyXG4gICAgfVxyXG4gICAgLy8gPDwgYW5ndWxhci1saXN0dmlldy1zd2lwZS1hY3Rpb24tbXVsdGlwbGUtbGltaXRzXHJcblxyXG4gICAgcHVibGljIG9uU3dpcGVDZWxsRmluaXNoZWQoYXJnczogTGlzdFZpZXdFdmVudERhdGEpIHtcclxuICAgICAgICBpZiAoYXJncy5kYXRhLnggPiAyMDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQZXJmb3JtIGxlZnQgYWN0aW9uXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5kYXRhLnggPCAtMjAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGVyZm9ybSByaWdodCBhY3Rpb25cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uQXBwbGllZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkxlZnRTd2lwZUNsaWNrKGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTd2lwZVRhcEV2ZW50KGFyZ3MpO1xyXG4gICAgICAgIHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblJpZ2h0U3dpcGVDbGljayhhcmdzKSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTd2lwZVRhcEV2ZW50KGFyZ3MpO1xyXG4gICAgICAgIHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcubm90aWZ5U3dpcGVUb0V4ZWN1dGVGaW5pc2hlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlU3dpcGVUYXBFdmVudChhcmdzOiBMaXN0Vmlld0V2ZW50RGF0YSkge1xyXG4gICAgICAgIGNvbnN0IGNsaWNrZWRJbmRleCA9IHRoaXMubGlzdFZpZXdDb21wb25lbnQubGlzdFZpZXcuaXRlbXMuaW5kZXhPZihhcmdzLm9iamVjdC5iaW5kaW5nQ29udGV4dCk7XHJcbiAgICAgICAgaWYgKGFyZ3Mub2JqZWN0LmlkID09PSAnYnRuRGVsZXRlJykge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUxpc3QoY2xpY2tlZEluZGV4LCB0aGlzLl9saXN0c1tjbGlja2VkSW5kZXhdWydsaXN0S2V5J10pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5vYmplY3QuaWQgPT09ICdidG5BcmNoaXZlJykge1xyXG4gICAgICAgICAgICB0aGlzLmFyY2hpdmVMaXN0KGNsaWNrZWRJbmRleCwgdGhpcy5fbGlzdHNbY2xpY2tlZEluZGV4XVsnbGlzdEtleSddKTtcclxuICAgICAgICB9IGVsc2UgIGlmIChhcmdzLm9iamVjdC5pZCA9PT0gJ2J0blNoYXJlJyl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2hhcmUgdGhlIGxpc3Q6XCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmRpcih0aGlzLl9saXN0c1tjbGlja2VkSW5kZXhdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWxldGVMaXN0KGNsaWNrZWRJbmRleCwgbGlzdElEKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdHMuc3BsaWNlKGNsaWNrZWRJbmRleCwgMSk7XHJcbiAgICAgICAgZmlyZWJhc2VXZWJBcGkuZGF0YWJhc2UoKS5yZWYoXCIvbGlzdHNcIikuY2hpbGQobGlzdElEKS5zZXQobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhcmNoaXZlTGlzdChjbGlja2VkSW5kZXgsIGxpc3RJRCkge1xyXG4gICAgICAgIGxldCB0bXBMaXN0ID0gdGhpcy5fbGlzdHNbY2xpY2tlZEluZGV4XTtcclxuICAgICAgICB0bXBMaXN0LmFyY2hpdmVkID0gdHJ1ZTtcclxuICAgICAgICBmaXJlYmFzZVdlYkFwaS5kYXRhYmFzZSgpLnJlZihcIi9saXN0c1wiKS5jaGlsZChsaXN0SUQpLnNldCh0bXBMaXN0KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbiJdfQ==