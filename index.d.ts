interface assert {
    (assertion: boolean): asserts assertion;
    eq<T>(left: T, right: T): void;
    unchecked(assertion: boolean): asserts assertion;
}

export declare const assert: assert;
