import { Component } from "@angular/core";
import * as tnsOAuthModule from 'nativescript-oauth';

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent { 

    loginFB() {
        tnsOAuthModule.ensureValidToken()
        .then((token:string) => {
            console.log("token:", token);
        })
        .catch( er => {
            console.log("ERROR:", er);
        });
    }
}
