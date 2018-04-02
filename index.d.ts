declare module KarmiaConverter {
    export class KarmiaConverterJSONRPC {
        convert(request: Object, response: Object): Array<Object>|Object;
        convertError(error: Error): Error;
    }
}
