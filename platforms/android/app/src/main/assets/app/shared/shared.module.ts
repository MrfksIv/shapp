import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";


import { MyDrawerItemComponent } from "./my-drawer-item/my-drawer-item.component";
import { MyDrawerComponent } from "./my-drawer/my-drawer.component";

@NgModule({
    imports: [
        NativeScriptCommonModule
    ],
    declarations: [
        MyDrawerComponent,
        MyDrawerItemComponent
    ],
    exports: [
        MyDrawerComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SharedModule { }
