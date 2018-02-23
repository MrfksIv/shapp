import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";

import { LoginComponent } from "./components/login-component/login.component";
import { RegisterComponent } from "./components/register-component/register.component";
import { SecureComponent } from "./components/secure-component/secure.component";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "secure", component: SecureComponent },
    { path: "lists", loadChildren: './list/list.module#ListModule' },
    { path: "friends", loadChildren: './friends/friends.module#FriendsModule' }
];


@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }