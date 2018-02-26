import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { SnackBar } from 'nativescript-snackbar';
import { DrawerTransitionBase, SlideInOnTopTransition, RadSideDrawer } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";
import { RadListViewComponent } from "nativescript-pro-ui/listview/angular";
import { TextField } from "ui/text-field";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import * as timerModule from 'tns-core-modules/timer';
import * as Application from "tns-core-modules/application";
import { Subscription } from 'rxjs/Subscription';

import * as ApplicationSettings from 'application-settings';
import * as firebase from 'nativescript-plugin-firebase';
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
    providers: [ListService],
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.css']
})
export class ListComponent implements OnInit {
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
    @ViewChild("listview") listViewComponent: RadListViewComponent;
    @ViewChild("groceryTextField") groceryTextField: ElementRef;

    private _sideDrawerTransition: DrawerTransitionBase;
    private _dataItems: ObservableArray<DataItem>;
    public _lists: Array<List>;
    private listsSubscription: Subscription;
    private _numberOfAddedItems;
    listDescription: string = '';
    isLoading: boolean = false;
    rand: number = 0;
    

    constructor(private router: RouterExtensions, private listService: ListService, private listsService: ListsService){
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

    // Prevent the first textfield from receiving focus on Android
    // See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
    handleAndroidFocus(textField, container) {
        if (container.android) {
        container.android.setFocusableInTouchMode(true);
        container.android.setFocusable(true);
        textField.android.clearFocus();
        }
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

    public onPullToRefreshInitiatedExample(args: ListViewEventData) {
        var that = new WeakRef(this);
        timerModule.setTimeout( () => {
            const initialNumberOfItems = that.get()._numberOfAddedItems;
            for (let i = that.get()._numberOfAddedItems; i < initialNumberOfItems + 2; i++) {
                if (i > posts.names.length - 1) {
                    break;
                }
                const imageUri = Application.android ? posts.images[i].toLowerCase() : posts.images[i];
                that.get()._dataItems.splice(0, 0, new DataItem(i, posts.names[i], "This is item description", posts.titles[i], posts.text[i], "res://" + imageUri));
                that.get()._numberOfAddedItems++;
            }
            var listView = args.object;
            listView.notifyPullToRefreshFinished();
        }, 1000);
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

        this.listsService.createNewList(ApplicationSettings.getString('uid'), this.listDescription)
        .then((result) => {
                console.log("saved!");
                console.dir(result);
                this.listDescription = '';
                setTimeout( () => {
                    this.hideActivityIndicator();
                    this.getLists();
                }, 1500);
                
            }

        ).catch( err => {
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
            if (a['dateModified'] < b['dateModified']) {
                return -1;
            } else if (a['dateModified'] > b['dateModified']) {
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

}

