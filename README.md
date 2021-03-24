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
```

The example above is way longer than the actual source code
