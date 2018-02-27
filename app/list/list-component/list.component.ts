import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { SnackBar } from 'nativescript-snackbar';
import { DrawerTransitionBase, SlideInOnTopTransition, RadSideDrawer } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";
import { RadListViewComponent } from "nativescript-pro-ui/listview/angular";
import { TextField } from "ui/text-field";
import { View } from "tns-core-modules/ui/core/view";
import { layout } from "tns-core-modules/utils/utils";
import { ObservableArray } from "tns-core-modules/data/observable-array";
// import * as Application from "tns-core-modules/application";
import { Subscription } from 'rxjs/Subscription';

import * as ApplicationSettings from 'application-settings';
import * as firebase from 'nativescript-plugin-firebase';
import * as firebaseWebApi from 'nativescript-plugin-firebase/app';
import * as moment from 'moment';

import { HttpService } from '../../http.service';
import { AppDataService } from "../../shared/appdata.service";
import { ListService } from '../list.service';
import { ListsService } from '../lists.service';

import { DataItem } from '../../classes/dataitem.class';
import { List } from '../../classes/list.class';
import { ListViewEventData } from 'nativescript-pro-ui/listview';


var posts = require('../posts.json');


@Component({
    moduleId: module.id,
    selector: 'ns-list',
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.css']
})
export class ListComponent implements OnInit {

    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
    @ViewChild("groceryTextField") groceryTextField: ElementRef;
    @ViewChild("myListView") listViewComponent: RadListViewComponent;

    private leftItem: View;
    private rightItem: View;
    private mainView: View;
    private animationApplied = false;
    private _sideDrawerTransition: DrawerTransitionBase;
    private _dataItems: ObservableArray<DataItem>;
    public _lists: Array<List>;
    private listsSubscription: Subscription;
    private _numberOfAddedItems;
    listDescription: string = '';
    isLoading: boolean = false;
    rand: number = 0;
    

    constructor(private router: RouterExtensions, 
                private listService: ListService,
                private listsService: ListsService,
                private appData: AppDataService){
        this.getLists();
    }

    ngOnInit(): void {
        if(!ApplicationSettings.getBoolean("authenticated", false)) {
            this.router.navigate(["/login"], { clearHistory: true });
        }

        this.listsSubscription = this.listsService.getListsAsObservable()
        .subscribe( lists => {
            if (Array.isArray(lists)) {
                lists = this.sortLists(lists);
                console.log("RECEIVED LISTS AT LIST COMP:::");
                console.dir(lists);
                this._lists = JSON.parse(JSON.stringify(lists));
                this.rand = Math.random();
                this._lists = this._lists.slice();
            }
        });

        this._sideDrawerTransition = new SlideInOnTopTransition();
        this._dataItems = new ObservableArray(this.listService.getDataItems());
    }


    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    get dataItems(): ObservableArray<DataItem> {
        return this._dataItems;
    }

    get lists(): Array<List> {
        return this._lists;
    }

    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }

    goToList(listkey: string) {
        this.appData.setActiveList(listkey);
        this.router.navigate(["/list-item"]);
    }

    public onPullToRefreshInitiated(args: ListViewEventData) {
        var listView = args.object;
        this.getLists();
        listView.notifyPullToRefreshFinished();
    }

    addList(target: string) {
        console.log("textfield input:", this.listDescription);
        let textField = <TextField>this.groceryTextField.nativeElement; 

        if (this.listDescription.trim() === '') {
            // if the user clicked the add button and the textfield is empty,
            // focus the textfield and return
            (new SnackBar()).simple("To create a new list, first enter a description");
            if (target === "button") {
                textField.focus();
            }
            return;
        }
        // Dismiss the keyboard
        textField.dismissSoftInput();
        this.showActivityIndicator();
        
        const list = {
            creatorUID : ApplicationSettings.getString('uid'),
            dateCreated: moment().format("YYYY-MM-DD HH:mm:ss"),
            dateModified: moment().format("YYYY-MM-DD HH:mm:ss"),
            description: this.listDescription
        }

        this._lists.unshift(list);

        this.listsService.createNewList(list)
        .then((result) => {
            console.log("saved!");
            console.dir(result);
            this.listDescription = '';
            this.hideActivityIndicator();
            this.getLists();
        }).catch( err => {
            this.hideActivityIndicator();
            (new SnackBar()).simple("List couldn't be created!");
        });
    }

    getLists() {
        this.listsService.getUserLists(ApplicationSettings.getString('uid'));
    }

    check() {
        console.log(ApplicationSettings.getString('uid'));
    }

    sortLists(list: Array<List>) {
        list.sort( (a, b) => {
            if (a['dateModified'] > b['dateModified']) {
                return -1;
            } else if (a['dateModified'] < b['dateModified']) {
                return 1;
            } else {
                return 0;
            }
        });
        return list;
    }

    private showActivityIndicator() {
        this.isLoading = true;
    }
    private hideActivityIndicator() {
        this.isLoading = false;
    }
    public onCellSwiping(args: ListViewEventData) {
        var swipeLimits = args.data.swipeLimits;
        var swipeView = args['swipeView'];
        this.mainView = args['mainView'];
        this.leftItem = swipeView.getViewById('left-stack');
        this.rightItem = swipeView.getViewById('right-stack');

        if (args.data.x > 0) {
            var leftDimensions = View.measureChild(
                <View>this.leftItem.parent,
                this.leftItem,
                layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
                layout.makeMeasureSpec(this.mainView.getMeasuredHeight(), layout.EXACTLY));
            View.layoutChild(<View>this.leftItem.parent, this.leftItem, 0, 0, leftDimensions.measuredWidth, leftDimensions.measuredHeight);
            this.hideOtherSwipeTemplateView("left");
        } else {
            var rightDimensions = View.measureChild(
                <View>this.rightItem.parent,
                this.rightItem,
                layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
                layout.makeMeasureSpec(this.mainView.getMeasuredHeight(), layout.EXACTLY));

            View.layoutChild(<View>this.rightItem.parent, this.rightItem, this.mainView.getMeasuredWidth() - rightDimensions.measuredWidth, 0, this.mainView.getMeasuredWidth(), rightDimensions.measuredHeight);
            this.hideOtherSwipeTemplateView("right");
        }
    }

    private hideOtherSwipeTemplateView(currentSwipeView: string) {
        switch (currentSwipeView) {
            case "left":
                if (this.rightItem.getActualSize().width != 0) {
                    View.layoutChild(<View>this.rightItem.parent, this.rightItem, this.mainView.getMeasuredWidth(), 0, this.mainView.getMeasuredWidth(), 0);
                }
                break;
            case "right":
                if (this.leftItem.getActualSize().width != 0) {
                    View.layoutChild(<View>this.leftItem.parent, this.leftItem, 0, 0, 0, 0);
                }
                break;
            default:
                break;
        }
    }

    public onSwipeCellStarted(args: ListViewEventData) {
        var swipeLimits = args.data.swipeLimits;
        swipeLimits.threshold = args['mainView'].getMeasuredWidth() * 0.2; // 20% of whole width
        swipeLimits.left = swipeLimits.right = args['mainView'].getMeasuredWidth() * 0.65 // 65% of whole width
    }
    // << angular-listview-swipe-action-multiple-limits

    public onSwipeCellFinished(args: ListViewEventData) {
        if (args.data.x > 200) {
            console.log("Perform left action");
        } else if (args.data.x < -200) {
            console.log("Perform right action");
        }
        this.animationApplied = false;
    }

    public onLeftSwipeClick(args: ListViewEventData) {
        this.handleSwipeTapEvent(args);
        this.listViewComponent.listView.notifySwipeToExecuteFinished();
    }

    public onRightSwipeClick(args) {
        this.handleSwipeTapEvent(args);
        this.listViewComponent.listView.notifySwipeToExecuteFinished();
    }

    private handleSwipeTapEvent(args: ListViewEventData) {
        const clickedIndex = this.listViewComponent.listView.items.indexOf(args.object.bindingContext);
        if (args.object.id === 'btnDelete') {
            this.deleteList(clickedIndex, this._lists[clickedIndex]['listKey']);
        } else if (args.object.id === 'btnArchive') {
            console.log("archive the list:");
            console.dir(this._lists[clickedIndex]);
        } else  if (args.object.id === 'btnShare'){
            console.log("share the list:");
            console.dir(this._lists[clickedIndex]);
        }
    }

    private deleteList(clickedIndex, listID) {
        this._lists.splice(clickedIndex, 1);
        firebaseWebApi.database().ref("/lists").child(listID).set(null);
    }

}

