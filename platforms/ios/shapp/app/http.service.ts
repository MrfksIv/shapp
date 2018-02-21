import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs/Observable";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

@Injectable()
export class HttpService {
    
    FB_URL = 'https://graph.facebook.com/me';

    constructor(private http: HttpClient){}

    getFaceBookUserInfo(token) {
        console.log("called getFaceBookUserInfo");
        return this.http.get(`${this.FB_URL}?access_token=${token}`).map( (res:Response) => res); 
    }

    getFacebookFriends(token) {
        return this.http.get(`${this.FB_URL}/friends?access_token=${token}`).map( (res:Response) => res);
    }
}