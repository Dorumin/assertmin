function assert(cond, msg) {
    if (!cond) {
        throw new Error(msg || 'Assertion failed');
    }
}

assert.assert = assert;
assert.default = assert;
assert.unchecked = function() {};
assert.unreachable = function(_, msg) {
    throw new Error(msg || 'Reached unreachable code');
};

assert.dev = function(cond, msg) {
    if (process.env.NODE_ENV !== 'production') {
        assert(cond, msg);
    }
};

assert.eq = function(left, right) {
    if (left !== right) {
        throw new Error('Equality assertion failed\nleft: ' + left
            + '\nright: ' + right);
    }
};

assert.ne = function(left, right) {
    if (left === right) {
        throw new Error('Inequality assertion failed\nleft: ' + left
            + '\nright: ' + right);
    }
};

assert.throws = function(closure, msg) {
    try {
        closure();
        throw new Error(msg ?? 'Expected closure to throw and it did not');
    } catch(e) {
        return e;
    }
};

assert.ok = function(closure, msg) {
    try {
        return closure();
    } catch(e) {
        throw new Error(msg ?? 'Closure threw an exception');
    }
};

module.exports = assert;
