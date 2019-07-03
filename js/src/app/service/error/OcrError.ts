export abstract class OcrError extends Error {

    public new_stack: string;

    constructor(message: string, public original?: Error | any) {
        super(message);
        this.name = this.constructor.name;
        if (typeof (Error as any).captureStackTrace === 'function') {
            (Error as any).captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
        if (original === undefined || !(original instanceof Error)) { return this; }
        this.new_stack = this.stack;
        const message_lines = (this.message.match(/\n/g) || []).length + 1;
        this.stack = this.stack.split('\n').slice(0, message_lines + 1).join('\n') + '\n' + original.stack;
    }
}
