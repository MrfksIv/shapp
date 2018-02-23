import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { AppRoutingModule } from "./app.routing";

import { AppComponent } from "./app.component";

import { SharedModule } from './shared/shared.module';
import { ListModule } from './list/list.module';
import { FriendsModule } from './friends/friends.module';

import { ItemService } from "./item/item.service";
import { HttpService } from "./http.service";
import { AppDataService } from "./shared/appdata.service";

import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";
import { LoginComponent } from "./components/login-component/login.component";
import { RegisterComponent } from "./components/register-component/register.component";
import { SecureComponent } from "./components/secure-component/secure.component";
import { NativeScriptUISideDrawerModule } from "nativescript-pro-ui/sidedrawer/angular";
// import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpModule } from "nativescript-angular/http";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        AppRoutingModule,
        NativeScriptUISideDrawerModule,
        NativeScriptHttpClientModule,
        SharedModule,
        ListModule,
        FriendsModule   
    ],
    declarations: [
        AppComponent,
        ItemsComponent,
        ItemDetailComponent,
        LoginComponent,
        RegisterComponent,
        SecureComponent
        // RadSideDrawerComponent
    ],
    providers: [
        ItemService,
        HttpService,
        AppDataService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
