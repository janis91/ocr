export abstract class OcrError extends Error {
  constructor(message: string, public original?: Error | any) {
    super(message)
    this.name = this.constructor.name
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
    if (original === undefined || !(original instanceof Error)) { return this }
    const messageLines = (this.message.match(/\n/g) || []).length + 1
    this.stack = this.stack !== undefined ? this.stack.split('\n').slice(0, messageLines + 1).join('\n') + '\n' + original.stack : undefined
  }
}
