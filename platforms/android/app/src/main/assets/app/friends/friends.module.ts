import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SharedModule } from '../shared/shared.module'
import { FriendsComponent } from "./friends-component/friends.component";
import { ListRoutingModule } from "./friends-routing.module";
import { NativeScriptUISideDrawerModule } from "nativescript-pro-ui/sidedrawer/angular";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        ListRoutingModule,  
        SharedModule,
        NativeScriptUISideDrawerModule
    ],
    declarations: [
        FriendsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class FriendsModule { }