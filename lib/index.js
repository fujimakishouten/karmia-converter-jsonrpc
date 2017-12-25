/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



/**
 * KarmiaConverterJSONRPC
 *
 * @class
 */
class KarmiaConverterJSONRPC {
    /**
     * Constructor
     *
     * @constructs KarmiaConverterJSONRPC
     * @returns {Object}
     */
    constructor() {
        const self = this;
        self.convert = KarmiaConverterJSONRPC.convert;
        self.convertError = KarmiaConverterJSONRPC.convertError;
    }

    /**
     * Convert from KarmiaRPC response to JSON-RPC 2.0 response
     *
     * @param   {Object} request
     * @param   {Object} response
     * @returns {Object}
     */
    static convert(request, response) {
        const self = this,
            batch = Array.isArray(request);
        request = (batch) ? request : [(request || {})];
        response = (batch) ? response : [(response || {})];

        const result = response.reduce((collection, value, index) => {
            if (!('id' in request[index])) {
                return collection;
            }

            const data = {
                jsonrpc: '2.0',
                id: request[index].id
            };
            if (value instanceof Error) {
                data.error = Object.getOwnPropertyNames(value).reduce((error, property_name) => {
                    error[property_name] = value[property_name];

                    return error;
                }, {});

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
    static convertError(error) {
        const message = (error.message) ? error.message.toLowerCase() : '';
        if ('not found' === message) {
            error.code = -32601;
            error.message = 'Method not found';

            return error;
        }

        if ('bad request' === message) {
            error.code = -32602;
            error.message = 'Invalid params';

            return error;
        }

        if ('internal server error' === message) {
            error.code = -32603;
            error.message = 'Internal error';

            return error;
        }

        return error;
    }
}



// Export modules
module.exports = () => {
    return new KarmiaConverterJSONRPC();
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */

