import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { SnackBar } from "nativescript-snackbar";

import * as ApplicationSettings from "application-settings";
// import * as firebase from 'nativescript-plugin-firebase';

@Component({
    moduleId: module.id,
    selector: "ns-register",
    templateUrl: "register.component.html",
})
export class RegisterComponent {

    public input: any;

    public constructor(private location: Location) {
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

            // firebase.createUser({email: this.input.email, password:this.input.password})
            // .then(
            //     onfulfilled => {
            //         console.log("CREATE USER SUCCESS!");
            //         console.dir(onfulfilled);
            //     },
            //     onrejected => {
            //         console.log("CREATE USER FAILED!");
            //         console.dir(onrejected);
            //     }
            // );

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