import { Component, Input, OnInit } from "@angular/core";
import * as ApplicationSettings from "application-settings";
import { RouterExtensions } from "nativescript-angular/router";
import * as firebase from 'nativescript-plugin-firebase';

import { Subscription } from 'rxjs/Subscription';

import { AppDataService } from "../../shared/appdata.service";

/* ***********************************************************
* Keep data that is displayed in your app drawer in the MyDrawer component class.
* Add new data objects that you want to display in the drawer here in the form of properties.
*************************************************************/
@Component({
    selector: "MyDrawer",
    moduleId: module.id,
    templateUrl: "./my-drawer.component.html",
    styleUrls: ["./my-drawer.component.scss"]
})
export class MyDrawerComponent implements OnInit {
    /* ***********************************************************
    * The "selectedPage" is a component input property.
    * It is used to pass the current page title from the containing page component.
    * You can check how it is used in the "isPageSelected" function below.
    *************************************************************/
    @Input() selectedPage: string;
    userFacebookID: string;
    username: string;
    email: string;
    userInfoSubscription: Subscription;
    imageURL: string;
    profile_photo_URL: string;

    constructor(private router: RouterExtensions, private appData: AppDataService) {
        this.userInfoSubscription = this.appData.getUserInfo()
        .subscribe( userInfo => {           
            console.log("RECEIVED INFO AT DRAWER!");
            console.dir(userInfo);
            const user_key = ApplicationSettings.getString('user_key');
            let user = ApplicationSettings.getString('user');
    
            this.username = userInfo.username || ApplicationSettings.getString('username');
            this.email = userInfo.email || ApplicationSettings.getString('email');
            this.userFacebookID = userInfo.fbID || ApplicationSettings.getString('fbID');
            this.profile_photo_URL = userInfo.profile_photo || ApplicationSettings.getString('profile_photo');               
           
            this.prepareImageURL();
        });
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the MyDrawerComponent "onInit" event handler to initialize the properties data values.
        *************************************************************/
    }

    /* ***********************************************************
    * The "isPageSelected" function is bound to every navigation item on the <MyDrawerItem>.
    * It is used to determine whether the item should have the "selected" class.
    * The "selected" class changes the styles of the item, so that you know which page you are on.
    *************************************************************/
    isPageSelected(pageTitle: string): boolean {
        return pageTitle === this.selectedPage;
    }

    //https://graph.facebook.com/867374123424597/picture?type=normal

    public prepareImageURL() {
        if (this.userFacebookID) {
            this.imageURL = `https://graph.facebook.com/${this.userFacebookID}/picture?type=normal`;
        } else if (this.profile_photo_URL) {
            this.imageURL = this.profile_photo_URL;
        }
        
    }
    
    public logout() {
        firebase.logout();
        
        this.appData.user.is_loggedin = false;
        this.appData.user.profile_photo = null;
        this.appData.user.username = null;
 
        ApplicationSettings.clear();
        this.router.navigate(["/login"], { clearHistory: true });
    }
}
