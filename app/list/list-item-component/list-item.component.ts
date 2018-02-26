import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { SnackBar } from 'nativescript-snackbar';
import { DrawerTransitionBase, SlideInOnTopTransition, RadSideDrawer } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";

import * as ApplicationSettings from 'application-settings';
import * as firebase from 'nativescript-plugin-firebase';

import { HttpService } from '../../http.service';
import { AppDataService } from "../../shared/appdata.service";

@Component({
    moduleId: module.id,
    selector: 'ns-list-item',
    templateUrl: 'list-item.component.html',
    styleUrls: ['list-item.component.css'] 
})
export class ListItemComponent implements OnInit { 

    activeListKey: string;

    constructor(private appData: AppDataService) {

    }

    ngOnInit() {
        this.activeListKey = this.appData.getActiveList();
        console.log("ACTIVE LIST-KEY:", this.activeListKey);
    }
}