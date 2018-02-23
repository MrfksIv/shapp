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
    selector: 'ns-login',
    templateUrl: 'list.component.html' 
})
export class ListComponent implements OnInit {
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;

    private _sideDrawerTransition: DrawerTransitionBase;

    constructor(private router: RouterExtensions){}
    /* ***********************************************************
    * Use the sideDrawerTransition property to change the open/close animation of the drawer.
    *************************************************************/
    ngOnInit(): void {
        if(!ApplicationSettings.getBoolean("authenticated", false)) {
            this.router.navigate(["/login"], { clearHistory: true });
        }
        this._sideDrawerTransition = new SlideInOnTopTransition();
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    /* ***********************************************************
    * According to guidelines, if you have a drawer on your page, you should always
    * have a button that opens it. Use the showDrawer() function to open the app drawer section.
    *************************************************************/
    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }


}

//     @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
//     private drawer: RadSideDrawer;
//     private _sideDrawerTransition: DrawerTransitionBase;

//     public constructor(private router: RouterExtensions) { }

//     public ngOnInit() {
//         if(!ApplicationSettings.getBoolean("authenticated", false)) {
//             this.router.navigate(["/login"], { clearHistory: true });
//         }
//         this._sideDrawerTransition = new SlideInOnTopTransition();
//     }

//     public ngAfterViewInit() {
//         this.drawer = this.drawerComponent.sideDrawer;
//     }

//     get sideDrawerTransition(): DrawerTransitionBase {
//         return this._sideDrawerTransition;
//     }

//     onDrawerButtonTap(): void {
//         this.drawer.showDrawer();
//     }
// }