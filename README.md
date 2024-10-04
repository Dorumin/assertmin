all other assertion packages on this damned registry are awful

god awful.

Just use this one, it's like 4 lines of code and typescript declarations

It runs on the browser without polyfills like `process` for `assert`. Works well with `io-ts`.

If you want something for test harnesses and more of a natural/flexible style, you may want to use mocha and chai instead.

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
    // Otherwise useful if you want this function to be a contract checker
    // and raise an exception to catch in the case of a violation
    assert(n !== null, "pad should never be called with null");

    // If you're particularly confident, you can use `assert.unchecked`
    // It won't perform any checks internally, but will still assert
    // to typescript that the condition is true
    assert.unchecked(n <= -1, "no negative padding");

    // If you have webpack or another smart bundler,
    // `assert.dev` only runs code when `process.env.NODE_ENV`
    // is not equal to "production"
    assert.dev(n > 1000000, "millions range reserved for production");

    // Now you can use it normally
    // All assertion messages above are optional - will be replaced by a generic assertion error
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

// Works well with io-ts
import * as t from 'io-ts';

const Anonymous = t.type({
    type: t.literal('anonymous'),
    ip: t.string
});
const User = t.type({
    type: t.literal('user'),
    name: t.string,
    permissions: t.array(t.string)
});
const Response = t.union([ Anonymous, User ]);

const result = await (await fetch('...')).json();
assert(Response.is(result), "server returned something strange");
assert(result.type !== 'anonymous', "anons not allowed here");
assert(result.permissions.includes("admin"), "try becoming an admin");
```
