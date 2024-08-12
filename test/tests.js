// @ts-check

require('fix-esm').register();

const { describe } = require('mocha');
const { assert: assertmin, Tuple, AnyOf, Any } = require('../index.js');
const { assert } = require('chai');

describe('Assertions', () => {
    describe('Boolean asserts', () => {
        it("Works fine when asserting true", () => {
            assertmin(true);
        });

        it("Throws when asserting false", () => {
            assert.throws(() => assertmin(false), 'Assertion failed');
        });
    });

    describe("Unchecked assertions", () => {
        it("Should never throw at runtime", () => {
            assertmin.unchecked(true);
            assertmin.unchecked(false);
        });
    });

    describe('Environment assertions', () => {
        describe('Dev assertions on dev', () => {
            before(() => process.env.NODE_ENV = 'development');
            after(() => process.env.NODE_ENV = 'development');

            it("Should be checked correctly", () => {
                assertmin.dev(true);
                assert.throws(() => assertmin.dev(false), 'Assertion failed');
            });
        });

        describe('Dev assertions on prod', () => {
            before(() => process.env.NODE_ENV = 'production');
            after(() => process.env.NODE_ENV = 'production');

            it("Should not check assertions at runtime", () => {
                assertmin.dev(true);
                assertmin.dev(false);
            });
        });
    });
});
