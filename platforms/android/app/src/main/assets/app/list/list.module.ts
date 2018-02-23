import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SharedModule } from '../shared/shared.module'
import { ListComponent } from "./list-component/list.component";
import { ListRoutingModule } from "./list-routing.module";
import { NativeScriptUISideDrawerModule } from "nativescript-pro-ui/sidedrawer/angular";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        ListRoutingModule,  
        SharedModule,
        NativeScriptUISideDrawerModule
    ],
    declarations: [
        ListComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ListModule { }