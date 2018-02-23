import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { SnackBar } from 'nativescript-snackbar';
import { DrawerTransitionBase, SlideInOnTopTransition, RadSideDrawer } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";
import { ObservableArray } from "tns-core-modules/data/observable-array";

import * as ApplicationSettings from 'application-settings';
import * as firebase from 'nativescript-plugin-firebase';

import { HttpService } from '../../http.service';
import { AppDataService } from "../../shared/appdata.service";
import { ListService } from '../list.service';

import { DataItem } from '../../classes/dataitem.class';


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

    constructor(private router: RouterExtensions, private listService: ListService){}

    ngOnInit(): void {
        if(!ApplicationSettings.getBoolean("authenticated", false)) {
            this.router.navigate(["/login"], { clearHistory: true });
        }
        this._sideDrawerTransition = new SlideInOnTopTransition();
        this._dataItems = new ObservableArray(this.listService.getDataItems());
        
        console.log("DATA ITEMS:::");
        console.dir(this._dataItems);
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    get dataItems(): ObservableArray<DataItem> {
        return this._dataItems;
    }


    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }

}

