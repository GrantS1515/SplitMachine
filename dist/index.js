import * as E from "fp-ts/lib/Either.js";
import { pipe } from 'fp-ts/lib/function.js';
import * as A from "fp-ts/lib/Array.js";
import * as M from "fp-ts/lib/Monoid.js";
import { produce } from "immer";
import * as Sp from "SplitString/dist/index.js";
import * as EqTo from "eq-to/dist/index.js";
import * as Utils from "fptsutils/dist/monoids.js";
export const nextState = mach => {
    return pipe(mach.transitions.get(mach.currentState.id), (v) => v === undefined ?
        E.left(newErr("Undefined Transition")) :
        E.right(v), E.map(A.map((fn) => fn(mach.currentState.split))), E.chain(M.concatAll(Utils.leftMostEither(newErr("No valid state")))));
};
export const errEq = e => pipe(e, EqTo.checkField("name")(EqTo.basicEq), E.chain(EqTo.checkField("msg")(EqTo.basicEq)));
const defaultErr = {
    name: "Err",
    msg: "SplitMachine Error"
};
export const newErr = msg => produce(defaultErr, draft => {
    draft.msg = msg;
});
export const stateEq = v => pipe(v, EqTo.checkField("name")(EqTo.basicEq), E.chain(EqTo.checkField("id")(EqTo.basicEq)), E.chain(EqTo.checkField("split")(Sp.splitStringEq)));
