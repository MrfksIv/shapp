import { NgModule } from '@angular/core';
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { FriendsComponent } from './friends-component/friends.component';


const routes: Routes = [
    { path: "", component: FriendsComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ListRoutingModule {}