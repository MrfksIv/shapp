"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var firebase = require("nativescript-plugin-firebase");
var moment = require("moment");
var Subject_1 = require("rxjs/Subject");
var list_class_1 = require("../classes/list.class");
var ListsService = /** @class */ (function () {
    function ListsService() {
        this.listsSubjects = new Subject_1.Subject();
    }
    ListsService.prototype.createNewList = function (uid) {
        if (uid) {
            var list_data = {
                creatorUID: uid,
                dateCreated: moment().format("YYYY-MM-DD HH:mm:ss"),
                dateModified: moment().format("YYYY-MM-DD HH:mm:ss"),
                description: "LALALALA REFRESH WORKS!!!!!!!!!!!!!!!!!!!!!",
                items: []
            };
            firebase.push('/lists', list_data).then(function (result) {
                console.log("saved to lists collection");
                console.dir(result);
            });
        }
    };
    ListsService.prototype.getUserLists = function (uid) {
        var _this = this;
        if (uid) {
            var liststArray_1 = new Array();
            firebase.query(function (firebase_result) {
                console.log("FIREBASE RESULT:");
                console.dir(firebase_result);
                if (!firebase_result['value']) {
                    // add code for saving the data to new user
                }
                else {
                    for (var list_key in firebase_result.value) {
                        var currentList = firebase_result.value[list_key];
                        liststArray_1.push(new list_class_1.List(currentList['creatorUID'], currentList['description'], currentList['dateCreated'], currentList['dateModified']));
                    }
                }
                _this.listsSubjects.next(liststArray_1);
            }, '/lists', {
                singleEvent: true,
                orderBy: {
                    type: firebase.QueryOrderByType.CHILD,
                    value: 'creatorUID'
                },
                range: {
                    type: firebase.QueryRangeType.EQUAL_TO,
                    value: uid
                },
                limit: {
                    type: firebase.QueryLimitType.FIRST,
                    value: 20
                }
            });
        }
    };
    ListsService.prototype.getListsAsObservable = function () {
        return this.listsSubjects.asObservable();
    };
    ListsService = __decorate([
        core_1.Injectable()
    ], ListsService);
    return ListsService;
}());
exports.ListsService = ListsService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdHMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3RzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0MsdURBQXlEO0FBRXpELCtCQUFpQztBQUVqQyx3Q0FBc0M7QUFFdEMsb0RBQTZDO0FBRzdDO0lBREE7UUFHWSxrQkFBYSxHQUFHLElBQUksaUJBQU8sRUFBTyxDQUFDO0lBbUUvQyxDQUFDO0lBakVHLG9DQUFhLEdBQWIsVUFBYyxHQUFXO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDTixJQUFNLFNBQVMsR0FBRztnQkFDZCxVQUFVLEVBQUcsR0FBRztnQkFDaEIsV0FBVyxFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztnQkFDbkQsWUFBWSxFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztnQkFDcEQsV0FBVyxFQUFFLDZDQUE2QztnQkFDMUQsS0FBSyxFQUFFLEVBQUU7YUFDWixDQUFDO1lBQ0YsUUFBUSxDQUFDLElBQUksQ0FDVCxRQUFRLEVBQ1IsU0FBUyxDQUNaLENBQUMsSUFBSSxDQUNGLFVBQVUsTUFBTTtnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7Z0JBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUNKLENBQUM7UUFDTixDQUFDO0lBQ0wsQ0FBQztJQUVELG1DQUFZLEdBQVosVUFBYSxHQUFXO1FBQXhCLGlCQXVDQztRQXRDRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sSUFBSSxhQUFXLEdBQUcsSUFBSSxLQUFLLEVBQVEsQ0FBQztZQUNwQyxRQUFRLENBQUMsS0FBSyxDQUNWLFVBQUEsZUFBZTtnQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUE7Z0JBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFNUIsMkNBQTJDO2dCQUMvQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEdBQUcsQ0FBQyxDQUFDLElBQUksUUFBUSxJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDO3dCQUN4QyxJQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUNwRCxhQUFXLENBQUMsSUFBSSxDQUFFLElBQUksaUJBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLEVBQ3hDLFdBQVcsQ0FBQyxhQUFhLENBQUMsRUFDMUIsV0FBVyxDQUFDLGFBQWEsQ0FBQyxFQUMxQixXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBVyxDQUFDLENBQUM7WUFDekMsQ0FBQyxFQUNELFFBQVEsRUFDUjtnQkFDSSxXQUFXLEVBQUUsSUFBSTtnQkFDakIsT0FBTyxFQUFFO29CQUNMLElBQUksRUFBRSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsS0FBSztvQkFDckMsS0FBSyxFQUFFLFlBQVk7aUJBQ3RCO2dCQUNELEtBQUssRUFBRTtvQkFDSCxJQUFJLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRO29CQUN0QyxLQUFLLEVBQUUsR0FBRztpQkFDYjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0gsSUFBSSxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSztvQkFDbkMsS0FBSyxFQUFFLEVBQUU7aUJBQ1o7YUFDSixDQUNKLENBQUM7UUFDTixDQUFDO0lBQ0wsQ0FBQztJQUVELDJDQUFvQixHQUFwQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFwRVEsWUFBWTtRQUR4QixpQkFBVSxFQUFFO09BQ0EsWUFBWSxDQXFFeEI7SUFBRCxtQkFBQztDQUFBLEFBckVELElBcUVDO0FBckVZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tICduYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlJztcclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tICdhcHBsaWNhdGlvbi1zZXR0aW5ncyc7XHJcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anMvT2JzZXJ2YWJsZVwiXHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tIFwicnhqcy9TdWJqZWN0XCJcclxuXHJcbmltcG9ydCB7IExpc3QgfSBmcm9tICcuLi9jbGFzc2VzL2xpc3QuY2xhc3MnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTGlzdHNTZXJ2aWNlIHtcclxuXHJcbiAgICBwcml2YXRlIGxpc3RzU3ViamVjdHMgPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcblxyXG4gICAgY3JlYXRlTmV3TGlzdCh1aWQ6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh1aWQpIHtcclxuICAgICAgICAgICAgY29uc3QgbGlzdF9kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRvclVJRCA6IHVpZCxcclxuICAgICAgICAgICAgICAgIGRhdGVDcmVhdGVkOiBtb21lbnQoKS5mb3JtYXQoXCJZWVlZLU1NLUREIEhIOm1tOnNzXCIpLFxyXG4gICAgICAgICAgICAgICAgZGF0ZU1vZGlmaWVkOiBtb21lbnQoKS5mb3JtYXQoXCJZWVlZLU1NLUREIEhIOm1tOnNzXCIpLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiTEFMQUxBTEEgUkVGUkVTSCBXT1JLUyEhISEhISEhISEhISEhISEhISEhIVwiLFxyXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZpcmViYXNlLnB1c2goXHJcbiAgICAgICAgICAgICAgICAnL2xpc3RzJyxcclxuICAgICAgICAgICAgICAgIGxpc3RfZGF0YVxyXG4gICAgICAgICAgICApLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlZCB0byBsaXN0cyBjb2xsZWN0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFVzZXJMaXN0cyh1aWQ6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh1aWQpIHtcclxuICAgICAgICAgICAgbGV0IGxpc3RzdEFycmF5ID0gbmV3IEFycmF5PExpc3Q+KCk7XHJcbiAgICAgICAgICAgIGZpcmViYXNlLnF1ZXJ5KCBcclxuICAgICAgICAgICAgICAgIGZpcmViYXNlX3Jlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGSVJFQkFTRSBSRVNVTFQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGZpcmViYXNlX3Jlc3VsdClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpcmViYXNlX3Jlc3VsdFsndmFsdWUnXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGNvZGUgZm9yIHNhdmluZyB0aGUgZGF0YSB0byBuZXcgdXNlclxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGxpc3Rfa2V5IGluIGZpcmViYXNlX3Jlc3VsdC52YWx1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50TGlzdCA9IGZpcmViYXNlX3Jlc3VsdC52YWx1ZVtsaXN0X2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0c3RBcnJheS5wdXNoKCBuZXcgTGlzdChjdXJyZW50TGlzdFsnY3JlYXRvclVJRCddLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMaXN0WydkZXNjcmlwdGlvbiddLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMaXN0WydkYXRlQ3JlYXRlZCddLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMaXN0WydkYXRlTW9kaWZpZWQnXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdHNTdWJqZWN0cy5uZXh0KGxpc3RzdEFycmF5KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnL2xpc3RzJyxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzaW5nbGVFdmVudDogdHJ1ZSwgLy8gZm9yIGNoZWNraW5nIGlmIHRoZSB2YWx1ZSBleGlzdHMgKHJldHVybiB0aGUgd2hvbGUgZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICBvcmRlckJ5OiB7IC8vIHRoZSBwcm9wZXJ0eSBpbiBlYWNoIG9mIHRoZSBvYmplY3RzIGluIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHF1ZXJ5IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeU9yZGVyQnlUeXBlLkNISUxELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ2NyZWF0b3JVSUQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICByYW5nZTogeyAvLyB0aGUgY29tcGFyaXNvbiBvcGVyYXRvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeVJhbmdlVHlwZS5FUVVBTF9UTyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHVpZFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbGltaXQ6IHsgLy8gbGltaXQgdG8gb25seSByZXR1cm4gdGhlIGZpcnN0IHJlc3VsdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaXJlYmFzZS5RdWVyeUxpbWl0VHlwZS5GSVJTVCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAyMFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGlzdHNBc09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5saXN0c1N1YmplY3RzLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4gICAgICAgICAgICAgICAgIl19