"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var element_registry_1 = require("nativescript-angular/element-registry");
var _1 = require("./../");
var platform_1 = require("tns-core-modules/platform");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var ListItemContext = (function (_super) {
    __extends(ListItemContext, _super);
    function ListItemContext($implicit, item, index, even, odd, category) {
        var _this = _super.call(this, item) || this;
        _this.$implicit = $implicit;
        _this.item = item;
        _this.index = index;
        _this.even = even;
        _this.odd = odd;
        _this.category = category;
        return _this;
    }
    return ListItemContext;
}(core_1.ElementRef));
exports.ListItemContext = ListItemContext;
var NG_VIEW = "ng_view";
var RadListViewComponent = (function () {
    function RadListViewComponent(_elementRef, _iterableDiffers) {
        var _this = this;
        this._elementRef = _elementRef;
        this._iterableDiffers = _iterableDiffers;
        this._itemReordering = false;
        this.doCheckDelay = 5;
        this.setupItemView = new core_1.EventEmitter();
        this._listView = _elementRef.nativeElement;
        // We should consider setting this default value in the RadListView constructor.
        this._listView.listViewLayout = new _1.ListViewLinearLayout();
        var component = this;
        this._listView.itemViewLoader = function (viewType) {
            switch (viewType) {
                case _1.ListViewViewTypes.ItemView:
                    if (component._itemTemplate && _this.loader) {
                        var nativeItem = _this.loader.createEmbeddedView(component._itemTemplate, new ListItemContext(), 0);
                        var typedView = getItemViewRoot(nativeItem);
                        typedView[NG_VIEW] = nativeItem;
                        return typedView;
                    }
                    break;
                case _1.ListViewViewTypes.ItemSwipeView:
                    if (component._itemSwipeTemplate && _this.loader) {
                        var nativeItem = _this.loader.createEmbeddedView(component._itemSwipeTemplate, new ListItemContext(), 0);
                        var typedView = getItemViewRoot(nativeItem);
                        typedView[NG_VIEW] = nativeItem;
                        return typedView;
                    }
                    break;
                case _1.ListViewViewTypes.LoadOnDemandView:
                    if (component._loadOnDemandTemplate && _this.loader) {
                        var viewRef = _this.loader.createEmbeddedView(component._loadOnDemandTemplate, new ListItemContext(), 0);
                        _this.detectChangesOnChild(viewRef, -1);
                        var nativeView = getItemViewRoot(viewRef);
                        nativeView[NG_VIEW] = viewRef;
                        return nativeView;
                    }
                    break;
                case _1.ListViewViewTypes.HeaderView:
                    if (_this._listView.groupingFunction && component._headerTemplate && platform_1.isIOS) {
                        console.log("Warning: Setting custom 'tkListViewHeader' with 'groupingFunction' enabled is not supported on iOS.");
                        break;
                    }
                    if (component._headerTemplate && _this.loader && !_this._listView.groupingFunction) {
                        var viewRef = _this.loader.createEmbeddedView(component._headerTemplate, new ListItemContext(), 0);
                        _this.detectChangesOnChild(viewRef, -1);
                        var nativeView = getItemViewRoot(viewRef);
                        nativeView[NG_VIEW] = viewRef;
                        return nativeView;
                    }
                    break;
                case _1.ListViewViewTypes.FooterView:
                    if (component._footerTemplate && _this.loader) {
                        var viewRef = _this.loader.createEmbeddedView(component._footerTemplate, new ListItemContext(), 0);
                        _this.detectChangesOnChild(viewRef, -1);
                        var nativeView = getItemViewRoot(viewRef);
                        nativeView[NG_VIEW] = viewRef;
                        return nativeView;
                    }
                    break;
            }
        };
    }
    RadListViewComponent.prototype.ngAfterContentInit = function () {
        this.setItemTemplates();
    };
    Object.defineProperty(RadListViewComponent.prototype, "nativeElement", {
        get: function () {
            return this._listView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadListViewComponent.prototype, "listView", {
        get: function () {
            return this._listView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadListViewComponent.prototype, "loadOnDemandTemplate", {
        set: function (value) {
            this._loadOnDemandTemplate = value;
            this._listView.refresh();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadListViewComponent.prototype, "headerTemplate", {
        set: function (value) {
            this._headerTemplate = value;
            if (this._listView.ios) {
                this._listView['_updateHeaderFooterAvailability']();
            }
            else if (this._listView.android) {
                this._listView['_updateHeaderFooter']();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadListViewComponent.prototype, "footerTemplate", {
        set: function (value) {
            this._footerTemplate = value;
            if (this._listView.ios) {
                this._listView['_updateHeaderFooterAvailability']();
            }
            else if (this._listView.android) {
                this._listView['_updateHeaderFooter']();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadListViewComponent.prototype, "itemTemplate", {
        set: function (value) {
            this._itemTemplate = value;
            this._listView.refresh();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadListViewComponent.prototype, "itemSwipeTemplate", {
        set: function (value) {
            this._itemSwipeTemplate = value;
            this._listView.refresh();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadListViewComponent.prototype, "items", {
        set: function (value) {
            this._items = value;
            var needDiffer = true;
            if (value instanceof observable_array_1.ObservableArray) {
                needDiffer = false;
            }
            if (needDiffer && !this._differ && core_1.ɵisListLikeIterable(value)) {
                this._differ = this._iterableDiffers.find(this._items).create(function (index, item) { return item; });
            }
            this._listView.items = this._items;
        },
        enumerable: true,
        configurable: true
    });
    RadListViewComponent.prototype.ngDoCheck = function () {
        if (this._differ) {
            var changes = this._differ.diff(this._items);
            if (changes) {
                this._listView.refresh();
            }
        }
    };
    RadListViewComponent.prototype.onItemLoading = function (args) {
        var index = args.index;
        var currentItem = args.view.bindingContext;
        var ngView = args.view[NG_VIEW];
        if (ngView) {
            this.setupViewRef(ngView, currentItem, index);
            this.detectChangesOnChild(ngView, index);
        }
    };
    RadListViewComponent.prototype.setupViewRef = function (viewRef, data, index) {
        var context = viewRef.context;
        context.$implicit = data;
        context.item = data;
        context.category = data ? data.category : "";
        context.index = index;
        context.even = (index % 2 == 0);
        context.odd = !context.even;
        this.setupItemView.next({ view: viewRef, data: data, index: index, context: context });
    };
    RadListViewComponent.prototype.setLayout = function (layout) {
        this._listView.listViewLayout = layout;
    };
    RadListViewComponent.prototype.detectChangesOnChild = function (viewRef, index) {
        // Manually detect changes in child view ref
        // TODO: Is there a better way of getting viewRef's change detector
        var childChangeDetector = viewRef;
        childChangeDetector.markForCheck();
        childChangeDetector.detectChanges();
    };
    RadListViewComponent.prototype.setItemTemplates = function () {
        // The itemTemplateQuery may be changed after list items are added that contain <template> inside,
        // so cache and use only the original template to avoid errors.
        this.itemTemplate = this.itemTemplateQuery;
        if (this._templateMap) {
            var templates_1 = [];
            this._templateMap.forEach(function (value) {
                templates_1.push(value);
            });
            this.listView.itemTemplates = templates_1;
        }
    };
    RadListViewComponent.prototype.registerTemplate = function (key, template) {
        var _this = this;
        if (!this._templateMap) {
            this._templateMap = new Map();
        }
        var keyedTemplate = {
            key: key,
            createView: function () {
                var viewRef = _this.loader.createEmbeddedView(template, new ListItemContext(), 0);
                var resultView = getItemViewRoot(viewRef);
                resultView[NG_VIEW] = viewRef;
                return resultView;
            }
        };
        this._templateMap.set(key, keyedTemplate);
    };
    __decorate([
        core_1.ViewChild("loader", { read: core_1.ViewContainerRef }),
        __metadata("design:type", core_1.ViewContainerRef)
    ], RadListViewComponent.prototype, "loader", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], RadListViewComponent.prototype, "setupItemView", void 0);
    __decorate([
        core_1.ContentChild(core_1.TemplateRef),
        __metadata("design:type", core_1.TemplateRef)
    ], RadListViewComponent.prototype, "itemTemplateQuery", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], RadListViewComponent.prototype, "items", null);
    __decorate([
        core_1.HostListener("itemLoading", ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [_1.ListViewEventData]),
        __metadata("design:returntype", void 0)
    ], RadListViewComponent.prototype, "onItemLoading", null);
    RadListViewComponent = __decorate([
        core_1.Component({
            selector: "RadListView",
            template: "\n        <DetachedContainer>\n            <Placeholder #loader></Placeholder>\n        </DetachedContainer>",
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        __param(0, core_1.Inject(core_1.ElementRef)),
        __param(1, core_1.Inject(core_1.IterableDiffers)),
        __metadata("design:paramtypes", [core_1.ElementRef,
            core_1.IterableDiffers])
    ], RadListViewComponent);
    return RadListViewComponent;
}());
exports.RadListViewComponent = RadListViewComponent;
var ListViewLinearLayoutDirective = (function () {
    function ListViewLinearLayoutDirective() {
    }
    ListViewLinearLayoutDirective = __decorate([
        core_1.Directive({
            selector: "ListViewLinearLayout"
        }),
        __metadata("design:paramtypes", [])
    ], ListViewLinearLayoutDirective);
    return ListViewLinearLayoutDirective;
}());
exports.ListViewLinearLayoutDirective = ListViewLinearLayoutDirective;
var ListViewGridLayoutDirective = (function () {
    function ListViewGridLayoutDirective() {
    }
    ListViewGridLayoutDirective = __decorate([
        core_1.Directive({
            selector: "ListViewGridLayout"
        }),
        __metadata("design:paramtypes", [])
    ], ListViewGridLayoutDirective);
    return ListViewGridLayoutDirective;
}());
exports.ListViewGridLayoutDirective = ListViewGridLayoutDirective;
var ListViewStaggeredLayoutDirective = (function () {
    function ListViewStaggeredLayoutDirective() {
    }
    ListViewStaggeredLayoutDirective = __decorate([
        core_1.Directive({
            selector: "ListViewStaggeredLayout"
        }),
        __metadata("design:paramtypes", [])
    ], ListViewStaggeredLayoutDirective);
    return ListViewStaggeredLayoutDirective;
}());
exports.ListViewStaggeredLayoutDirective = ListViewStaggeredLayoutDirective;
var ReorderHandleDirective = (function () {
    function ReorderHandleDirective() {
    }
    ReorderHandleDirective = __decorate([
        core_1.Directive({
            selector: "ReorderHandle"
        }),
        __metadata("design:paramtypes", [])
    ], ReorderHandleDirective);
    return ReorderHandleDirective;
}());
exports.ReorderHandleDirective = ReorderHandleDirective;
var TKListViewHeaderDirective = (function () {
    function TKListViewHeaderDirective(owner, template) {
        this.owner = owner;
        this.template = template;
    }
    TKListViewHeaderDirective.prototype.ngOnInit = function () {
        this.owner.headerTemplate = this.template;
    };
    TKListViewHeaderDirective = __decorate([
        core_1.Directive({
            selector: "[tkListViewHeader]"
        }),
        __param(0, core_1.Inject(RadListViewComponent)),
        __param(1, core_1.Inject(core_1.TemplateRef)),
        __metadata("design:paramtypes", [RadListViewComponent,
            core_1.TemplateRef])
    ], TKListViewHeaderDirective);
    return TKListViewHeaderDirective;
}());
exports.TKListViewHeaderDirective = TKListViewHeaderDirective;
var TKListViewFooterDirective = (function () {
    function TKListViewFooterDirective(owner, template) {
        this.owner = owner;
        this.template = template;
    }
    TKListViewFooterDirective.prototype.ngOnInit = function () {
        this.owner.footerTemplate = this.template;
    };
    TKListViewFooterDirective = __decorate([
        core_1.Directive({
            selector: "[tkListViewFooter]"
        }),
        __param(0, core_1.Inject(RadListViewComponent)),
        __param(1, core_1.Inject(core_1.TemplateRef)),
        __metadata("design:paramtypes", [RadListViewComponent,
            core_1.TemplateRef])
    ], TKListViewFooterDirective);
    return TKListViewFooterDirective;
}());
exports.TKListViewFooterDirective = TKListViewFooterDirective;
var TKListViewItemSwipeDirective = (function () {
    function TKListViewItemSwipeDirective(owner, template) {
        this.owner = owner;
        this.template = template;
    }
    TKListViewItemSwipeDirective.prototype.ngOnInit = function () {
        this.owner.itemSwipeTemplate = this.template;
    };
    TKListViewItemSwipeDirective = __decorate([
        core_1.Directive({
            selector: "[tkListItemSwipeTemplate]"
        }),
        __param(0, core_1.Inject(RadListViewComponent)),
        __param(1, core_1.Inject(core_1.TemplateRef)),
        __metadata("design:paramtypes", [RadListViewComponent,
            core_1.TemplateRef])
    ], TKListViewItemSwipeDirective);
    return TKListViewItemSwipeDirective;
}());
exports.TKListViewItemSwipeDirective = TKListViewItemSwipeDirective;
var TKListViewItemDirective = (function () {
    function TKListViewItemDirective(owner, template) {
        this.owner = owner;
        this.template = template;
    }
    TKListViewItemDirective.prototype.ngOnInit = function () {
        this.owner.itemTemplate = this.template;
    };
    TKListViewItemDirective = __decorate([
        core_1.Directive({
            selector: "[tkListItemTemplate]"
        }),
        __param(0, core_1.Inject(RadListViewComponent)),
        __param(1, core_1.Inject(core_1.TemplateRef)),
        __metadata("design:paramtypes", [RadListViewComponent,
            core_1.TemplateRef])
    ], TKListViewItemDirective);
    return TKListViewItemDirective;
}());
exports.TKListViewItemDirective = TKListViewItemDirective;
var TKTemplateKeyDirective = (function () {
    function TKTemplateKeyDirective(templateRef, owner) {
        this.templateRef = templateRef;
        this.owner = owner;
    }
    Object.defineProperty(TKTemplateKeyDirective.prototype, "tkTemplateKey", {
        set: function (value) {
            if (this.owner && this.templateRef) {
                this.owner.registerTemplate(value, this.templateRef);
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], TKTemplateKeyDirective.prototype, "tkTemplateKey", null);
    TKTemplateKeyDirective = __decorate([
        core_1.Directive({
            selector: "[tkTemplateKey]"
        }),
        __param(1, core_1.Host()),
        __metadata("design:paramtypes", [core_1.TemplateRef,
            RadListViewComponent])
    ], TKTemplateKeyDirective);
    return TKTemplateKeyDirective;
}());
exports.TKTemplateKeyDirective = TKTemplateKeyDirective;
var TKListViewLoadOnDemandDirective = (function () {
    function TKListViewLoadOnDemandDirective(owner, template) {
        this.owner = owner;
        this.template = template;
    }
    TKListViewLoadOnDemandDirective.prototype.ngOnInit = function () {
        this.owner.loadOnDemandTemplate = this.template;
    };
    TKListViewLoadOnDemandDirective = __decorate([
        core_1.Directive({
            selector: "[tkListLoadOnDemandTemplate]"
        }),
        __param(0, core_1.Inject(RadListViewComponent)),
        __param(1, core_1.Inject(core_1.TemplateRef)),
        __metadata("design:paramtypes", [RadListViewComponent,
            core_1.TemplateRef])
    ], TKListViewLoadOnDemandDirective);
    return TKListViewLoadOnDemandDirective;
}());
exports.TKListViewLoadOnDemandDirective = TKListViewLoadOnDemandDirective;
var TKListViewLayoutDirective = (function () {
    function TKListViewLayoutDirective(owner, _elementRef) {
        this.owner = owner;
        this._elementRef = _elementRef;
    }
    TKListViewLayoutDirective.prototype.ngOnInit = function () {
        var layout = this._elementRef.nativeElement;
        this.owner.setLayout(layout);
    };
    TKListViewLayoutDirective = __decorate([
        core_1.Directive({
            selector: "[tkListViewLayout]"
        }),
        __param(0, core_1.Inject(RadListViewComponent)),
        __param(1, core_1.Inject(core_1.ElementRef)),
        __metadata("design:paramtypes", [RadListViewComponent,
            core_1.ElementRef])
    ], TKListViewLayoutDirective);
    return TKListViewLayoutDirective;
}());
exports.TKListViewLayoutDirective = TKListViewLayoutDirective;
function getItemViewRoot(viewRef, rootLocator) {
    if (rootLocator === void 0) { rootLocator = element_registry_1.getSingleViewRecursive; }
    return rootLocator(viewRef.rootNodes, 0);
}
exports.getItemViewRoot = getItemViewRoot;
exports.LISTVIEW_DIRECTIVES = [RadListViewComponent, TKListViewItemDirective, TKListViewItemSwipeDirective, TKListViewHeaderDirective, TKListViewFooterDirective, TKListViewLoadOnDemandDirective, TKListViewLayoutDirective, ListViewGridLayoutDirective, ListViewStaggeredLayoutDirective, ReorderHandleDirective, ListViewLinearLayoutDirective, TKTemplateKeyDirective];
element_registry_1.registerElement("RadListView", function () { return _1.RadListView; });
element_registry_1.registerElement("ListViewLinearLayout", function () { return _1.ListViewLinearLayout; });
element_registry_1.registerElement("ListViewGridLayout", function () { return _1.ListViewGridLayout; });
element_registry_1.registerElement("ListViewStaggeredLayout", function () { return _1.ListViewStaggeredLayout; });
element_registry_1.registerElement("ReorderHandle", function () { return _1.ReorderHandle; });
var NativeScriptUIListViewModule = (function () {
    function NativeScriptUIListViewModule() {
    }
    NativeScriptUIListViewModule = __decorate([
        core_1.NgModule({
            declarations: [exports.LISTVIEW_DIRECTIVES],
            exports: [exports.LISTVIEW_DIRECTIVES],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], NativeScriptUIListViewModule);
    return NativeScriptUIListViewModule;
}());
exports.NativeScriptUIListViewModule = NativeScriptUIListViewModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWktbGlzdHZpZXctZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVpLWxpc3R2aWV3LWRpcmVjdGl2ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0F5QnVCO0FBRXZCLDBFQUE2RztBQUM3RywwQkFBZ0w7QUFFaEwsc0RBQWtEO0FBR2xELDJFQUF5RTtBQUV6RTtJQUFxQyxtQ0FBVTtJQUMzQyx5QkFDVyxTQUFlLEVBQ2YsSUFBVSxFQUNWLEtBQWMsRUFDZCxJQUFjLEVBQ2QsR0FBYSxFQUNiLFFBQWlCO1FBTjVCLFlBUUksa0JBQU0sSUFBSSxDQUFDLFNBQ2Q7UUFSVSxlQUFTLEdBQVQsU0FBUyxDQUFNO1FBQ2YsVUFBSSxHQUFKLElBQUksQ0FBTTtRQUNWLFdBQUssR0FBTCxLQUFLLENBQVM7UUFDZCxVQUFJLEdBQUosSUFBSSxDQUFVO1FBQ2QsU0FBRyxHQUFILEdBQUcsQ0FBVTtRQUNiLGNBQVEsR0FBUixRQUFRLENBQVM7O0lBRzVCLENBQUM7SUFDTCxzQkFBQztBQUFELENBQUMsQUFYRCxDQUFxQyxpQkFBVSxHQVc5QztBQVhZLDBDQUFlO0FBZTVCLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQztBQVUxQjtJQWtCSSw4QkFDZ0MsV0FBdUIsRUFDbEIsZ0JBQWlDO1FBRnRFLGlCQWdFQztRQS9EK0IsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDbEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFpQjtRQWhCOUQsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFTakMsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFHUixrQkFBYSxHQUFzQixJQUFJLG1CQUFZLEVBQU8sQ0FBQztRQU14RSxJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUM7UUFFM0MsZ0ZBQWdGO1FBQ2hGLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHLElBQUksdUJBQW9CLEVBQUUsQ0FBQztRQUUzRCxJQUFJLFNBQVMsR0FB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T0FBQSxjQUFXLEVBQVgsQ0FBVyxDQUFDLENBQUM7QUFDbEQsa0NBQWUsQ0FBQyxzQkFBc0IsRUFBRSxjQUFNLE9BQUssdUJBQW9CLEVBQXpCLENBQXlCLENBQUMsQ0FBQztBQUN6RSxrQ0FBZSxDQUFDLG9CQUFvQixFQUFFLGNBQU0sT0FBSyxxQkFBa0IsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDO0FBQ3JFLGtDQUFlLENBQUMseUJBQXlCLEVBQUUsY0FBTSxPQUFLLDBCQUF1QixFQUE1QixDQUE0QixDQUFDLENBQUM7QUFDL0Usa0NBQWUsQ0FBQyxlQUFlLEVBQUUsY0FBTSxPQUFBLGdCQUFhLEVBQWIsQ0FBYSxDQUFDLENBQUM7QUFTdEQ7SUFBQTtJQUNBLENBQUM7SUFEWSw0QkFBNEI7UUFQeEMsZUFBUSxDQUFDO1lBQ04sWUFBWSxFQUFFLENBQUMsMkJBQW1CLENBQUM7WUFDbkMsT0FBTyxFQUFFLENBQUMsMkJBQW1CLENBQUM7WUFDOUIsT0FBTyxFQUFFO2dCQUNMLHVCQUFnQjthQUNuQjtTQUNKLENBQUM7T0FDVyw0QkFBNEIsQ0FDeEM7SUFBRCxtQ0FBQztDQUFBLEFBREQsSUFDQztBQURZLG9FQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIERvQ2hlY2ssXG4gICAgSW5wdXQsXG4gICAgRWxlbWVudFJlZixcbiAgICBJbmplY3QsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgRW1iZWRkZWRWaWV3UmVmLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBJdGVyYWJsZURpZmZlcnMsXG4gICAgSXRlcmFibGVEaWZmZXIsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgVmlld0NvbnRhaW5lclJlZixcbiAgICBEaXJlY3RpdmUsXG4gICAgT25Jbml0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBPdXRwdXQsXG4gICAgSG9zdCxcbiAgICBDb250ZW50Q2hpbGQsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBOZ01vZHVsZSxcbiAgICBWaWV3Q2hpbGQsXG4gICAgTk9fRVJST1JTX1NDSEVNQSxcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICDJtWlzTGlzdExpa2VJdGVyYWJsZSBhcyBpc0xpc3RMaWtlSXRlcmFibGVcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IHJlZ2lzdGVyRWxlbWVudCwgQ29tbWVudE5vZGUsIGdldFNpbmdsZVZpZXdSZWN1cnNpdmUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeVwiO1xuaW1wb3J0IHsgUmFkTGlzdFZpZXcsIExpc3RWaWV3TGluZWFyTGF5b3V0LCBMaXN0Vmlld0xheW91dEJhc2UsIExpc3RWaWV3Vmlld1R5cGVzLCBMaXN0Vmlld1N0YWdnZXJlZExheW91dCwgTGlzdFZpZXdHcmlkTGF5b3V0LCBSZW9yZGVySGFuZGxlLCBMaXN0Vmlld0V2ZW50RGF0YSB9IGZyb20gJy4vLi4vJztcbmltcG9ydCB7IFZpZXcsIEtleWVkVGVtcGxhdGUgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL2NvcmUvdmlldyc7XG5pbXBvcnQgeyBpc0lPUyB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3BsYXRmb3JtXCI7XG5pbXBvcnQgeyBMYXlvdXRCYXNlIH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy91aS9sYXlvdXRzL2xheW91dC1iYXNlJztcbmltcG9ydCB7IE9ic2VydmFibGUgYXMgUnhPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlQXJyYXkgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL2RhdGEvb2JzZXJ2YWJsZS1hcnJheSc7XG5cbmV4cG9ydCBjbGFzcyBMaXN0SXRlbUNvbnRleHQgZXh0ZW5kcyBFbGVtZW50UmVmIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljICRpbXBsaWNpdD86IGFueSxcbiAgICAgICAgcHVibGljIGl0ZW0/OiBhbnksXG4gICAgICAgIHB1YmxpYyBpbmRleD86IG51bWJlcixcbiAgICAgICAgcHVibGljIGV2ZW4/OiBib29sZWFuLFxuICAgICAgICBwdWJsaWMgb2RkPzogYm9vbGVhbixcbiAgICAgICAgcHVibGljIGNhdGVnb3J5Pzogc3RyaW5nLFxuICAgICkge1xuICAgICAgICBzdXBlcihpdGVtKTtcbiAgICB9XG59XG5cbmV4cG9ydCB0eXBlIFJvb3RMb2NhdG9yID0gKG5vZGVzOiBBcnJheTxhbnk+LCBuZXN0TGV2ZWw6IG51bWJlcikgPT4gVmlldztcblxuY29uc3QgTkdfVklFVyA9IFwibmdfdmlld1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJSYWRMaXN0Vmlld1wiLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxEZXRhY2hlZENvbnRhaW5lcj5cbiAgICAgICAgICAgIDxQbGFjZWhvbGRlciAjbG9hZGVyPjwvUGxhY2Vob2xkZXI+XG4gICAgICAgIDwvRGV0YWNoZWRDb250YWluZXI+YCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBSYWRMaXN0Vmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIERvQ2hlY2sge1xuICAgIHByaXZhdGUgX2xpc3RWaWV3OiBSYWRMaXN0VmlldztcbiAgICBwcml2YXRlIF9pdGVtczogYW55O1xuICAgIHByaXZhdGUgX2RpZmZlcjogSXRlcmFibGVEaWZmZXI8YW55PjtcbiAgICBwcml2YXRlIF9pdGVtUmVvcmRlcmluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBfaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPEVsZW1lbnRSZWY+O1xuICAgIHByaXZhdGUgX2Zvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxFbGVtZW50UmVmPjtcbiAgICBwcml2YXRlIF9pdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPEVsZW1lbnRSZWY+O1xuICAgIHByaXZhdGUgX2l0ZW1Td2lwZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxFbGVtZW50UmVmPjtcbiAgICBwcml2YXRlIF9sb2FkT25EZW1hbmRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8RWxlbWVudFJlZj47XG4gICAgcHJpdmF0ZSBfdGVtcGxhdGVNYXA6IE1hcDxzdHJpbmcsIEtleWVkVGVtcGxhdGU+O1xuXG4gICAgcHJpdmF0ZSBkb0NoZWNrRGVsYXkgPSA1OyAgIFxuICAgIEBWaWV3Q2hpbGQoXCJsb2FkZXJcIiwgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIGxvYWRlcjogVmlld0NvbnRhaW5lclJlZjtcblxuICAgIEBPdXRwdXQoKSBwdWJsaWMgc2V0dXBJdGVtVmlldzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBASW5qZWN0KEVsZW1lbnRSZWYpIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgIEBJbmplY3QoSXRlcmFibGVEaWZmZXJzKSBwcml2YXRlIF9pdGVyYWJsZURpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICApIHtcbiAgICAgICAgdGhpcy5fbGlzdFZpZXcgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAgIC8vIFdlIHNob3VsZCBjb25zaWRlciBzZXR0aW5nIHRoaXMgZGVmYXVsdCB2YWx1ZSBpbiB0aGUgUmFkTGlzdFZpZXcgY29uc3RydWN0b3IuXG4gICAgICAgIHRoaXMuX2xpc3RWaWV3Lmxpc3RWaWV3TGF5b3V0ID0gbmV3IExpc3RWaWV3TGluZWFyTGF5b3V0KCk7XG5cbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5fbGlzdFZpZXcuaXRlbVZpZXdMb2FkZXIgPSAodmlld1R5cGUpOiBWaWV3ID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAodmlld1R5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIExpc3RWaWV3Vmlld1R5cGVzLkl0ZW1WaWV3OlxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9pdGVtVGVtcGxhdGUgJiYgdGhpcy5sb2FkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYXRpdmVJdGVtID0gdGhpcy5sb2FkZXIuY3JlYXRlRW1iZWRkZWRWaWV3KGNvbXBvbmVudC5faXRlbVRlbXBsYXRlLCBuZXcgTGlzdEl0ZW1Db250ZXh0KCksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGVkVmlldyA9IGdldEl0ZW1WaWV3Um9vdChuYXRpdmVJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVkVmlld1tOR19WSUVXXSA9IG5hdGl2ZUl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZWRWaWV3O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgTGlzdFZpZXdWaWV3VHlwZXMuSXRlbVN3aXBlVmlldzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5faXRlbVN3aXBlVGVtcGxhdGUgJiYgdGhpcy5sb2FkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYXRpdmVJdGVtID0gdGhpcy5sb2FkZXIuY3JlYXRlRW1iZWRkZWRWaWV3KGNvbXBvbmVudC5faXRlbVN3aXBlVGVtcGxhdGUsIG5ldyBMaXN0SXRlbUNvbnRleHQoKSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZWRWaWV3ID0gZ2V0SXRlbVZpZXdSb290KG5hdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZWRWaWV3W05HX1ZJRVddID0gbmF0aXZlSXRlbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlZFZpZXc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBMaXN0Vmlld1ZpZXdUeXBlcy5Mb2FkT25EZW1hbmRWaWV3OlxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9sb2FkT25EZW1hbmRUZW1wbGF0ZSAmJiB0aGlzLmxvYWRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZpZXdSZWYgPSB0aGlzLmxvYWRlci5jcmVhdGVFbWJlZGRlZFZpZXcoY29tcG9uZW50Ll9sb2FkT25EZW1hbmRUZW1wbGF0ZSwgbmV3IExpc3RJdGVtQ29udGV4dCgpLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0ZWN0Q2hhbmdlc09uQ2hpbGQodmlld1JlZiwgLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5hdGl2ZVZpZXcgPSBnZXRJdGVtVmlld1Jvb3Qodmlld1JlZik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYXRpdmVWaWV3W05HX1ZJRVddID0gdmlld1JlZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuYXRpdmVWaWV3O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgTGlzdFZpZXdWaWV3VHlwZXMuSGVhZGVyVmlldzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RWaWV3Lmdyb3VwaW5nRnVuY3Rpb24gJiYgY29tcG9uZW50Ll9oZWFkZXJUZW1wbGF0ZSAmJiBpc0lPUykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJXYXJuaW5nOiBTZXR0aW5nIGN1c3RvbSAndGtMaXN0Vmlld0hlYWRlcicgd2l0aCAnZ3JvdXBpbmdGdW5jdGlvbicgZW5hYmxlZCBpcyBub3Qgc3VwcG9ydGVkIG9uIGlPUy5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5faGVhZGVyVGVtcGxhdGUgJiYgdGhpcy5sb2FkZXIgJiYgIXRoaXMuX2xpc3RWaWV3Lmdyb3VwaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2aWV3UmVmID0gdGhpcy5sb2FkZXIuY3JlYXRlRW1iZWRkZWRWaWV3KGNvbXBvbmVudC5faGVhZGVyVGVtcGxhdGUsIG5ldyBMaXN0SXRlbUNvbnRleHQoKSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGVjdENoYW5nZXNPbkNoaWxkKHZpZXdSZWYsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYXRpdmVWaWV3ID0gZ2V0SXRlbVZpZXdSb290KHZpZXdSZWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmF0aXZlVmlld1tOR19WSUVXXSA9IHZpZXdSZWY7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmF0aXZlVmlldztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIExpc3RWaWV3Vmlld1R5cGVzLkZvb3RlclZpZXc6XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuX2Zvb3RlclRlbXBsYXRlICYmIHRoaXMubG9hZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmlld1JlZiA9IHRoaXMubG9hZGVyLmNyZWF0ZUVtYmVkZGVkVmlldyhjb21wb25lbnQuX2Zvb3RlclRlbXBsYXRlLCBuZXcgTGlzdEl0ZW1Db250ZXh0KCksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRlY3RDaGFuZ2VzT25DaGlsZCh2aWV3UmVmLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmF0aXZlVmlldyA9IGdldEl0ZW1WaWV3Um9vdCh2aWV3UmVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdGl2ZVZpZXdbTkdfVklFV10gPSB2aWV3UmVmO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZVZpZXc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnNldEl0ZW1UZW1wbGF0ZXMoKTtcbiAgICB9XG5cbiAgICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKSBpdGVtVGVtcGxhdGVRdWVyeTogVGVtcGxhdGVSZWY8TGlzdEl0ZW1Db250ZXh0PjtcblxuICAgIHB1YmxpYyBnZXQgbmF0aXZlRWxlbWVudCgpOiBSYWRMaXN0VmlldyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0VmlldztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGxpc3RWaWV3KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdFZpZXc7XG4gICAgfVxuXG4gICAgc2V0IGxvYWRPbkRlbWFuZFRlbXBsYXRlKHZhbHVlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG4gICAgICAgIHRoaXMuX2xvYWRPbkRlbWFuZFRlbXBsYXRlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX2xpc3RWaWV3LnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBzZXQgaGVhZGVyVGVtcGxhdGUodmFsdWU6IFRlbXBsYXRlUmVmPEVsZW1lbnRSZWY+KSB7XG4gICAgICAgIHRoaXMuX2hlYWRlclRlbXBsYXRlID0gdmFsdWU7XG4gICAgICAgIGlmICh0aGlzLl9saXN0Vmlldy5pb3MpIHtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RWaWV3WydfdXBkYXRlSGVhZGVyRm9vdGVyQXZhaWxhYmlsaXR5J10oKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9saXN0Vmlldy5hbmRyb2lkKSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0Vmlld1snX3VwZGF0ZUhlYWRlckZvb3RlciddKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgZm9vdGVyVGVtcGxhdGUodmFsdWU6IFRlbXBsYXRlUmVmPEVsZW1lbnRSZWY+KSB7XG4gICAgICAgIHRoaXMuX2Zvb3RlclRlbXBsYXRlID0gdmFsdWU7XG4gICAgICAgIGlmICh0aGlzLl9saXN0Vmlldy5pb3MpIHtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RWaWV3WydfdXBkYXRlSGVhZGVyRm9vdGVyQXZhaWxhYmlsaXR5J10oKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9saXN0Vmlldy5hbmRyb2lkKSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0Vmlld1snX3VwZGF0ZUhlYWRlckZvb3RlciddKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgaXRlbVRlbXBsYXRlKHZhbHVlOiBUZW1wbGF0ZVJlZjxFbGVtZW50UmVmPikge1xuICAgICAgICB0aGlzLl9pdGVtVGVtcGxhdGUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fbGlzdFZpZXcucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHNldCBpdGVtU3dpcGVUZW1wbGF0ZSh2YWx1ZTogVGVtcGxhdGVSZWY8RWxlbWVudFJlZj4pIHtcbiAgICAgICAgdGhpcy5faXRlbVN3aXBlVGVtcGxhdGUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fbGlzdFZpZXcucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIHNldCBpdGVtcyh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuX2l0ZW1zID0gdmFsdWU7XG5cbiAgICAgICAgdmFyIG5lZWREaWZmZXIgPSB0cnVlO1xuXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9ic2VydmFibGVBcnJheSkge1xuICAgICAgICAgICAgbmVlZERpZmZlciA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5lZWREaWZmZXIgJiYgIXRoaXMuX2RpZmZlciAmJiBpc0xpc3RMaWtlSXRlcmFibGUodmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaWZmZXIgPSB0aGlzLl9pdGVyYWJsZURpZmZlcnMuZmluZCh0aGlzLl9pdGVtcykuY3JlYXRlKChpbmRleCwgaXRlbSkgPT4gaXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9saXN0Vmlldy5pdGVtcyA9IHRoaXMuX2l0ZW1zO1xuICAgIH1cblxuICAgIG5nRG9DaGVjaygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RpZmZlcikge1xuICAgICAgICAgICAgdmFyIGNoYW5nZXMgPSB0aGlzLl9kaWZmZXIuZGlmZih0aGlzLl9pdGVtcyk7XG4gICAgICAgICAgICBpZiAoY2hhbmdlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RWaWV3LnJlZnJlc2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoXCJpdGVtTG9hZGluZ1wiLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbkl0ZW1Mb2FkaW5nKGFyZ3M6IExpc3RWaWV3RXZlbnREYXRhKSB7XG4gICAgICAgIGxldCBpbmRleCA9IGFyZ3MuaW5kZXg7XG4gICAgICAgIGxldCBjdXJyZW50SXRlbSA9IGFyZ3Mudmlldy5iaW5kaW5nQ29udGV4dDtcbiAgICAgICAgdmFyIG5nVmlldyA9IGFyZ3Mudmlld1tOR19WSUVXXTtcbiAgICAgICAgaWYgKG5nVmlldykge1xuICAgICAgICAgICAgdGhpcy5zZXR1cFZpZXdSZWYobmdWaWV3LCBjdXJyZW50SXRlbSwgaW5kZXgpO1xuICAgICAgICAgICAgdGhpcy5kZXRlY3RDaGFuZ2VzT25DaGlsZChuZ1ZpZXcsIGluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzZXR1cFZpZXdSZWYodmlld1JlZjogRW1iZWRkZWRWaWV3UmVmPGFueT4sIGRhdGE6IGFueSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gdmlld1JlZi5jb250ZXh0O1xuICAgICAgICBjb250ZXh0LiRpbXBsaWNpdCA9IGRhdGE7XG4gICAgICAgIGNvbnRleHQuaXRlbSA9IGRhdGE7XG4gICAgICAgIGNvbnRleHQuY2F0ZWdvcnkgPSBkYXRhID8gZGF0YS5jYXRlZ29yeSA6IFwiXCI7XG4gICAgICAgIGNvbnRleHQuaW5kZXggPSBpbmRleDtcbiAgICAgICAgY29udGV4dC5ldmVuID0gKGluZGV4ICUgMiA9PSAwKTtcbiAgICAgICAgY29udGV4dC5vZGQgPSAhY29udGV4dC5ldmVuO1xuXG4gICAgICAgIHRoaXMuc2V0dXBJdGVtVmlldy5uZXh0KHsgdmlldzogdmlld1JlZiwgZGF0YTogZGF0YSwgaW5kZXg6IGluZGV4LCBjb250ZXh0OiBjb250ZXh0IH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRMYXlvdXQobGF5b3V0OiBMaXN0Vmlld0xheW91dEJhc2UpIHtcbiAgICAgICAgdGhpcy5fbGlzdFZpZXcubGlzdFZpZXdMYXlvdXQgPSBsYXlvdXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXRlY3RDaGFuZ2VzT25DaGlsZCh2aWV3UmVmOiBFbWJlZGRlZFZpZXdSZWY8TGlzdEl0ZW1Db250ZXh0PiwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICAvLyBNYW51YWxseSBkZXRlY3QgY2hhbmdlcyBpbiBjaGlsZCB2aWV3IHJlZlxuICAgICAgICAvLyBUT0RPOiBJcyB0aGVyZSBhIGJldHRlciB3YXkgb2YgZ2V0dGluZyB2aWV3UmVmJ3MgY2hhbmdlIGRldGVjdG9yXG4gICAgICAgIGNvbnN0IGNoaWxkQ2hhbmdlRGV0ZWN0b3IgPSA8Q2hhbmdlRGV0ZWN0b3JSZWY+KDxhbnk+dmlld1JlZik7XG5cbiAgICAgICAgY2hpbGRDaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgY2hpbGRDaGFuZ2VEZXRlY3Rvci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRJdGVtVGVtcGxhdGVzKCkge1xuICAgICAgICAvLyBUaGUgaXRlbVRlbXBsYXRlUXVlcnkgbWF5IGJlIGNoYW5nZWQgYWZ0ZXIgbGlzdCBpdGVtcyBhcmUgYWRkZWQgdGhhdCBjb250YWluIDx0ZW1wbGF0ZT4gaW5zaWRlLFxuICAgICAgICAvLyBzbyBjYWNoZSBhbmQgdXNlIG9ubHkgdGhlIG9yaWdpbmFsIHRlbXBsYXRlIHRvIGF2b2lkIGVycm9ycy5cbiAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSB0aGlzLml0ZW1UZW1wbGF0ZVF1ZXJ5O1xuXG4gICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZU1hcCkge1xuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGVzOiBLZXllZFRlbXBsYXRlW10gPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlTWFwLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5saXN0Vmlldy5pdGVtVGVtcGxhdGVzID0gdGVtcGxhdGVzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyVGVtcGxhdGUoa2V5OiBzdHJpbmcsIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxMaXN0SXRlbUNvbnRleHQ+KSB7XG4gICAgICAgIGlmICghdGhpcy5fdGVtcGxhdGVNYXApIHtcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlTWFwID0gbmV3IE1hcDxzdHJpbmcsIEtleWVkVGVtcGxhdGU+KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBrZXllZFRlbXBsYXRlID0ge1xuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgY3JlYXRlVmlldzogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZpZXdSZWYgPSB0aGlzLmxvYWRlci5jcmVhdGVFbWJlZGRlZFZpZXcodGVtcGxhdGUsIG5ldyBMaXN0SXRlbUNvbnRleHQoKSwgMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0VmlldyA9IGdldEl0ZW1WaWV3Um9vdCh2aWV3UmVmKTtcbiAgICAgICAgICAgICAgICByZXN1bHRWaWV3W05HX1ZJRVddID0gdmlld1JlZjtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRWaWV3O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX3RlbXBsYXRlTWFwLnNldChrZXksIGtleWVkVGVtcGxhdGUpO1xuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6IFwiTGlzdFZpZXdMaW5lYXJMYXlvdXRcIlxufSlcbmV4cG9ydCBjbGFzcyBMaXN0Vmlld0xpbmVhckxheW91dERpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7IH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6IFwiTGlzdFZpZXdHcmlkTGF5b3V0XCJcbn0pXG5leHBvcnQgY2xhc3MgTGlzdFZpZXdHcmlkTGF5b3V0RGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCJMaXN0Vmlld1N0YWdnZXJlZExheW91dFwiXG59KVxuZXhwb3J0IGNsYXNzIExpc3RWaWV3U3RhZ2dlcmVkTGF5b3V0RGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCJSZW9yZGVySGFuZGxlXCJcbn0pXG5leHBvcnQgY2xhc3MgUmVvcmRlckhhbmRsZURpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7IH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6IFwiW3RrTGlzdFZpZXdIZWFkZXJdXCJcbn0pXG5leHBvcnQgY2xhc3MgVEtMaXN0Vmlld0hlYWRlckRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgQEluamVjdChSYWRMaXN0Vmlld0NvbXBvbmVudCkgcHJpdmF0ZSBvd25lcjogUmFkTGlzdFZpZXdDb21wb25lbnQsXG4gICAgICAgIEBJbmplY3QoVGVtcGxhdGVSZWYpIHByaXZhdGUgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4pIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLm93bmVyLmhlYWRlclRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiBcIlt0a0xpc3RWaWV3Rm9vdGVyXVwiXG59KVxuZXhwb3J0IGNsYXNzIFRLTGlzdFZpZXdGb290ZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBJbmplY3QoUmFkTGlzdFZpZXdDb21wb25lbnQpIHByaXZhdGUgb3duZXI6IFJhZExpc3RWaWV3Q29tcG9uZW50LFxuICAgICAgICBASW5qZWN0KFRlbXBsYXRlUmVmKSBwcml2YXRlIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5vd25lci5mb290ZXJUZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gICAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCJbdGtMaXN0SXRlbVN3aXBlVGVtcGxhdGVdXCJcbn0pXG5leHBvcnQgY2xhc3MgVEtMaXN0Vmlld0l0ZW1Td2lwZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgQEluamVjdChSYWRMaXN0Vmlld0NvbXBvbmVudCkgcHJpdmF0ZSBvd25lcjogUmFkTGlzdFZpZXdDb21wb25lbnQsXG4gICAgICAgIEBJbmplY3QoVGVtcGxhdGVSZWYpIHByaXZhdGUgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4pIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLm93bmVyLml0ZW1Td2lwZVRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiBcIlt0a0xpc3RJdGVtVGVtcGxhdGVdXCJcbn0pXG5leHBvcnQgY2xhc3MgVEtMaXN0Vmlld0l0ZW1EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBJbmplY3QoUmFkTGlzdFZpZXdDb21wb25lbnQpIHByaXZhdGUgb3duZXI6IFJhZExpc3RWaWV3Q29tcG9uZW50LFxuICAgICAgICBASW5qZWN0KFRlbXBsYXRlUmVmKSBwcml2YXRlIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5vd25lci5pdGVtVGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgIH1cbn1cblxuQERpcmVjdGl2ZShcbiAgICB7XG4gICAgICAgIHNlbGVjdG9yOiBcIlt0a1RlbXBsYXRlS2V5XVwiXG4gICAgfSlcbmV4cG9ydCBjbGFzcyBUS1RlbXBsYXRlS2V5RGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PixcbiAgICAgICAgQEhvc3QoKSBwcml2YXRlIG93bmVyOiBSYWRMaXN0Vmlld0NvbXBvbmVudCkge1xuXG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICBzZXQgdGtUZW1wbGF0ZUtleSh2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLm93bmVyICYmIHRoaXMudGVtcGxhdGVSZWYpIHtcbiAgICAgICAgICAgIHRoaXMub3duZXIucmVnaXN0ZXJUZW1wbGF0ZSh2YWx1ZSwgdGhpcy50ZW1wbGF0ZVJlZik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiBcIlt0a0xpc3RMb2FkT25EZW1hbmRUZW1wbGF0ZV1cIlxufSlcbmV4cG9ydCBjbGFzcyBUS0xpc3RWaWV3TG9hZE9uRGVtYW5kRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBASW5qZWN0KFJhZExpc3RWaWV3Q29tcG9uZW50KSBwcml2YXRlIG93bmVyOiBSYWRMaXN0Vmlld0NvbXBvbmVudCxcbiAgICAgICAgQEluamVjdChUZW1wbGF0ZVJlZikgcHJpdmF0ZSB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55Pikge1xuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMub3duZXIubG9hZE9uRGVtYW5kVGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6IFwiW3RrTGlzdFZpZXdMYXlvdXRdXCJcbn0pXG5leHBvcnQgY2xhc3MgVEtMaXN0Vmlld0xheW91dERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBJbmplY3QoUmFkTGlzdFZpZXdDb21wb25lbnQpIHByaXZhdGUgb3duZXI6IFJhZExpc3RWaWV3Q29tcG9uZW50LFxuICAgICAgICBASW5qZWN0KEVsZW1lbnRSZWYpIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdmFyIGxheW91dCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgdGhpcy5vd25lci5zZXRMYXlvdXQobGF5b3V0KTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJdGVtVmlld1Jvb3Qodmlld1JlZjogRW1iZWRkZWRWaWV3UmVmPGFueT4sIHJvb3RMb2NhdG9yOiBSb290TG9jYXRvciA9IGdldFNpbmdsZVZpZXdSZWN1cnNpdmUpOiBWaWV3IHtcbiAgICByZXR1cm4gcm9vdExvY2F0b3Iodmlld1JlZi5yb290Tm9kZXMsIDApO1xufVxuXG5leHBvcnQgY29uc3QgTElTVFZJRVdfRElSRUNUSVZFUyA9IFtSYWRMaXN0Vmlld0NvbXBvbmVudCwgVEtMaXN0Vmlld0l0ZW1EaXJlY3RpdmUsIFRLTGlzdFZpZXdJdGVtU3dpcGVEaXJlY3RpdmUsIFRLTGlzdFZpZXdIZWFkZXJEaXJlY3RpdmUsIFRLTGlzdFZpZXdGb290ZXJEaXJlY3RpdmUsIFRLTGlzdFZpZXdMb2FkT25EZW1hbmREaXJlY3RpdmUsIFRLTGlzdFZpZXdMYXlvdXREaXJlY3RpdmUsIExpc3RWaWV3R3JpZExheW91dERpcmVjdGl2ZSwgTGlzdFZpZXdTdGFnZ2VyZWRMYXlvdXREaXJlY3RpdmUsIFJlb3JkZXJIYW5kbGVEaXJlY3RpdmUsIExpc3RWaWV3TGluZWFyTGF5b3V0RGlyZWN0aXZlLCBUS1RlbXBsYXRlS2V5RGlyZWN0aXZlXTtcbnJlZ2lzdGVyRWxlbWVudChcIlJhZExpc3RWaWV3XCIsICgpID0+IFJhZExpc3RWaWV3KTtcbnJlZ2lzdGVyRWxlbWVudChcIkxpc3RWaWV3TGluZWFyTGF5b3V0XCIsICgpID0+IDxhbnk+TGlzdFZpZXdMaW5lYXJMYXlvdXQpO1xucmVnaXN0ZXJFbGVtZW50KFwiTGlzdFZpZXdHcmlkTGF5b3V0XCIsICgpID0+IDxhbnk+TGlzdFZpZXdHcmlkTGF5b3V0KTtcbnJlZ2lzdGVyRWxlbWVudChcIkxpc3RWaWV3U3RhZ2dlcmVkTGF5b3V0XCIsICgpID0+IDxhbnk+TGlzdFZpZXdTdGFnZ2VyZWRMYXlvdXQpO1xucmVnaXN0ZXJFbGVtZW50KFwiUmVvcmRlckhhbmRsZVwiLCAoKSA9PiBSZW9yZGVySGFuZGxlKTtcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtMSVNUVklFV19ESVJFQ1RJVkVTXSxcbiAgICBleHBvcnRzOiBbTElTVFZJRVdfRElSRUNUSVZFU10sXG4gICAgc2NoZW1hczogW1xuICAgICAgICBOT19FUlJPUlNfU0NIRU1BXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBOYXRpdmVTY3JpcHRVSUxpc3RWaWV3TW9kdWxlIHtcbn1cbiJdfQ==