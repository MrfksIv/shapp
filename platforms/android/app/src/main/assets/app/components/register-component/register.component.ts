import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { SnackBar } from "nativescript-snackbar";

import { AppDataService } from '../../shared/appdata.service';

import * as ApplicationSettings from "application-settings";
import * as firebase from 'nativescript-plugin-firebase';

@Component({
    moduleId: module.id,
    selector: "ns-register",
    templateUrl: "register.component.html",
})
export class RegisterComponent {

    public input: any;

    public constructor(private location: Location, private appData: AppDataService) {

        this.input = {
            "firstname": "",
            "lastname": "",
            "email": "",
            "password": ""
        }
    }

    public register() {
        if(this.input.firstname && this.input.lastname && this.input.email && this.input.password) {
            ApplicationSettings.setString("account", JSON.stringify(this.input));

            firebase.createUser({email: this.input.email, password:this.input.password})
            .then(
                onfulfilled => {
                    var user_data = {
                        'uid': onfulfilled.key,
                        'user_name': `${this.input.firstname} ${this.input.lastname}`,
                        'email': this.input.email
                    };
                    
                    firebase.push(
                        '/users',
                        user_data
                      ).then(
                        (result) => {
                            
                            console.log("REGISTER PUSH RESULT:");
                            console.dir(result);
                            var user = {};
                            user[result.key] = user_data; // the key is the property containing the user's data
                            // store user's data locally
                            ApplicationSettings.setString('user_key', result.key);
                            ApplicationSettings.setString('user', JSON.stringify(user));
                            
                            
                            this.appData.updateUser({
                                'is_loggedin': true,
                                'username':  user_data['user_name'],
                                'email': user_data['email']
                            });
                        }
                      );
                
                    firebase.sendEmailVerification().then(
                     () => {
                          (new SnackBar()).simple("Email verification sent. Please check your mail.");
                        },
                    (error) => {
                          (new SnackBar()).simple("An error occurred while sending your verification email.");
                        }
                    );
                },
                onrejected => {
                    console.log("CREATE USER FAILED!");
                    (new SnackBar()).simple(onrejected.replace("com.google.firebase.auth.FirebaseAuthUserCollisionException: ", ""));
                }
            );

            this.location.back();
        } else {
            (new SnackBar()).simple("All Fields Required!");
        }
    }
    public check() {
        console.dir(this.input);
    }
    public goBack() {
        this.location.back();
    }
    
}