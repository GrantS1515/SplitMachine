import * as E from "fp-ts/lib/Either.js";
import { pipe } from 'fp-ts/lib/function.js';
import * as A from "fp-ts/lib/Array.js";
import { produce } from "immer";
import * as Sp from "SplitString/dist/index.js";
import * as EqTo from "eq-to/dist/index.js";
export const nextState = mach => initialId => sps => {
    return pipe(
    // mach.currentState.split,
    mach.currentState.id, mach.transitions.get, (v) => v === undefined ?
        E.left(newErr("Undefined Transition")) :
        E.right(v), (a) => A.map(fn => fn(mach.currentState.split)));
};
const defaultErr = {
    name: "Err",
    msg: "SplitMachine Error"
};
export const newErr = msg => produce(defaultErr, draft => {
    draft.msg = msg;
});
export const stateEq = v => pipe(v, EqTo.checkField("name")(EqTo.basicEq), E.chain(EqTo.checkField("id")(EqTo.basicEq)), E.chain(EqTo.checkField("split")(Sp.splitStringEq)));
