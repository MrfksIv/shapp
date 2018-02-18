// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";

import { AppModule } from "./app.module";
import * as tnsOAuthModule from 'nativescript-oauth';
import * as firebase from 'nativescript-plugin-firebase';

var facebookInitOptions : tnsOAuthModule.ITnsOAuthOptionsFacebook = {
    clientId: '171980550097374',
    clientSecret: '37bf7d8551c00db26b052df1926913b5',
    scope: ['email', 'user_friends'] //whatever other scopes you need 
};


firebase.init({iOSEmulatorFlush: true})
.then(
   instance => {
       console.log("firebase.init done");
   },
   error => {
       console.log(`firebase.init error: ${error}`);
   }
);

tnsOAuthModule.initFacebook(facebookInitOptions);

// A traditional NativeScript application starts by initializing global objects, setting up global CSS rules, creating, and navigating to the main page. 
// Angular applications need to take care of their own initialization: modules, components, directives, routes, DI providers. 
// A NativeScript Angular app needs to make both paradigms work together, so we provide a wrapper platform object, platformNativeScriptDynamic, 
// that sets up a NativeScript application and can bootstrap the Angular framework.
platformNativeScriptDynamic().bootstrapModule(AppModule);
