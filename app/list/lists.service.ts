import { Injectable } from '@angular/core';
import * as firebase from 'nativescript-plugin-firebase';
import * as ApplicationSettings from 'application-settings';
import * as moment from 'moment';
import { Observable } from "rxjs/Observable"
import { Subject } from "rxjs/Subject"

import { List } from '../classes/list.class';

@Injectable()
export class ListsService {

    private listsSubjects = new Subject<any>();

    createNewList(uid: string) {
        if (uid) {
            const list_data = {
                creatorUID : uid,
                dateCreated: moment().format("YYYY-MM-DD HH:mm:ss"),
                dateModified: moment().format("YYYY-MM-DD HH:mm:ss"),
                description: "LALALALA REFRESH WORKS!!!!!!!!!!!!!!!!!!!!!",
                items: []
            };
            firebase.push(
                '/lists',
                list_data
            ).then(
                function (result) {
                    console.log("saved to lists collection");
                    console.dir(result);
                }
            );
        }
    }

    getUserLists(uid: string) {
        if (uid) {
            let liststArray = new Array<List>();
            firebase.query( 
                firebase_result => {
                    console.log("FIREBASE RESULT:");
                    console.dir(firebase_result)
                    if (!firebase_result['value']) {
                        
                        // add code for saving the data to new user
                    } else {
                        for (let list_key in firebase_result.value){
                            const currentList = firebase_result.value[list_key];
                            liststArray.push( new List(currentList['creatorUID'], 
                                        currentList['description'], 
                                        currentList['dateCreated'], 
                                        currentList['dateModified']));
                        }
                    }
                    this.listsSubjects.next(liststArray);
                },
                '/lists',
                {
                    singleEvent: true, // for checking if the value exists (return the whole data)
                    orderBy: { // the property in each of the objects in which to perform the query 
                        type: firebase.QueryOrderByType.CHILD,
                        value: 'creatorUID'
                    },
                    range: { // the comparison operator
                        type: firebase.QueryRangeType.EQUAL_TO,
                        value: uid
                    },
                    limit: { // limit to only return the first result
                        type: firebase.QueryLimitType.FIRST, 
                        value: 20
                    }
                }
            );
        }
    }

    getListsAsObservable(): Observable<any> {
        return this.listsSubjects.asObservable();
    }
}

                