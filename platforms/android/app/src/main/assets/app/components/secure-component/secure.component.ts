import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, SlideInOnTopTransition, RadSideDrawer } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";

import * as ApplicationSettings from "application-settings";

@Component({
    moduleId: module.id,
    selector: "ns-secure",
    templateUrl: "secure.component.html",
})
export class SecureComponent implements OnInit, AfterViewInit {

    @ViewChild(RadSideDrawerComponent) drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;
    private _sideDrawerTransition: DrawerTransitionBase;

    public constructor(private router: RouterExtensions) { }

    public ngOnInit() {
        if(!ApplicationSettings.getBoolean("authenticated", false)) {
            this.router.navigate(["/login"], { clearHistory: true });
        }
        this._sideDrawerTransition = new SlideInOnTopTransition();
    }

    public ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    /* ***********************************************************
    * According to guidelines, if you have a drawer on your page, you should always
    * have a button that opens it. Use the showDrawer() function to open the app drawer section.
    *************************************************************/
    onDrawerButtonTap(): void {
        console.log("SHOW MENU!!!");
        this.drawer.showDrawer();
    }

    public logout() {
        ApplicationSettings.remove("authenticated");
        this.router.navigate(["/login"], { clearHistory: true });
    }

}