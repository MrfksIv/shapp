"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var firebase = require("nativescript-plugin-firebase");
var Subject_1 = require("rxjs/Subject");
var list_class_1 = require("../classes/list.class");
var ListsService = /** @class */ (function () {
    function ListsService() {
        this.listsSubjects = new Subject_1.Subject();
    }
    ListsService.prototype.createNewList = function (list) {
        if (list.uid) {
            var list_data = {
                creatorUID: list.uid,
                dateCreated: list.dateCreated,
                dateModified: list.dateModified,
                description: list.listDescription,
                items: []
            };
            return firebase.push('/lists', list_data);
        }
    };
    ListsService.prototype.getUserLists = function (uid) {
        var _this = this;
        if (uid) {
            var liststArray_1 = new Array();
            firebase.query(function (firebase_result) {
                // console.log("FIREBASE RESULT:");
                // console.dir(firebase_result)
                if (!firebase_result['value']) {
                    // add code for saving the data to new user
                }
                else {
                    for (var list_key in firebase_result.value) {
                        var currentList = firebase_result.value[list_key];
                        liststArray_1.push(new list_class_1.List(currentList['creatorUID'], currentList['description'], currentList['dateCreated'], currentList['dateModified'], list_key));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdHMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3RzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0MsdURBQXlEO0FBSXpELHdDQUFzQztBQUV0QyxvREFBNkM7QUFHN0M7SUFEQTtRQUdZLGtCQUFhLEdBQUcsSUFBSSxpQkFBTyxFQUFPLENBQUM7SUErRC9DLENBQUM7SUE3REcsb0NBQWEsR0FBYixVQUFjLElBQVE7UUFDbEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFNLFNBQVMsR0FBRztnQkFDZCxVQUFVLEVBQUcsSUFBSSxDQUFDLEdBQUc7Z0JBQ3JCLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDN0IsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUMvQixXQUFXLEVBQUUsSUFBSSxDQUFDLGVBQWU7Z0JBQ2pDLEtBQUssRUFBRSxFQUFFO2FBQ1osQ0FBQztZQUNGLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUNoQixRQUFRLEVBQ1IsU0FBUyxDQUNaLENBQUM7UUFDTixDQUFDO0lBQ0wsQ0FBQztJQUVELG1DQUFZLEdBQVosVUFBYSxHQUFXO1FBQXhCLGlCQXdDQztRQXZDRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sSUFBSSxhQUFXLEdBQUcsSUFBSSxLQUFLLEVBQVEsQ0FBQztZQUNwQyxRQUFRLENBQUMsS0FBSyxDQUNWLFVBQUEsZUFBZTtnQkFDWCxtQ0FBbUM7Z0JBQ25DLCtCQUErQjtnQkFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU1QiwyQ0FBMkM7Z0JBQy9DLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBLENBQUM7d0JBQ3hDLElBQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ3BELGFBQVcsQ0FBQyxJQUFJLENBQUUsSUFBSSxpQkFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsRUFDeEMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxFQUMxQixXQUFXLENBQUMsYUFBYSxDQUFDLEVBQzFCLFdBQVcsQ0FBQyxjQUFjLENBQUMsRUFDM0IsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsQ0FBQztnQkFDTCxDQUFDO2dCQUNELEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQVcsQ0FBQyxDQUFDO1lBQ3pDLENBQUMsRUFDRCxRQUFRLEVBQ1I7Z0JBQ0ksV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLE9BQU8sRUFBRTtvQkFDTCxJQUFJLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEtBQUs7b0JBQ3JDLEtBQUssRUFBRSxZQUFZO2lCQUN0QjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0gsSUFBSSxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUTtvQkFDdEMsS0FBSyxFQUFFLEdBQUc7aUJBQ2I7Z0JBQ0QsS0FBSyxFQUFFO29CQUNILElBQUksRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUs7b0JBQ25DLEtBQUssRUFBRSxFQUFFO2lCQUNaO2FBQ0osQ0FDSixDQUFDO1FBQ04sQ0FBQztJQUNMLENBQUM7SUFFRCwyQ0FBb0IsR0FBcEI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBaEVRLFlBQVk7UUFEeEIsaUJBQVUsRUFBRTtPQUNBLFlBQVksQ0FpRXhCO0lBQUQsbUJBQUM7Q0FBQSxBQWpFRCxJQWlFQztBQWpFWSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0ICogYXMgZmlyZWJhc2UgZnJvbSAnbmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZSc7XHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSAnYXBwbGljYXRpb24tc2V0dGluZ3MnO1xyXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzL09ic2VydmFibGVcIlxyXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSBcInJ4anMvU3ViamVjdFwiXHJcblxyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSAnLi4vY2xhc3Nlcy9saXN0LmNsYXNzJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIExpc3RzU2VydmljZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBsaXN0c1N1YmplY3RzID0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG5cclxuICAgIGNyZWF0ZU5ld0xpc3QobGlzdDphbnkpIHtcclxuICAgICAgICBpZiAobGlzdC51aWQpIHtcclxuICAgICAgICAgICAgY29uc3QgbGlzdF9kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRvclVJRCA6IGxpc3QudWlkLFxyXG4gICAgICAgICAgICAgICAgZGF0ZUNyZWF0ZWQ6IGxpc3QuZGF0ZUNyZWF0ZWQsXHJcbiAgICAgICAgICAgICAgICBkYXRlTW9kaWZpZWQ6IGxpc3QuZGF0ZU1vZGlmaWVkLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGxpc3QubGlzdERlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBmaXJlYmFzZS5wdXNoKFxyXG4gICAgICAgICAgICAgICAgJy9saXN0cycsXHJcbiAgICAgICAgICAgICAgICBsaXN0X2RhdGFcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXNlckxpc3RzKHVpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHVpZCkge1xyXG4gICAgICAgICAgICBsZXQgbGlzdHN0QXJyYXkgPSBuZXcgQXJyYXk8TGlzdD4oKTtcclxuICAgICAgICAgICAgZmlyZWJhc2UucXVlcnkoIFxyXG4gICAgICAgICAgICAgICAgZmlyZWJhc2VfcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkZJUkVCQVNFIFJFU1VMVDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIoZmlyZWJhc2VfcmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmlyZWJhc2VfcmVzdWx0Wyd2YWx1ZSddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgY29kZSBmb3Igc2F2aW5nIHRoZSBkYXRhIHRvIG5ldyB1c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbGlzdF9rZXkgaW4gZmlyZWJhc2VfcmVzdWx0LnZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRMaXN0ID0gZmlyZWJhc2VfcmVzdWx0LnZhbHVlW2xpc3Rfa2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RzdEFycmF5LnB1c2goIG5ldyBMaXN0KGN1cnJlbnRMaXN0WydjcmVhdG9yVUlEJ10sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudExpc3RbJ2Rlc2NyaXB0aW9uJ10sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudExpc3RbJ2RhdGVDcmVhdGVkJ10sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudExpc3RbJ2RhdGVNb2RpZmllZCddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdF9rZXkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RzU3ViamVjdHMubmV4dChsaXN0c3RBcnJheSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJy9saXN0cycsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlRXZlbnQ6IHRydWUsIC8vIGZvciBjaGVja2luZyBpZiB0aGUgdmFsdWUgZXhpc3RzIChyZXR1cm4gdGhlIHdob2xlIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJCeTogeyAvLyB0aGUgcHJvcGVydHkgaW4gZWFjaCBvZiB0aGUgb2JqZWN0cyBpbiB3aGljaCB0byBwZXJmb3JtIHRoZSBxdWVyeSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlPcmRlckJ5VHlwZS5DSElMRCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdjcmVhdG9yVUlEJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHsgLy8gdGhlIGNvbXBhcmlzb24gb3BlcmF0b3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlSYW5nZVR5cGUuRVFVQUxfVE8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB1aWRcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbWl0OiB7IC8vIGxpbWl0IHRvIG9ubHkgcmV0dXJuIHRoZSBmaXJzdCByZXN1bHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlyZWJhc2UuUXVlcnlMaW1pdFR5cGUuRklSU1QsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMjBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldExpc3RzQXNPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdHNTdWJqZWN0cy5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxufVxyXG5cclxuICAgICAgICAgICAgICAgICJdfQ==