declare module KarmiaConverterJSONRPC {
    export class KarmiaConverterJSONRPC {
        convert(request: Object, response: Object): Array<Object>|Object;
        convertError(error: Error): Error;
    }
}
