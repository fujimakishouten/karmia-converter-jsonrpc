/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



/**
 * Declarations
 */

declare interface Parameters {
    [index: string]: any;
}

declare interface JSONRPCRequest {
    jsonrpc?: string;
    method?: string;
    params?: any;
    id?: any;
}

declare interface JSONRPCResponse {
    jsonrpc?: string;
    result: any;
    error?: JSONRPCError;
    id?: any;
}

declare class JSONRPCError extends Error {
    code?: number;
    data?: any;
    [index: string]: any;
}



/**
 * KarmiaConverterJSONRPC
 *
 * @class
 */
class KarmiaConverterJSONRPC {
    /**
     * Properties
     */
    public convert = KarmiaConverterJSONRPC.convert;
    public convertError = KarmiaConverterJSONRPC.convertError;


    /**
     * Convert from KarmiaRPC response to JSON-RPC 2.0 response
     *
     * @param   {Object} request
     * @param   {Object} response
     * @returns {Object}
     */
    static convert(request: Array<JSONRPCRequest>|JSONRPCRequest, response: Parameters) {
        const self = this,
            batch = Array.isArray(request),
            requests = (Array.isArray(request)) ? request : [(request || {})];
        response = (batch) ? response : [(response || {})];

        const result = response.reduce((collection: Array<JSONRPCResponse>, value: any, index: number) => {
            if (!('id' in requests[index])) {
                return collection;
            }

            const data = {
                jsonrpc: '2.0',
                id: requests[index].id
            } as JSONRPCResponse;
            if (value instanceof Error) {
                data.error = Object.getOwnPropertyNames(value).reduce((error: JSONRPCError, property_name) => {
                    error[property_name] = (value as JSONRPCError)[property_name];

                    return error;
                }, {}) as JSONRPCError;

                data.error = self.convertError(data.error);
            } else {
                data.result = value;
            }
            collection.push(data);

            return collection;
        }, []);

        if (!result.length) {
            return null;
        }

        return (batch) ? result : result[0];
    }

    /**
     * Convert error object
     *
     * @param {Object} error
     * @returns {Object}
     */
    static convertError(error: Error) {
        const message = (error.message) ? error.message.toLowerCase() : '';
        const result = error as JSONRPCError;

        if ('not found' === message) {
            result.code = -32601;
            result.message = 'Method not found';

            return result;
        }

        if ('bad request' === message) {
            result.code = -32602;
            result.message = 'Invalid params';

            return result;
        }

        if ('internal server error' === message) {
            result.code = -32603;
            result.message = 'Internal error';

            return result;
        }

        return result;
    }
}



// Export modules
export = KarmiaConverterJSONRPC;



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
