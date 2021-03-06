import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { SnackBar } from 'nativescript-snackbar';

import * as ApplicationSettings from 'application-settings';
import * as firebase from 'nativescript-plugin-firebase';
import * as tnsOAuthModule from 'nativescript-oauth';

import { HttpService } from '../../http.service';
import { AppDataService } from "../../shared/appdata.service";
 
@Component({
    moduleId: module.id,
    selector: 'ns-login',
    templateUrl: 'login.component.html' 
})
export class LoginComponent implements OnInit {

    public input: any;
    public constructor(private router: RouterExtensions, private http: HttpService, private appData: AppDataService) {
        this.input = {
            "email": "",
            "password": ""
        };
    }

    public ngOnInit() {
        if (ApplicationSettings.getBoolean("authenticated", false)) {
            this.router.navigate(['/secure'], {clearHistory: true});
        }
    }

    public loginFB() {
        console.log("loggin in with FACEBOOK!");
        firebase.login({
            type: firebase.LoginType.FACEBOOK,
            facebookOptions: {
                // scope: ['public_profile', 'email', 'user_birhtday', 'user_friends', 'user_location']
                scope: ['public_profile', 'email', 'user_friends']
            }
        })
        .then(
            (fb_result) => {
                console.log("FB RESULT:");
                // console.dir(fb_result);
                var fb_access_token = fb_result.providers[1]['token'];

                this.checkIfUserExists(fb_result, fb_access_token);
                ApplicationSettings.setBoolean("authenticated", true);
                this.router.navigate(["/secure"], { clearHistory: true });
            },
            errorMessage => {
                console.log("FB ERROR:", errorMessage);
                // (new SnackBar()).simple(errorMessage);
            }
        );
    }

    private checkIfUserExists(fb_result, fb_access_token) {
        console.log("called checkIfUserExists");
        console.dir(fb_result);
        firebase.query( 
            firebase_result => {
                // console.log("FIREBASE RESULT:");
                // console.dir(firebase_result)
                if (!firebase_result['value']) {
                    console.log("IN IF checkIfUserExists");
                    // add code for saving the data to new user
                    this.createNewUser(fb_result, fb_access_token);
                } else {
                    console.log("IN ELSE");
                    for(var user_key in firebase_result.value){
                        // save user's data locally
                        ApplicationSettings.setString('user_key', user_key);
                        ApplicationSettings.setString('user', JSON.stringify(firebase_result.value[user_key]));
                        // console.dir(firebase_result.value[user_key]);
                        ApplicationSettings.setString('fb_token', fb_access_token);
                    }
                    console.dir(firebase_result.value[Object.keys(firebase_result.value)[0]])

                    let username = firebase_result.value[Object.keys(firebase_result.value)[0]]['user_name'];
                    let email = firebase_result.value[Object.keys(firebase_result.value)[0]]['email'];
                    let fbID = firebase_result.value[Object.keys(firebase_result.value)[0]]['id'];
                    
                    this.appData.updateUser({
                        'is_loggedin': true,
                        'username':  firebase_result.value[Object.keys(firebase_result.value)[0]]['user_name'],
                        'email': firebase_result.value[Object.keys(firebase_result.value)[0]]['email'],
                        'fbID': firebase_result.value[Object.keys(firebase_result.value)[0]]['id']
                    });
                    if (fbID)
                        ApplicationSettings.setString('fbID', fbID);
                    if (username)
                        ApplicationSettings.setString('username', username);
                    if (email)
                        ApplicationSettings.setString('email', email);
                }
            },
            '/users',
            {
                singleEvent: true, // for checking if the value exists (return the whole data)
                orderBy: { // the property in each of the objects in which to perform the query 
                    type: firebase.QueryOrderByType.CHILD,
                    value: 'uid'
                },
                range: { // the comparison operator
                    type: firebase.QueryRangeType.EQUAL_TO,
                    value: fb_result.uid
                },
                limit: { // limit to only return the first result
                    type: firebase.QueryLimitType.FIRST, 
                    value: 1
                }
            }
        );
    }

    private createNewUser(fb_result, fb_access_token) {
        console.log('called createNewUser');
        var user_data = {
            'uid': fb_result.uid,
            'user_name': fb_result.name,
            'profile_photo': fb_result.profileImageURL
        };

        this.appData.updateUser({
            'username':  fb_result['name'],
            'email':fb_result['email']
        });
        
        this.http.getFaceBookUserInfo(fb_access_token).subscribe( (r: any) => {
                 console.dir(r);
                user_data['id'] = r.id; // facebook user ID for this specific app
                // console.log("facebook answer");
                // console.dir(r);
                // create new user
                firebase.push(
                  '/users',
                  user_data
                ).then(
                  function (result) {
                     
                    var user = {};
                    user[result.key] = user_data; // the key is the property containing the user's data
                    // store user's data locally
                    ApplicationSettings.setString('user_key', result.key);
                    ApplicationSettings.setString('user', JSON.stringify(user));
                    // console.dir(user);
                    ApplicationSettings.setString('fb_token', fb_access_token);
                  }
                );
         
        });
    }

    public login() {
        console.log("login in");
        console.dir(this.input);
        if (this.input.email && this.input.password) {

            firebase.login({
                type: firebase.LoginType.PASSWORD,
                passwordOptions: {
                    email: this.input.email,
                    password: this.input.password
                }
            })
            .then(
                result => {
                    ApplicationSettings.setBoolean("authenticated", true);
                    this.router.navigate(["/secure"], { clearHistory: true });
                },
                errorMessage => {
                    (new SnackBar()).simple("Incorrect Credentials!");
                }
            );
        }
    }

    public doLoginByGoogle(): void {
        console.log("loggin in with GOOGLE!");
        firebase.login({
            // note that you need to enable Google auth in your firebase instance
            type: firebase.LoginType.GOOGLE
        }).then(
            result => {
                ApplicationSettings.setBoolean("authenticated", true);
                this.router.navigate(["/secure"], { clearHistory: true });
            },
            errorMessage => {
                (new SnackBar()).simple("Incorrect Credentials!");
            }
        );
      }

    // public login() {
    //     if(this.input.email && this.input.password) {
    //         let account = JSON.parse(ApplicationSettings.getString("account", "{}"));
    //         if(this.input.email == account.email && this.input.password == account.password) {
    //             ApplicationSettings.setBoolean("authenticated", true);
    //             this.router.navigate(["/secure"], { clearHistory: true });
    //         } else {
    //             (new SnackBar()).simple("Incorrect Credentials!");
    //         }
    //     } else {
    //         (new SnackBar()).simple("All Fields Required!");
    //     }
    // }
    //  
}