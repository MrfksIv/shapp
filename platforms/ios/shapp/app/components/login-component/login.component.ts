import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { SnackBar } from 'nativescript-snackbar';

import * as ApplicationSettings from 'application-settings';
import * as firebase from 'nativescript-plugin-firebase';
import * as tnsOAuthModule from 'nativescript-oauth';

@Component({
    moduleId: module.id,
    selector: 'ns-login',
    templateUrl: 'login.component.html' 
})
export class LoginComponent implements OnInit {

    public input: any;
    public constructor(private router: RouterExtensions) {
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
                scope: ['public_profile', 'email']
            }
        })
        .then(
            result => {
                console.log("FB RESULT:", result);
                (new SnackBar()).simple("Successfully logged in with Facebook!");
                ApplicationSettings.setBoolean("authenticated", true);
                this.router.navigate(["/secure"], { clearHistory: true });
            },
            errorMessage => {
                console.log("FB ERROR:", errorMessage);
                // (new SnackBar()).simple(errorMessage);
            }
        );
    }

    
    loginFB2() {
        tnsOAuthModule.login()
        .then((token:string) => {
            console.log("token:", token);
            ApplicationSettings.setBoolean("authenticated", true);
            this.router.navigate(["/secure"], { clearHistory: true });
        })
        .catch( er => {
            console.log("FB2 error:");
            console.dir(er);
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