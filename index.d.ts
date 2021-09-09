interface Assert {
    (assertion: boolean): asserts assertion;

    dev(assertion: boolean): asserts assertion;
    unchecked(assertion: boolean): asserts assertion;
    unreachable(x: never): never;
    eq<T>(left: T, right: T): void;

    assert: Assert;
}

declare const assert: Assert;
export = assert;
