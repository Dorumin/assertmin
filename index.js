function assert(assertion) {
    if (!assertion) {
        throw new Error('Assertion failed');
    }
}

assert.assert = assert;
assert.unchecked = function() {};

module.exports = assert;
