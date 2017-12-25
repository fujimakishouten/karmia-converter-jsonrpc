/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Variables
const expect = require('expect.js'),
    karmia_converter_jsonrpc = require('../'),
    converter = karmia_converter_jsonrpc();


describe('karmia-converter-jsonrpc', function () {
    describe('convert', function () {
        describe('Should convert response', function () {
            it('Success', function () {
                const request = {jsonrpc: '2.0', method: 'success', id: 'success'},
                    response = {success: true},
                    result = converter.convert(request, response);

                expect(result.jsonrpc).to.be('2.0');
                expect(result.result).to.eql({success: true});
                expect(result.id).to.be(request.id);
            });

            it('Error', function () {
                const request = {jsonrpc: '2.0', method: 'error', id: 'error'},
                    response = new Error('TEST_EXCEPTION');
                response.code = 500;

                const result = converter.convert(request, response);
                expect(result.jsonrpc).to.be('2.0');
                expect(result.error.code).to.eql(500);
                expect(result.error.message).to.eql('TEST_EXCEPTION');
                expect(result.id).to.be(request.id);
            });

            it('ID is null', function () {
                const request = {jsonrpc: '2.0', method: 'success', id: null},
                    response = {success: true},
                    result = converter.convert(request, response);

                expect(result.jsonrpc).to.be('2.0');
                expect(result.result).to.eql({success: true});
                expect(result.id).to.be(request.id);
            });

            describe('Notification', function () {
                it('Success', function () {
                    const request = {jsonrpc: '2.0', method: 'success'},
                        response = {success: true},
                        result = converter.convert(request, response);

                    expect(result).to.be(null);
                });

                it('Error', function () {
                    const request = {jsonrpc: '2.0', method: 'error'},
                        response = new Error('TEST_EXCEPTION');
                    response.code = 500;

                    const result = converter.convert(request, response);
                    expect(result).to.be(null);
                });
            });

            describe('Batch request', function () {
                const request = [
                        {jsonrpc: '2.0', method: 'success', id: 'success'},
                        {jsonrpc: '2.0', method: 'error', id: 'error'}
                    ],
                    error = new Error('TEST_EXCEPTION');
                error.code = 500;

                const response = [
                        {success: true},
                        error
                    ],
                    result = converter.convert(request, response);

                result.forEach(function (value, index) {
                    expect(result[index].jsonrpc).to.be('2.0');
                    expect(result[index].id).to.be(request[index].id);
                });

                expect(result[0].result).to.eql({success: true});
                expect(result[1].error.code).to.be(500);
                expect(result[1].error.message).to.be('TEST_EXCEPTION');
            });
        });
    });

    describe('convertError', function () {
        describe('Should convert error response', function () {
            describe('errorConverer', function () {
                it('Invalid request', function () {
                    const response = new Error('Invalid request');
                    response.code = -32600;

                    const result = converter.convertError(response);
                    expect(result.code).to.be(response.code);
                    expect(result.message).to.be(response.message);
                });

                it('Method not found', function () {
                    const response = new Error('Not Found');
                    response.code = 404;

                    const result = converter.convertError(response);
                    expect(result.code).to.be(-32601);
                    expect(result.message).to.be('Method not found');
                });

                it('Invalid params', function () {
                    const response = new Error('Bad request');
                    response.code = 400;

                    const result = converter.convertError(response);
                    expect(result.code).to.be(-32602);
                    expect(result.message).to.be('Invalid params');
                });

                it('Internal error', function () {
                    const response = new Error('Internal Server Error');
                    response.code = 500;

                    const result = converter.convertError(response);
                    expect(result.code).to.be(-32603);
                    expect(result.message).to.be('Internal error');
                });
            });

            describe('converter', function () {
                it('Invalid request', function () {
                    const request = {method: 'error', id: 'error'},
                        response = new Error('Invalid request');
                    response.code = -32600;

                    const result = converter.convert(request, response);
                    expect(result.error.code).to.be(-32600);
                    expect(result.error.message).to.be('Invalid request');
                    expect(result.id).to.be(request.id);
                });

                it('Method not found', function () {
                    const request = {jsonrpc: '2.0', id: 'error'},
                        response = new Error('Not Found');
                    response.code = 404;

                    const result = converter.convert(request, response);
                    expect(result.error.code).to.be(-32601);
                    expect(result.error.message).to.be('Method not found');
                    expect(result.id).to.be(request.id);
                });

                it('Invalid params', function () {
                    const request = {jsonrpc: '2.0', method: 'badRequest', id: 'error'},
                        response = new Error('Bad request');
                    response.code = 400;

                    const result = converter.convert(request, response);
                    expect(result.error.code).to.be(-32602);
                    expect(result.error.message).to.be('Invalid params');
                    expect(result.id).to.be(request.id);
                });

                it('Internal error', function () {
                    const request = {jsonrpc: '2.0', method: 'internalServerError', id: 'error'},
                        response = new Error('Internal Server Error');
                    response.code = 500;

                    const result = converter.convert(request, response);
                    expect(result.error.code).to.be(-32603);
                    expect(result.error.message).to.be('Internal error');
                    expect(result.id).to.be(request.id);
                });
            });
        });
    });
});



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
