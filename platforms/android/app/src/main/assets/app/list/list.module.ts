import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { SharedModule } from '../shared/shared.module'
import { ListComponent } from "./list-component/list.component";
import { ListRoutingModule } from "./list-routing.module";
import { NativeScriptUISideDrawerModule } from "nativescript-pro-ui/sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-pro-ui/listview/angular";
import { ListService } from "./list.service";
import { ListsService } from "./lists.service";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        ListRoutingModule,  
        SharedModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule
    ],
    declarations: [
        ListComponent
    ],
    providers: [
        ListService,
        ListsService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ListModule { }