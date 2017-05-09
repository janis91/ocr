export abstract class Exception extends Error {
    constructor(public message: string) {
            super(message);
            this.name = 'Exception';
            this.message = message;
            this.stack = (<any>new Error()).stack;
        }
        public toString() {
            return this.name + ': ' + this.message;
        }
}
