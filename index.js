function assert(cond) {
    if (!cond) {
        throw new Error('Assertion failed');
    }
}

assert.assert = assert;
assert.default = assert;
assert.unchecked = function() {};
assert.unreachable = function() {
    throw new Error('Reached unreachable code');
};

assert.dev = function(cond) {
    if (process.env.NODE_ENV !== 'production') {
        assert(cond);
    }
};

assert.eq = function(left, right) {
    if (left !== right) {
        throw new Error('Equality assertion failed\nleft: ' + left
            + '\nright: ' + right);
    }
};

module.exports = assert;
