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

    function testShapePairs(shapes) {
        // Test all the correct pairs
        for (const [shape, matches, mismatches] of shapes) {
            for (const value of matches) {
                assertmin.shape(value, shape);
            }

            if (mismatches) {
                for (const value of mismatches) {
                    assert.throws(() => assertmin.shape(value, shape));
                }
            }
        }

        // Test all the incorrect pairs throw
        for (const [shape] of shapes) {
            for (const [otherShape, values] of shapes) {
                if (otherShape !== shape) {
                    for (const value of values) {
                        assert.throws(() => assertmin.shape(value, shape));
                    }
                }
            }
        }
    }

    describe('Shape matching', () => {
        it("Should check primitives properly", () => {
            testShapePairs([
                [undefined, [undefined], [null, 123, {}, true]],
                [Boolean, [true, false], [0, 1, {}]],
                [Number, [0, 420, 69.99, -Infinity, Infinity, NaN], [0n, "0", "1", true]],
                [BigInt, [0n, 69n], [0, NaN, -Infinity]],
                [String, ['', 'hello'], [null, new String("nope")]],
                [Symbol, [Symbol.asyncIterator, Symbol(), Symbol("amongus")]],
                [Function, [() => {}, function() {}, Array.prototype.slice, class {}, new Function()]],
                [Object, [{}, { a: 123 }, Object.create(null), null, new String("boohoo")]]
            ]);
        });

        it("Should check tuples", () => {
            testShapePairs([
                [Tuple(),
                    [ [] ],
                    [ [123], [undefined], [,] ]
                ],
                [Tuple(undefined),
                    [ [undefined], [,] ],
                    [ [,,], [,undefined], [null] ]
                ],
                [Tuple(Number),
                    [ [123], [123,] ]
                ],
                [Tuple(String, Number),
                    [ ["hello", 123 ], [ "", Infinity] ]
                ],
                [Tuple(Object, Array, Tuple(Number), null),
                    [ [{}, [], [123], null] ]
                ]
            ]);
        });

        it("Should check AnyOf combinators", () => {
            testShapePairs([
                [AnyOf(Boolean, Number),
                    [1, true, false, 0, NaN, Infinity],
                    [{}, 0n, "hello"]
                ],
                [AnyOf([Number], Tuple(Number, Number)),
                    [ [123, 456], [NaN, -Infinity] ]
                ]
            ]);
        });

        it("Should check arrays", () => {
            // Empty arrays always match
            assertmin.shape([], [Number]);
            assertmin.shape([], [String]);
            assertmin.shape([], [Object]);
            assertmin.shape([], [null]);
            assertmin.shape([], Array(BigInt));
            assertmin.shape([], Array(AnyOf(Number, String, Function, Object, Array)));

            // Exclusivity should be easy with the empty array out of the way
            testShapePairs([
                [[Number],
                    [ [123], [Infinity, -NaN] ],
                    [ "hallo" ]
                ],
                [[String],
                    [ ["hello", "hi", "I'm the problem", "it's me"], [''] ],
                    [ "nope", null, [123, "boo"] ]
                ]
            ]);
        });

        it("Should check structures of objects", () => {
            testShapePairs([
                [{},
                    [ {}, { keys: 123 }, { dont: 'matter' }],
                    [ null, 123, 'string' ]
                ]
            ]);

            assertmin.shape({ a: null, b: 123, c: { d: "aaa", e: { f: [undefined], g: [undefined] }}}, {
                a: null,
                b: Number,
                c: {
                    d: String,
                    e: AnyOf(null, undefined, {
                        f: [undefined],
                        g: Tuple(undefined)
                    })
                }
            });
        });
    });
});
