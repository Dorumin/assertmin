type AnyOfInst = {
    shapes: Shape[];
}

function AnyOf(...shapes: Shape): AnyofInst;

type TupleInst = {
    shapes: Shape[];
}

function Tuple(...shapes: Shape): TupleInst;

type Any = {};

export type Shape =
    undefined
    | null
    | typeof Boolean
    | typeof Number
    | typeof BigInt
    | typeof Symbol
    | typeof String
    | typeof Function
    | typeof Array
    | typeof Object
    | TupleInst
    | AnyOfInst
    | Shape[]
    | { [key: string]: Shape };

interface Assert {
    (assertion: boolean): asserts assertion;

    dev(assertion: boolean): asserts assertion;
    unchecked(assertion: boolean): asserts assertion;
    unreachable(x: never): never;
    eq<T>(left: T, right: T): void;
    shape(value: any, shape: Shape): void;

    assert: Assert;
    AnyOf: typeof AnyOf;
    Tuple: typeof Tuple;
    Any: Any;
}

declare const assert: Assert;
export = assert;
