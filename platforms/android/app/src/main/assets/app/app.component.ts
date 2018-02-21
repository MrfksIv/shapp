import { Component, OnInit } from "@angular/core";
import * as tnsOAuthModule from 'nativescript-oauth';

import * as firebase from 'nativescript-plugin-firebase';
import * as ApplicationSettings from 'application-settings';

import { HttpService } from './http.service';

import { GlobalVars } from './shared/global-vars';
import { AppData } from './shared/app-data';
import { AppDataService } from "./shared/appdata.service";
@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})


export class AppComponent implements OnInit{ 

    constructor(private http: HttpService, private appData: AppDataService) {}

    ngOnInit() {
        firebase.init({
            persist: false,
            iOSEmulatorFlush: true,
            
            onAuthStateChanged: (data) => {
                console.log('LALALAL');
                console.dir(data)
                if (data && data.user) {
                    console.log("IN IF onAuthStateChanged");

                    this.appData.updateUser({
                        'is_loggedin': true,
                        'profile_photo': data.user.profileImageURL,
                        'username': data.user.name,
                        'email': data.user.email || ApplicationSettings.getString('email'),
                        'fbID': ApplicationSettings.getString('fbID')
                    });

                    // this.appData.user.is_loggedin = true;
                    // this.appData.user.profile_photo = data.user.profileImageURL;
                    // this.appData.user.username = data.user.name;


                    // this.getFacebookFriends();
                }
                console.dir(this.appData.user);
            }
        })
        .then(
           instance => {
               console.log("firebase.init done");
           },
           error => {
               console.log(`firebase.init error: ${error}`);
           }
        );
    }

    getFacebookFriends() {
        const user_key = ApplicationSettings.getString('user_key');
        const user = JSON.parse(ApplicationSettings.getString('user'));
        const fb_token = ApplicationSettings.getString('fb_token');

        this.http.getFacebookFriends(fb_token).subscribe( (res:any) => {
            console.log("FRIENDS RESULT:");
            console.dir(res);
            var friends_ids = res.data.map( obj =>{
                return obj.id;
            });
            friends_ids.push(user[user_key].id); // also push the ID for the current user
            console.log("FRIENDS LIST:");
            console.dir(friends_ids);
        }, 
        (error) => {
            console.log('ERROR:', error);
        });
    }
    
}
