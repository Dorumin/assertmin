all other assertion packages on this damned registry are awful

god awful.

just use this one, it's like 4 lines of code and typescript declarations

it runs on the browser without polyfills like `process` for `assert`

```ts
import { assert } from 'assertmin';

// Boolean assertions
assert(2 + 2 === 4);

function isGoodBoy(name) {
    return name === 'dog';
}

assert(isGoodBoy('dog'));
assert(!isGoodBoy('doru'));

// Equality assertions
assert.eq(
    Math.ceil(Math.random() * 42),
    42
);

// TypeScript assertions
type Arg = number | null;

function pad(n: Arg) {
    // By the point this function is called, you're certain `n` is a number
    // But typescript doesn't know that, so assert that is the case
    assert(n !== null);

    // If you're particularly confident, you can use `assert.unchecked`
    // It won't perform any checks internally, but will still assert
    // to typescript that the condition is true

    // If you have webpack or another smart bundler,
    // `assert.dev` only runs code when `process.env.NODE_ENV`
    // is not equal to "production"

    // Now you can use it normally
    return n.toString().padStart(2, '0');
}

// Exhaustiveness checks
type A = {
    letter: 'a';
};
type B = {
    letter: 'b';
};
type Letter = A | B;

const letter: Letter = {
    letter: 'b';
};

switch (letter.letter) {
    case 'a':
        break;
    case 'b':
        // Try commenting this case out
        break;
    default:
        assert.unreachable(letter);
}

// Shape assertions

// Assert primitives
assert.shape(undefined, undefined);
assert.shape(null, null);
assert.shape(true, Boolean);
assert.shape(1, Number);
assert.shape(1n, BigInt);
assert.shape("hi", String);
assert.shape(Symbol(), Symbol);
assert.shape(() => {}, Function);
assert.shape([], Object);
assert.shape({}, Object);

// Combinator shapes
import { Tuple, AnyOf, Any } from 'assertmin';

assert.shape([ 1, true, {}, "yeah" ], Tuple(Number, Boolean, Any, String));
assert.shape(null, AnyOf(Array, Object, null));

// Object shapes
// Similar "minimum interface" checking like TypeScript
assert.shape({ unchecked: true }, {});
assert.shape({ a: 123 }, { a: Number });
assert.shape(
    {
        a: true,
        x: {
            b: 123,
            y: {
                c: "yeah"
            }
        }
    },
    {
        a: Boolean,
        x: {
            b: Number,
            y: {
                c: String
            }
        }
    }
);

// Shape checking is interesting for runtime type checking, but it
// does not integrate directly with TypeScript types
// You will need to cast a value to an appropriate type after checking its shape,
// so it's liable to becoming out of sync with the type being casted to.
```
