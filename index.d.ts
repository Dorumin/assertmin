interface assert {
    (assertion: boolean): asserts assertion;
    unchecked(assertion: boolean): asserts assertion;
}

export declare const assert: assert;
