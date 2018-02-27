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

    createNewList(list:any) {
        if (list.creatorUID) {
            const list_data = {
                creatorUID : list.creatorUID,
                dateCreated: list.dateCreated,
                dateModified: list.dateModified,
                description: list.description,
                archived: false,
                items: []
            };
            console.log("CREATING NEW LIST FROM SERVICE");
            return firebase.push(
                '/lists',
                list_data
            );
        }
    }

    getUserLists(uid: string) {
        if (uid) {
            let liststArray = new Array<List>();
            firebase.query( 
                firebase_result => {
                    // console.log("FIREBASE RESULT:");
                    // console.dir(firebase_result)
                    if (!firebase_result['value']) {
                        
                        // add code for saving the data to new user
                    } else {
                        for (let list_key in firebase_result.value){
                            const currentList = firebase_result.value[list_key];
                            liststArray.push( new List(currentList['creatorUID'], 
                                        currentList['description'], 
                                        currentList['dateCreated'], 
                                        currentList['dateModified'],
                                        list_key));
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

                