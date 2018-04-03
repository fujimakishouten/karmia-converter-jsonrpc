declare class KarmiaConverterJSONRPC {
    convert(request: Array<object>|object, response: Array<object>|object): Array<object>|object;
    convertError(error: Error): Error;
}

export = KarmiaConverterJSONRPC;
