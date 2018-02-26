"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var nativescript_snackbar_1 = require("nativescript-snackbar");
var sidedrawer_1 = require("nativescript-pro-ui/sidedrawer");
var angular_1 = require("nativescript-pro-ui/sidedrawer/angular");
var angular_2 = require("nativescript-pro-ui/listview/angular");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var Application = require("tns-core-modules/application");
var ApplicationSettings = require("application-settings");
var moment = require("moment");
var list_service_1 = require("../list.service");
var lists_service_1 = require("../lists.service");
var dataitem_class_1 = require("../../classes/dataitem.class");
var posts = require('../posts.json');
var ListComponent = /** @class */ (function () {
    function ListComponent(router, listService, listsService) {
        this.router = router;
        this.listService = listService;
        this.listsService = listsService;
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
    // Prevent the first textfield from receiving focus on Android
    // See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
    ListComponent.prototype.handleAndroidFocus = function (textField, container) {
        if (container.android) {
            container.android.setFocusableInTouchMode(true);
            container.android.setFocusable(true);
            textField.android.clearFocus();
        }
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
        this.listsService.createNewList(ApplicationSettings.getString('uid'), this.listDescription)
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
    __decorate([
        core_1.ViewChild("drawer"),
        __metadata("design:type", angular_1.RadSideDrawerComponent)
    ], ListComponent.prototype, "drawerComponent", void 0);
    __decorate([
        core_1.ViewChild("listview"),
        __metadata("design:type", angular_2.RadListViewComponent)
    ], ListComponent.prototype, "listViewComponent", void 0);
    __decorate([
        core_1.ViewChild("groceryTextField"),
        __metadata("design:type", core_1.ElementRef)
    ], ListComponent.prototype, "groceryTextField", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF3RjtBQUN4RixzREFBK0Q7QUFDL0QsK0RBQWlEO0FBQ2pELDZEQUE2RztBQUM3RyxrRUFBZ0Y7QUFDaEYsZ0VBQTRFO0FBRTVFLDJFQUF5RTtBQUN6RSxvREFBc0Q7QUFDdEQsMERBQTREO0FBRzVELDBEQUE0RDtBQUU1RCwrQkFBaUM7QUFJakMsZ0RBQThDO0FBQzlDLGtEQUFnRDtBQUVoRCwrREFBd0Q7QUFLeEQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBVXJDO0lBZUksdUJBQW9CLE1BQXdCLEVBQVUsV0FBd0IsRUFBVSxZQUEwQjtRQUE5RixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQWM7UUFMbEgsb0JBQWUsR0FBVyxFQUFFLENBQUM7UUFDN0IsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBSWIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxnQ0FBUSxHQUFSO1FBQUEsaUJBbUJDO1FBbEJHLEVBQUUsQ0FBQSxDQUFDLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzdELENBQUM7UUFFRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsRUFBRTthQUNoRSxTQUFTLENBQUUsVUFBQSxLQUFLO1lBQ2IsRUFBRSxDQUFDLENB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Z0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsU0FBUztZQUNuQixTQUFTLEVBQUUsQ0FBQywwQkFBVyxDQUFDO1lBQ3hCLFdBQVcsRUFBRSxxQkFBcUI7WUFDbEMsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUM7U0FDcEMsQ0FBQzt5Q0FnQjhCLHlCQUFnQixFQUF1QiwwQkFBVyxFQUF3Qiw0QkFBWTtPQWZ6RyxhQUFhLENBaUt6QjtJQUFELG9CQUFDO0NBQUEsQUFqS0QsSUFpS0M7QUFqS1ksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBBZnRlclZpZXdJbml0LCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBTbmFja0JhciB9IGZyb20gJ25hdGl2ZXNjcmlwdC1zbmFja2Jhcic7XHJcbmltcG9ydCB7IERyYXdlclRyYW5zaXRpb25CYXNlLCBTbGlkZUluT25Ub3BUcmFuc2l0aW9uLCBSYWRTaWRlRHJhd2VyIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcm8tdWkvc2lkZWRyYXdlclwiO1xyXG5pbXBvcnQgeyBSYWRTaWRlRHJhd2VyQ29tcG9uZW50IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcm8tdWkvc2lkZWRyYXdlci9hbmd1bGFyXCI7XHJcbmltcG9ydCB7IFJhZExpc3RWaWV3Q29tcG9uZW50IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcm8tdWkvbGlzdHZpZXcvYW5ndWxhclwiO1xyXG5pbXBvcnQgeyBUZXh0RmllbGQgfSBmcm9tIFwidWkvdGV4dC1maWVsZFwiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlQXJyYXkgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9kYXRhL29ic2VydmFibGUtYXJyYXlcIjtcclxuaW1wb3J0ICogYXMgdGltZXJNb2R1bGUgZnJvbSAndG5zLWNvcmUtbW9kdWxlcy90aW1lcic7XHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uXCI7XHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMvU3Vic2NyaXB0aW9uJztcclxuXHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSAnYXBwbGljYXRpb24tc2V0dGluZ3MnO1xyXG5pbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tICduYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlJztcclxuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcblxyXG5pbXBvcnQgeyBIdHRwU2VydmljZSB9IGZyb20gJy4uLy4uL2h0dHAuc2VydmljZSc7XHJcbmltcG9ydCB7IEFwcERhdGFTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9hcHBkYXRhLnNlcnZpY2VcIjtcclxuaW1wb3J0IHsgTGlzdFNlcnZpY2UgfSBmcm9tICcuLi9saXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMaXN0c1NlcnZpY2UgfSBmcm9tICcuLi9saXN0cy5zZXJ2aWNlJztcclxuXHJcbmltcG9ydCB7IERhdGFJdGVtIH0gZnJvbSAnLi4vLi4vY2xhc3Nlcy9kYXRhaXRlbS5jbGFzcyc7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tICcuLi8uLi9jbGFzc2VzL2xpc3QuY2xhc3MnO1xyXG5pbXBvcnQgeyBMaXN0Vmlld0V2ZW50RGF0YSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1wcm8tdWkvbGlzdHZpZXcnO1xyXG5cclxuXHJcbnZhciBwb3N0cyA9IHJlcXVpcmUoJy4uL3Bvc3RzLmpzb24nKTtcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICBzZWxlY3RvcjogJ25zLWxpc3QnLFxyXG4gICAgcHJvdmlkZXJzOiBbTGlzdFNlcnZpY2VdLFxyXG4gICAgdGVtcGxhdGVVcmw6ICdsaXN0LmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWydsaXN0LmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgICBAVmlld0NoaWxkKFwiZHJhd2VyXCIpIGRyYXdlckNvbXBvbmVudDogUmFkU2lkZURyYXdlckNvbXBvbmVudDtcclxuICAgIEBWaWV3Q2hpbGQoXCJsaXN0dmlld1wiKSBsaXN0Vmlld0NvbXBvbmVudDogUmFkTGlzdFZpZXdDb21wb25lbnQ7XHJcbiAgICBAVmlld0NoaWxkKFwiZ3JvY2VyeVRleHRGaWVsZFwiKSBncm9jZXJ5VGV4dEZpZWxkOiBFbGVtZW50UmVmO1xyXG5cclxuICAgIHByaXZhdGUgX3NpZGVEcmF3ZXJUcmFuc2l0aW9uOiBEcmF3ZXJUcmFuc2l0aW9uQmFzZTtcclxuICAgIHByaXZhdGUgX2RhdGFJdGVtczogT2JzZXJ2YWJsZUFycmF5PERhdGFJdGVtPjtcclxuICAgIHB1YmxpYyBfbGlzdHM6IEFycmF5PExpc3Q+O1xyXG4gICAgcHJpdmF0ZSBsaXN0c1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG4gICAgcHJpdmF0ZSBfbnVtYmVyT2ZBZGRlZEl0ZW1zO1xyXG4gICAgbGlzdERlc2NyaXB0aW9uOiBzdHJpbmcgPSAnJztcclxuICAgIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcmFuZDogbnVtYmVyID0gMDtcclxuICAgIFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLCBwcml2YXRlIGxpc3RTZXJ2aWNlOiBMaXN0U2VydmljZSwgcHJpdmF0ZSBsaXN0c1NlcnZpY2U6IExpc3RzU2VydmljZSl7XHJcbiAgICAgICAgdGhpcy5nZXRMaXN0cygpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmKCFBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJhdXRoZW50aWNhdGVkXCIsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbG9naW5cIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5saXN0c1N1YnNjcmlwdGlvbiA9IHRoaXMubGlzdHNTZXJ2aWNlLmdldExpc3RzQXNPYnNlcnZhYmxlKClcclxuICAgICAgICAuc3Vic2NyaWJlKCBsaXN0cyA9PiB7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxpc3RzKSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdHMgPSB0aGlzLnNvcnRMaXN0cyhsaXN0cyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJFQ0VJVkVEIExJU1RTIEFUIExJU1QgQ09NUDo6OlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGxpc3RzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShsaXN0cykpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5kID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RzID0gdGhpcy5fbGlzdHMuc2xpY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9zaWRlRHJhd2VyVHJhbnNpdGlvbiA9IG5ldyBTbGlkZUluT25Ub3BUcmFuc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5fZGF0YUl0ZW1zID0gbmV3IE9ic2VydmFibGVBcnJheSh0aGlzLmxpc3RTZXJ2aWNlLmdldERhdGFJdGVtcygpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQcmV2ZW50IHRoZSBmaXJzdCB0ZXh0ZmllbGQgZnJvbSByZWNlaXZpbmcgZm9jdXMgb24gQW5kcm9pZFxyXG4gICAgLy8gU2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTA1NjczNC9hbmRyb2lkLWZvcmNlLWVkaXR0ZXh0LXRvLXJlbW92ZS1mb2N1c1xyXG4gICAgaGFuZGxlQW5kcm9pZEZvY3VzKHRleHRGaWVsZCwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbnRhaW5lci5hbmRyb2lkKSB7XHJcbiAgICAgICAgY29udGFpbmVyLmFuZHJvaWQuc2V0Rm9jdXNhYmxlSW5Ub3VjaE1vZGUodHJ1ZSk7XHJcbiAgICAgICAgY29udGFpbmVyLmFuZHJvaWQuc2V0Rm9jdXNhYmxlKHRydWUpO1xyXG4gICAgICAgIHRleHRGaWVsZC5hbmRyb2lkLmNsZWFyRm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNpZGVEcmF3ZXJUcmFuc2l0aW9uKCk6IERyYXdlclRyYW5zaXRpb25CYXNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2lkZURyYXdlclRyYW5zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRhdGFJdGVtcygpOiBPYnNlcnZhYmxlQXJyYXk8RGF0YUl0ZW0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YUl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsaXN0cygpOiBBcnJheTxMaXN0PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RzO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRHJhd2VyQnV0dG9uVGFwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyQ29tcG9uZW50LnNpZGVEcmF3ZXIuc2hvd0RyYXdlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblB1bGxUb1JlZnJlc2hJbml0aWF0ZWRFeGFtcGxlKGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSBuZXcgV2Vha1JlZih0aGlzKTtcclxuICAgICAgICB0aW1lck1vZHVsZS5zZXRUaW1lb3V0KCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxOdW1iZXJPZkl0ZW1zID0gdGhhdC5nZXQoKS5fbnVtYmVyT2ZBZGRlZEl0ZW1zO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gdGhhdC5nZXQoKS5fbnVtYmVyT2ZBZGRlZEl0ZW1zOyBpIDwgaW5pdGlhbE51bWJlck9mSXRlbXMgKyAyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID4gcG9zdHMubmFtZXMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW1hZ2VVcmkgPSBBcHBsaWNhdGlvbi5hbmRyb2lkID8gcG9zdHMuaW1hZ2VzW2ldLnRvTG93ZXJDYXNlKCkgOiBwb3N0cy5pbWFnZXNbaV07XHJcbiAgICAgICAgICAgICAgICB0aGF0LmdldCgpLl9kYXRhSXRlbXMuc3BsaWNlKDAsIDAsIG5ldyBEYXRhSXRlbShpLCBwb3N0cy5uYW1lc1tpXSwgXCJUaGlzIGlzIGl0ZW0gZGVzY3JpcHRpb25cIiwgcG9zdHMudGl0bGVzW2ldLCBwb3N0cy50ZXh0W2ldLCBcInJlczovL1wiICsgaW1hZ2VVcmkpKTtcclxuICAgICAgICAgICAgICAgIHRoYXQuZ2V0KCkuX251bWJlck9mQWRkZWRJdGVtcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBsaXN0VmlldyA9IGFyZ3Mub2JqZWN0O1xyXG4gICAgICAgICAgICBsaXN0Vmlldy5ub3RpZnlQdWxsVG9SZWZyZXNoRmluaXNoZWQoKTtcclxuICAgICAgICB9LCAxMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25QdWxsVG9SZWZyZXNoSW5pdGlhdGVkKGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKSB7XHJcbiAgICAgICAgdmFyIGxpc3RWaWV3ID0gYXJncy5vYmplY3Q7XHJcbiAgICAgICAgdGhpcy5nZXRMaXN0cygpO1xyXG4gICAgICAgIGxpc3RWaWV3Lm5vdGlmeVB1bGxUb1JlZnJlc2hGaW5pc2hlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZExpc3QodGFyZ2V0OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInRleHRmaWVsZCBpbnB1dDpcIiwgdGhpcy5saXN0RGVzY3JpcHRpb24pO1xyXG4gICAgICAgIGxldCB0ZXh0RmllbGQgPSA8VGV4dEZpZWxkPnRoaXMuZ3JvY2VyeVRleHRGaWVsZC5uYXRpdmVFbGVtZW50OyBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubGlzdERlc2NyaXB0aW9uLnRyaW0oKSA9PT0gJycpIHtcclxuICAgICAgICAgICAgLy8gaWYgdGhlIHVzZXIgY2xpY2tlZCB0aGUgYWRkIGJ1dHRvbiBhbmQgdGhlIHRleHRmaWVsZCBpcyBlbXB0eSxcclxuICAgICAgICAgICAgLy8gZm9jdXMgdGhlIHRleHRmaWVsZCBhbmQgcmV0dXJuXHJcbiAgICAgICAgICAgIChuZXcgU25hY2tCYXIoKSkuc2ltcGxlKFwiVG8gY3JlYXRlIGEgbmV3IGxpc3QsIGZpcnN0IGVudGVyIGEgZGVzY3JpcHRpb25cIik7XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IFwiYnV0dG9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHRleHRGaWVsZC5mb2N1cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRGlzbWlzcyB0aGUga2V5Ym9hcmRcclxuICAgICAgICB0ZXh0RmllbGQuZGlzbWlzc1NvZnRJbnB1dCgpO1xyXG4gICAgICAgIHRoaXMuc2hvd0FjdGl2aXR5SW5kaWNhdG9yKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgbGlzdCA9IHtcclxuICAgICAgICAgICAgY3JlYXRvclVJRCA6IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1aWQnKSxcclxuICAgICAgICAgICAgZGF0ZUNyZWF0ZWQ6IG1vbWVudCgpLmZvcm1hdChcIllZWVktTU0tREQgSEg6bW06c3NcIiksXHJcbiAgICAgICAgICAgIGRhdGVNb2RpZmllZDogbW9tZW50KCkuZm9ybWF0KFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMubGlzdERlc2NyaXB0aW9uXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9saXN0cy51bnNoaWZ0KGxpc3QpO1xyXG5cclxuICAgICAgICB0aGlzLmxpc3RzU2VydmljZS5jcmVhdGVOZXdMaXN0KEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1aWQnKSwgdGhpcy5saXN0RGVzY3JpcHRpb24pXHJcbiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlZCFcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0RGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGVBY3Rpdml0eUluZGljYXRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0TGlzdHMoKTtcclxuICAgICAgICAgICAgICAgIH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgKS5jYXRjaCggZXJyID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlQWN0aXZpdHlJbmRpY2F0b3IoKTtcclxuICAgICAgICAgICAgKG5ldyBTbmFja0JhcigpKS5zaW1wbGUoXCJMaXN0IGNvdWxkbid0IGJlIGNyZWF0ZWQhXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExpc3RzKCkge1xyXG4gICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlLmdldFVzZXJMaXN0cyhBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygndWlkJykpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCd1aWQnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc29ydExpc3RzKGxpc3Q6IEFycmF5PExpc3Q+KSB7XHJcbiAgICAgICAgbGlzdC5zb3J0KCAoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYVsnZGF0ZU1vZGlmaWVkJ10gPCBiWydkYXRlTW9kaWZpZWQnXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFbJ2RhdGVNb2RpZmllZCddID4gYlsnZGF0ZU1vZGlmaWVkJ10pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dBY3Rpdml0eUluZGljYXRvcigpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGhpZGVBY3Rpdml0eUluZGljYXRvcigpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuIl19