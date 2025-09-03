import * as E from "fp-ts/lib/Either.js";
import * as B from "fp-ts/lib/boolean.js";
import { pipe } from 'fp-ts/lib/function.js';
import * as A from "fp-ts/lib/Array.js";
import * as M from "fp-ts/lib/Monoid.js";
import { produce } from "immer";
import * as Sp from "SplitString/dist/index.js";
import * as EqTo from "eq-to/dist/index.js";
import * as Utils from "fptsutils/dist/monoids.js";
export const nextState = mach => st => {
    return pipe(mach.transitions.get(st.id), (v) => v === undefined ?
        E.left(newErr(`Undefined Transition to id ${st.id}`)) :
        E.right(v), E.map(A.map((fn) => fn(st.split))), E.chain(M.concatAll(Utils.leftMostEither(newErr(`No valid state given id ${st.id}`)))));
};
export const interp = mach => st => {
    const _interp = mach => st => {
        if (st.id === mach.stopId) {
            return E.right(st);
        }
        else {
            return pipe(st, nextState(mach), E.chain(_interp(mach)));
        }
    };
    return pipe(st, _interp(mach), E.map(s => s.split));
};
export const errEq = e => pipe(e, EqTo.checkField("name")(EqTo.basicEq), E.chain(EqTo.checkField("msg")(EqTo.basicEq)));
const defaultErr = {
    name: "Err",
    msg: "SplitMachine Error"
};
export const newErr = msg => produce(defaultErr, draft => {
    draft.msg = msg;
});
export const newStateShiftFn = id => args => sps => pipe(sps, Sp.leadRight(args.strLen), E.map(args.testFn), E.chain(b => B.match(() => E.left(newErr(`Input not recognized by testFn`)), () => Sp.shiftLeft(args.strLen)(sps))(b)), E.map(sp => ({ name: "State", id: id, split: sp })));
export const newStateGenFn = id => args => sps => pipe(sps, Sp.leadRight(args.strLen), E.map(args.testFn), E.chain(b => B.match(() => E.left(newErr(`Input not recognized by testFn`)), () => args.splitFn(sps))(b)), E.map(sp => ({ name: "State", id: id, split: sp })));
export const newStopFn = id => sps => pipe(sps, Sp.isRightEmpty, E.map(sp => ({ name: "State", id: id, split: sp })));
export const stateEq = v => pipe(v, EqTo.checkField("name")(EqTo.basicEq), E.chain(EqTo.checkField("id")(EqTo.basicEq)), E.chain(EqTo.checkField("split")(Sp.splitStringEq)));
