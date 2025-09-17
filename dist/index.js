import * as E from "fp-ts/lib/Either.js";
import * as B from "fp-ts/lib/boolean.js";
import { pipe } from 'fp-ts/lib/function.js';
import * as A from "fp-ts/lib/Array.js";
import * as M from "fp-ts/lib/Monoid.js";
import { produce } from "immer";
import * as Sp from "SplitString/dist/index.js";
import * as EqTo from "eq-to/dist/index.js";
import * as Ma from "fp-ts/lib/Map.js";
import * as Utils from "fptsutils/dist/monoids.js";
import { newErr } from "fptsutils/dist/error.js";
export const newState = id => sp => ({ name: "State", id: id, split: sp });
export const stateEq = v => pipe(v, EqTo.checkField("name")(EqTo.basicEq), E.chain(EqTo.checkField("id")(EqTo.basicEq)), E.chain(EqTo.checkField("split")(Sp.splitStringEq)));
export const newMachineWDefStop = transitions => {
    const defStop = sps => pipe(({
        name: "State",
        id: "stop",
        split: sps,
    }), (s) => s, E.right);
    const appendDefStopFn = stateFns => pipe(stateFns, A.concat([defStop]));
    return pipe(transitions, Ma.map(appendDefStopFn), t => ({
        name: "Machine",
        transitions: t,
        stopId: "stop"
    }), (m) => m);
};
export const _nextState = mach => st => {
    return pipe(mach.transitions.get(st.id), (v) => v === undefined ?
        E.left(newErr(`Undefined Transition to id ${st.id}`)) :
        E.right(v), E.map(A.map((fn) => fn(st.split))), E.chain(M.concatAll(Utils.leftMostEither(newErr(`No valid state given id ${st.id} ${st.split.sep.left}`)))));
};
export const interp = mach => st => {
    const _interp = mach => st => {
        if (st.id === mach.stopId) {
            return E.right(st);
        }
        else {
            return pipe(st, _nextState(mach), E.chain(_interp(mach)));
        }
    };
    return pipe(st, _interp(mach), E.map(s => s.split));
};
export const newStateShiftFn = id => pred => sps => {
    const fnArgs = produce(defaultGenFnArgs, draft => {
        draft.strLen = 1;
        draft.testFn = pred;
        draft.splitFn = Sp.shiftLeft(1);
    });
    return pipe(sps, newStateGenFn(id)(fnArgs));
};
const defaultGenFnArgs = {
    name: "GenFnArgs",
    strLen: 1,
    testFn: () => false,
    splitFn: (sp) => E.right(sp),
};
export const newStateGenFn = id => args => sps => pipe(sps, Sp.leadRight(args.strLen), E.map(args.testFn), E.chain(b => B.match(() => E.left(newErr(`Input not recognized by testFn`)), () => args.splitFn(sps))(b)), E.map(sp => ({ name: "State", id: id, split: sp })));
// stop when right is empty
export const newStopFn = id => sps => pipe(sps, Sp.isRightEmpty, E.map(sp => ({ name: "State", id: id, split: sp })));
