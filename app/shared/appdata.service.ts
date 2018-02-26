import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable"
import { Subject } from "rxjs/Subject"

@Injectable()
export class AppDataService {

    private userInfoSubject  = new Subject<any>();
    private activeListKey: string;

    public user =  {
        profile_photo: undefined,
        username: undefined,
        is_loggedin: undefined
    }

    updateUser(obj) {
        for (let key in obj) {
            if (obj[key]) {
                this.user[key] = obj[key];
            }
        }
        // console.log("UPDATED USER AppDataService:")
        // console.dir(this.user)
        this.userInfoSubject.next(this.user);
    }

    updateInfo(property, value) {
        this.user[property] = value;
        this.userInfoSubject.next(this.user);
    }

    getUserInfo(): Observable<any> {
        return this.userInfoSubject.asObservable();
    }

    setActiveList(listkey: string) {
        this.activeListKey = listkey;
    }

    getActiveList() {
        return this.activeListKey;
    }

    
 
}