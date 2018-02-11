export declare module database {
    interface DataSnapshot {
        key: string | null;
        val(): any;
    }
    class Query {
        private static registeredListeners;
        private static registeredCallbacks;
        protected path: string;
        constructor(path: string);
        on(eventType: string, callback: (a: DataSnapshot | null, b?: string) => any, cancelCallbackOrContext?: Object | null, context?: Object | null): (a: DataSnapshot | null, b?: string) => any;
        off(eventType?: string, callback?: (a: DataSnapshot, b?: string | null) => any, context?: Object | null): any;
        once(eventType: string, successCallback?: (a: DataSnapshot, b?: string) => any, failureCallbackOrContext?: Object | null, context?: Object | null): Promise<any>;
        private getOnValueEventHandler();
        orderByChild(child: string): Query;
        orderByKey(): Query;
        orderByPriority(): Query;
        orderByValue(): Query;
    }
    class Reference extends Query {
        set(value: any, onComplete?: (a: Error | null) => any): Promise<any>;
        remove(onComplete?: (a: Error | null) => any): Promise<any>;
    }
    class Database {
        ref(path: string): Reference;
    }
}
