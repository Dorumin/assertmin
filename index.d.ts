interface Assert {
    (assertion: boolean, message?: string): asserts assertion;

    dev(assertion: boolean, message?: string): asserts assertion;
    unchecked(assertion: boolean, impossible?: string): asserts assertion;
    unreachable(x: never, message?: string): never;
    eq<T>(left: T, right: T): void;
    ne<T>(left: T, right: T): void;

    throws(closure: () => void, message?: string): any;
    ok(closure: () => T, message?: string): T;

    assert: Assert;
}

declare const assert: Assert;
export = assert;
