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

const typeofShapes = new Map();
typeofShapes.set(undefined, 'undefined');
typeofShapes.set(Boolean, 'boolean');
typeofShapes.set(Number, 'number');
typeofShapes.set(BigInt, 'bigint');
typeofShapes.set(String, 'string');
typeofShapes.set(Symbol, 'symbol');
typeofShapes.set(Function, 'function');
typeofShapes.set(Object, 'object');

function Tuple(shapes) {
    this.shapes = shapes;
}

assert.Tuple = function(...shapes) {
    return new Tuple(shapes);
};

function AnyOf(shapes) {
    this.shapes = shapes;
}

assert.AnyOf = function(...shapes) {
    return new AnyOf(shapes);
};

function AnyType() {}

const Any = new AnyType();
assert.Any = Any;

function checkShape(value, shape) {
    const typeofShape = typeofShapes.get(shape);

    if (typeofShape !== undefined) {
        if (typeof value !== typeofShape) {
            return `Typeof value did not match "${typeofShape}", was "${typeof value}"`;
        }

        return true;
    }

    if (shape === Any) {
        return true;
    }

    if (shape === null) {
        if (value !== null) {
            return 'Shape assertion failed\nValue is not null';
        }

        return true;
    }

    if (shape === Array) {
        return checkShape(value, [Any]);
    }

    if (shape instanceof AnyOf) {
        if (shape.shapes.every(shape => checkShape(value, shape) !== true)) {
            return 'Shape assertion failed\nNone of the shapes matched\nShape: AnyOf()';
        }

        return true;
    }

    if (shape instanceof Tuple) {
        if (!Array.isArray(value)) {
            return 'Shape assertion failed\nValue is not an array\nValue:' + value + '\nShape: Tuple()';
        }

        if (value.length !== shape.shapes.length) {
            return 'Shape assertion failed\nLength mismatch\nValue:' + value + '\nShape: Tuple()';
        }

        const mismatches = [];
        for (let index = 0; index < value.length; index++) {
            const item = value[index];
            const inner = shape.shapes[index];
            const result = checkShape(item, inner);

            if (result !== true) {
                mismatches.push({
                    result,
                    shape: inner,
                    value: item,
                    index
                });
            }
        }

        if (mismatches.length > 0) {
            return (
                'Shape assertion failed\nTuple values mismatch\n' + mismatches.map(r =>
                    `Value #${r.index}: ${r.value}\nShape #${r.index}: ${r.shape}\n${r.result}`
                )
                .join('\n')
            );
        }

        return true;
    }

    if (Array.isArray(shape)) {
        if (shape.length !== 1) {
            return 'Shape assertion failed\nArray shapes must be 1-element long. For checking a tuple, use assert.Tuple';
        }

        if (!Array.isArray(value)) {
            return 'Shape assertion failed\nValue is not an array\nValue:' + value;
        }

        const inner = shape[0];

        const mismatches = [];
        for (let index = 0; index < value.length; index++) {
            const item = value[index];
            const result = checkShape(item, inner);

            if (result !== true) {
                mismatches.push({
                    result,
                    value: item,
                    index
                });
            }
        }

        if (mismatches.length > 0) {
            return (
                'Shape assertion failed\nInner array shape mismatch\n' + mismatches.map(r =>
                    `Value #${r.index}: ${r.value}\n${r.result}`
                )
                .join('\n')
            );
        }

        return true;
    }

    if (typeof shape === 'object') {
        if (String(shape) !== '[object Object]') {
            return 'Shape must be a plain old JavaScript object';
        }

        if (value === null) {
            return 'Value is null';
        }

        if (typeof value !== 'object' && typeof value !== 'function') {
            return 'Value must be an object or function';
        }

        const mismatches = [];
        for (const key in shape) {
            const keyValue = value[key];
            const keyShape = shape[key];

            const result = checkShape(keyValue, keyShape);

            if (result !== true) {
                mismatches.push({
                    key,
                    result,
                    value: keyValue,
                    shape: keyShape
                });
            }
        }

        if (mismatches.length > 0) {
            return (
                'Shape assertion failed\nInner object shape mismatch\n' + mismatches.map(r =>
                    `Value for ${r.key}: ${r.value}\nShape for ${r.key}: ${r.shape}\n${r.result}`
                )
                .join('\n')
            );
        }

        return true;
    }

    return 'Invalid shape was passed to assert.shape. Must be a primitive value, an AnyOf, a Tuple, an array of a type, Array, Object, or an object of type mappings';
}

function assertShape(value, shape) {
    const result = checkShape(value, shape);
    if (result !== true) {
        throw new Error(result);
    }
}

// Runtime assertion of the shape of a value
assert.shape = function(value, shape) {
    assertShape(value, shape);
};

module.exports = assert;
