export class List {
    constructor (public creatorUID: string, 
        public description?: string,
        public dateCreated?: string,
        public dateModified?: string,
        public listKey?: string,
        public archived?: boolean) {

    }
}