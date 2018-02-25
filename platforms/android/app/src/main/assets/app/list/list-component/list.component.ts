import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { SnackBar } from 'nativescript-snackbar';
import { DrawerTransitionBase, SlideInOnTopTransition, RadSideDrawer } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import * as timerModule from 'tns-core-modules/timer';
import * as Application from "tns-core-modules/application";
import { Subscription } from 'rxjs/Subscription';

import * as ApplicationSettings from 'application-settings';
import * as firebase from 'nativescript-plugin-firebase';

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

    private _sideDrawerTransition: DrawerTransitionBase;
    private _dataItems: ObservableArray<DataItem>;
    public _lists: ObservableArray<List>;
    private listsSubscription: Subscription;
    private _numberOfAddedItems;

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
                this._lists = new ObservableArray<List>();
                for (let i=0; i < lists.length; i++) {
                    this._lists.splice(0, 0, lists[i]);
                }

                // console.dir(this._lists);
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

    get lists(): ObservableArray<List> {
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

    addList() {
        this.listsService.createNewList(ApplicationSettings.getString('uid'));
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

}

